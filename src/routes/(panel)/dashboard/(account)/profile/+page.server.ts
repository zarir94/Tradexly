import { getGravatarUrl, getSettings } from '$main/src/lib/func';
import prisma from '$main/src/lib/prisma';
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
	}
	if (user.kyc_valid && kycData && kycData.status != 'Approved') {
		await prisma.user.update({ where: { id: user.id }, data: { kyc_valid: false } })
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
		let ks = await createKYCsession(locals.session?.user.email as string);
		if (!ks) return { success: false, msg: 'Cannot Create KYC Session. Try Again Later!' };
		await prisma.user.update({ where: { id: locals.session?.user.id }, data: { kyc_id: ks.session_id } });
		return { success: true, msg: 'KYC Session Created!' };
	}
};

