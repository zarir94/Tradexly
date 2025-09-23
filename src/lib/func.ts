import bcrypt from "bcryptjs";
import prisma from "./prisma";
import currencies from "./currencies";
import { createHash } from "node:crypto";

function parseValue(val: string): string | number | boolean {
	if (val === 'true') return true;
	if (val === 'false') return false;

	if (!isNaN(Number(val)) && val.trim() !== '') {
		return Number(val);
	}
	return val;
}

export async function getSettings(...keys: string[]) {
    let r = await prisma.settings.findMany({ where: { key: { in: keys } } });
    let d = Object.fromEntries(r.map(i => [i.key, parseValue(i.value)]));
    return d;
}

export async function isEmailAcceptable(email: string) {
	let r = await fetch('https://nobounce.onrender.com/?email=' + email);
	if (!r.ok) return null;
	let d = await r.json();
	if (!d.success) {
		console.error('NoBounce Error:', d.trace);
		return null
	};
	if (d.result?.exists == false) return false;
	if (d.result?.temp == true) return false;
	if (d.result?.exists == true && d.result?.temp == false) return true;
	return null;
}

export async function hashPassword(password: string) {
	return await bcrypt.hash(password, await bcrypt.genSalt(7))
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}

export async function getExchangeRate(from: keyof typeof currencies, to: keyof typeof currencies) {
	let f = from.toLowerCase().trim();
	let t = to.toLowerCase().trim();
	let fn = async (u: string)=>{
		let r = await fetch(u);
		let d = await r.json();
		let ex = d[f][t];
		if (!Number.isFinite(ex)) throw new Error('Cannot find the rate. API Broken maybe');
		return ex;
	}
	try {
		return await fn(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${f}.json`);
	} catch (err) {
		return await fn(`https://latest.currency-api.pages.dev/v1/currencies/${f}.json`);
	}
}

export function getGravatarUrl(email: string, size: number = 80) {
	let trimmedEmail = email.trim().toLowerCase();
	let hash = createHash('sha256').update(trimmedEmail).digest('hex');
	return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

export function timeAgo(date: Date) {
    const now = new Date();
    const seconds = Math.floor((+now - +date) / 1000);

    const intervals = [
		{ label: 'w', seconds: 7 * 24 * 60 * 60 },
		{ label: 'd', seconds: 24 * 60 * 60 },
		{ label: 'h', seconds: 60 * 60 },
		{ label: 'm', seconds: 60 },
		{ label: 's', seconds: 1 }
	];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count}${interval.label} ago`;
        }
    }

    return 'just now';
}

