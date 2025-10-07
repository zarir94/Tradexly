import { getExchangeRate, getGravatarUrl, getSettings, isUsernameOK, type currencyType } from '$main/src/lib/func';
import prisma from '$main/src/lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

type Status =
	| 'Not Started'
	| 'Not Finished'
	| 'In Progress'
	| 'In Review'
	| 'Approved'
	| 'Declined'
	| 'Pending';

async function createKYCsession(email: string) {
	let { didit_apikey, didit_workflowid } = await getSettings('didit_apikey', 'didit_workflowid');
	let r = await fetch('https://verification.didit.me/v2/session/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'x-api-key': String(didit_apikey)
		},
		body: JSON.stringify({ workflow_id: didit_workflowid, vendor_data: email })
	});
	if (!r.ok) {
		console.error('ERROR in createKYCsession:', await r.text());
		return null;
	};
	let d = await r.json();
	return { session_id: d.session_id, url: d.url };
}


async function deleteKYCsession(session_id: string) {
	let { didit_apikey } = await getSettings('didit_apikey');
	let r = await fetch(`https://verification.didit.me/v1/session/${session_id}/delete/`, {
		method: 'DELETE',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'x-api-key': String(didit_apikey)
		}
	});
	if (!r.ok) {
		console.error('ERROR in deleteKYCsession:', await r.text());
		return false;
	};
	return true;
}


async function fetchKYCsession(session_id: string) {
	let { didit_apikey } = await getSettings('didit_apikey');
	let r = await fetch(`https://verification.didit.me/v2/session/${session_id}/decision/`, {
		headers: {
			Accept: 'application/json',
			'x-api-key': String(didit_apikey)
		}
	});
	if (!r.ok) {
		console.error('ERROR in fetchKYCsession:', await r.text());
		return null;
	}
	let d = await r.json();
	let resp = {
		url: d.session_url as string,
		status: d.status as Status,
		steps: Object.fromEntries(d.features.map((n: string) => [n, d[n.toLowerCase()]?.status || 'Pending'])) as Record<string, Status>
	};
	return resp;
}


export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) { throw new Error('No session found') }

	let user = locals.session.user;
	let kycData = user.kyc_id ? await fetchKYCsession(user.kyc_id) : null;
	if (!user.kyc_valid && kycData?.status == 'Approved') {
		await prisma.user.update({ where: { id: user.id }, data: { kyc_valid: true } })
		prisma.purgeCache(`ses_${locals.session.token}`)
	}
	if (user.kyc_valid && kycData && kycData.status != 'Approved') {
		await prisma.user.update({ where: { id: user.id }, data: { kyc_valid: false } })
		prisma.purgeCache(`ses_${locals.session.token}`)
	}


	return {
		usrData: {
			createdAt: user.createdAt,
			email: user.email,
			username: user.username,
			fullName: user.fullName,
			kyc: kycData,
			country: user.country,
            img: getGravatarUrl(user.email, 150),
		}
	};
};


export const actions: Actions = {
	createKYC: async ({ request, locals }) => {
		if (locals.session?.user.kyc_id) {
			await deleteKYCsession(locals.session.user.kyc_id);
		}
		let ks = await createKYCsession(locals.session?.user.email as string);
		if (!ks) return { success: false, msg: 'Cannot Create KYC Session. Try Again Later!' };
		await prisma.user.update({ where: { id: locals.session?.user.id }, data: { kyc_id: ks.session_id } });
		prisma.purgeCache(`ses_${locals.session?.token}`);
		return { success: true, msg: 'KYC Session Created!' };
	},
	updateProfile: async ({ request, locals }) => {
		let { fullName, username, country } = Object.fromEntries((await request.formData()).entries());
		if (!(fullName && username && country)) return fail(400, { success: false, msg: 'Please fill up all the required fields' });
		if (fullName.toString().trim().split(' ').filter(Boolean).length < 2) return fail(400, { success: false, msg: 'Full Name must contain at least 2 words' });
		if (!isUsernameOK(username.toString())) return fail(400, { success: false, msg: 'Username must start with a letter and contain 3-30 characters (letters, numbers, ., _, -)' });
		if (await prisma.user.findFirst({ where: { username: username.toString().trim(), id: { not: locals.session?.userId } } })) return fail(400, { success: false, msg: 'Username is already used by another user' });
		await prisma.user.update({ where: { id: locals.session?.userId }, data: { fullName: fullName.toString().trim(), username: username.toString().trim(), country: country.toString().trim() } })
		prisma.purgeCache(`ses_${locals.session?.token}`);
		return { success: true, msg: 'Profile saved successfully' };
	},
	deleteAccount: async ({ locals, cookies }) => {
		let accs = await prisma.account.findMany({ where: { userId: locals.session?.userId, type: 'LIVE', balance: { gt: 0 } }, select: { balance: true, currency: true } });
		let totalUSD = (await Promise.all(accs.map(async (a)=>{
			if (a.currency.toLowerCase() == 'usd') return a.balance;
			return a.balance * await getExchangeRate(a.currency as currencyType, 'usd');
		}))).reduce((a, b) => a + b, 0);
		await prisma.$transaction(async (tx)=>{
			if (totalUSD) {
				await tx.earnings.create({ data: { amount: totalUSD, for: 'ADMIN', from: locals.session?.user.username as string, reason: 'Account Deletion' } })
			}
			await tx.user.delete({ where: { id: locals.session?.userId } });
		})
		cookies.delete('session', { path: '/' });
		prisma.purgeCache(`ses_${locals.session?.token}`);
		redirect(307, '/');
	}
};
