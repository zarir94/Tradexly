import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	let ip = event.getClientAddress();
	let response = await resolve(event);
	response.headers.set('X-User-IP', ip);
	return response;
};

