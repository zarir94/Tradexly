//@ts-nocheck
import { redirect, type Handle } from '@sveltejs/kit';
import type { RequestEvent } from './routes/$types';
import prisma from './lib/prisma';

function getClientIP(event: RequestEvent) {
	let headers = event.request.headers;

	// Cloudflare
	let cf = headers.get('cf-connecting-ip');
	if (cf) return cf;

	// Vercel / Netlify / generic proxy
	let xff = headers.get('x-forwarded-for');
	if (xff) return xff.split(',')[0].trim();

	// Default (SvelteKit built-in)
	try {
		return event.getClientAddress();
	} catch (err) {
		return '0.0.0.0'
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	let path = event.url.pathname;

	if (event.request.headers.get('Host') == 'tradexly.onrender.com') {
		redirect(302, new URL(path, 'https://tradexcope.com/'))
	}
	
	let ip = getClientIP(event);
	event.locals.clientIP = ip;
	event.locals.userAgent = event.request.headers.get('User-Agent') || '';

	let dbSes;
	let session = event.cookies.get('session');
	if (session) { dbSes = await prisma.session.findFirst({ where: { token: session }, include: { user: true }, cacheStrategy: { ttl: 60, swr: 3 * 60, tags: [ `ses_${session}` ] } }) }
	event.locals.session = dbSes;

	if (
		(path.startsWith('/dashboard') && !dbSes) ||
		(path.startsWith('/affiliate') && dbSes?.user.role != 'PARTNER') ||
		(path.startsWith('/admin') && dbSes?.user.role != 'ADMIN')
	) { redirect(302, '/auth') }
	
	let response = await resolve(event);
	response.headers.set('X-User-IP', ip);
	return response;
};

