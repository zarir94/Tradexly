import prisma from "./prisma";

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

