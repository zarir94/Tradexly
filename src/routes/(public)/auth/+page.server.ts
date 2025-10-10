//@ts-nocheck
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import prisma from "$main/src/lib/prisma";
import { comparePassword, getSettings, hashPassword, isEmailAcceptable, isUsernameOK } from "$main/src/lib/func";

function daysFromNow(x: number): Date {
    const d = new Date();
    d.setDate(d.getDate() + x);
    return d;
}

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.session) {
        redirect(302, '/dashboard')
    }
};

export const actions: Actions = {
    login: async ({ request, locals, cookies }) => {
        let toRun = ()=>{};
        try {
            let { username, password } = Object.fromEntries((await request.formData()).entries());
            let u;
            if (username?.indexOf('@')!=-1) {
                u = await prisma.user.findFirst({ where: { email: username } })
            } else {
                u = await prisma.user.findFirst({ where: { username } })
            }
            if (!u) return {type: 'error', message: 'The Account doesnt exists on the given username/email'};
            if (!await comparePassword(password, u.passwordHash)) return {type: 'error', message: 'Invalid Password!'};

            let loc = null;
            try {
                loc = await fetch('http://ip-api.com/json/' + ip).then((r) => r.json()).then((d)=>([d.city, d.country].filter(Boolean).join(', ') || null));
            } catch (err) {}
            
            let ses = await prisma.session.create({ data: { userId: u.id, token: crypto.randomUUID(), user_agent: locals.userAgent, ip_address: locals.clientIP, location: loc, expiresAt: daysFromNow(30) } })

            cookies.set('session', ses.token, { path: '/', maxAge: 30 * 24 * 60 * 60, httpOnly: true, secure: false })
            toRun = ()=>{ redirect(302, '/dashboard') };
        } catch (err) {
            console.error(err);
            return {type: 'error', message: 'Something went wrong! Please try again later.'}
        }
        toRun();
    },
    register: async ({ request, locals, cookies }) => {
        try {
            let { site_name } = await getSettings('site_name');
            let affID = cookies.get('affID') || null;
            let ip = locals.clientIP;
            let { fullName, username, email, password, passwordConfirm } = Object.fromEntries((await request.formData()).entries());
            if (fullName?.split(' ').length < 2) return {type: 'error', message: 'Full Name must have at least 2 parts'};
            if (password != passwordConfirm) return {type: 'error', message: 'Password and Confirm Password does not match'};
            if (password?.length < 6) return {type: 'error', message: 'Password must be atleast 6 chars long'};
            if (!isUsernameOK(username.toString())) return {type: 'error', message: 'Username must start with a letter and contain 3-30 characters (letters, numbers, ., _, -)'};
            if (await prisma.user.findFirst({ where: { username } })) return {type: 'error', message: 'Username already exists, choose another'};
            if (await prisma.user.findFirst({ where: { email } })) return {type: 'error', message: 'This email is already registered'};
            let esr = await isEmailAcceptable(email);
            if (esr == false) return {type: 'error', message: 'The provided email is not acceptable. Email may be disposable or fake.'};
            let country = null;
            try {
                country = await fetch('http://ip-api.com/json/' + ip).then(r=>r.json()).then(d=>d.country || null);
            } catch (err) {}

            await prisma.$transaction(async (tx) => {
                let user = await tx.user.create({ data: { fullName, username, email, country, affID, passwordHash: await hashPassword(password) } });
                await tx.account.create({ data: { userId: user.id, type: 'DEMO', balance: 10000 } });
                await tx.account.create({ data: { userId: user.id, type: "LIVE", balance: 0 } });
                await tx.notification.create({ data: { userId: user.id, title: `Welcome to ${site_name}`, message: 'Your account has been successfully created. Start exploring the markets and experience seamless trading today.' } })
            })
            return { type: 'success', message: 'Account Registered Successfully!' }
        } catch (err) {
            console.error(err);
            return {type: 'error', message: 'Something went wrong! Please try again later.'}
        }
    }
};