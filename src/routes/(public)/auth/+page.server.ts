//@ts-nocheck
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import prisma from "$main/src/lib/prisma";
import bcrypt from "bcrypt";
import { isEmailAcceptable } from "$main/src/lib/utils";

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
            if (!await bcrypt.compare(password, u.passwordHash)) return {type: 'error', message: 'Invalid Password!'};
            let ses = await prisma.session.create({ data: { userId: u.id, token: crypto.randomUUID(), user_agent: locals.userAgent, ip_address: locals.clientIP, expiresAt: daysFromNow(30) } })

            cookies.set('session', ses.token, { path: '/', maxAge: 30 * 24 * 60 * 60, httpOnly: true })
            toRun = ()=>{ redirect(302, '/dashboard') };
        } catch (err) {
            console.error(err);
            return {type: 'error', message: 'Something went wrong! Please try again later.'}
        }
        toRun();
    },
    register: async ({ request, locals, cookies }) => {
        try {
            let affID = cookies.get('affID') || null;
            let ip = locals.clientIP;
            let { fullName, username, email, password, passwordConfirm } = Object.fromEntries((await request.formData()).entries());
            if (fullName?.split(' ').length < 2) return {type: 'error', message: 'Full Name must have at least 2 parts'};
            if (password != passwordConfirm) return {type: 'error', message: 'Password and Confirm Password does not match'};
            if (await prisma.user.findFirst({ where: { username } })) return {type: 'error', message: 'Username already exists, choose another'};
            if (await prisma.user.findFirst({ where: { email } })) return {type: 'error', message: 'This email is already registered'};
            let esr = await isEmailAcceptable(email);
            if (esr == false) return {type: 'error', message: 'The provided email is not acceptable. Email may be disposable or fake.'};
            let country = await fetch('http://ip-api.com/json/' + ip).then(r=>r.json()).then(d=>d.country || null);

            await prisma.$transaction(async (tx) => {
                let user = await tx.user.create({ data: { fullName, username, email, country, affID, passwordHash: await bcrypt.hash(password, 5) } });
                await tx.account.create({ data: { userId: user.id, type: 'DEMO', balance: 10000 } });
                await tx.account.create({ data: { userId: user.id, type: "LIVE", balance: 0 } });
            })
            return { type: 'success', message: 'Account Registered Successfully!' }
        } catch (err) {
            console.error(err);
            return {type: 'error', message: 'Something went wrong! Please try again later.'}
        }
    }
};