//@ts-nocheck
import type { Handle } from '@sveltejs/kit';
import type { RequestEvent } from './routes/$types';

function getClientIP(event: RequestEvent) {
	let headers = event.request.headers;

	// Cloudflare
	let cf = headers.get('cf-connecting-ip');
	if (cf) return cf;

	// Vercel / Netlify / generic proxy
	let xff = headers.get('x-forwarded-for');
	if (xff) return xff.split(',')[0].trim();

	// Default (SvelteKit built-in)
	return event.getClientAddress();
}

export const handle: Handle = async ({ event, resolve }) => {
	let ip = getClientIP(event);
	event.locals.clientIP = ip;
	let response = await resolve(event);
	response.headers.set('X-User-IP', ip);
	return response;
};

