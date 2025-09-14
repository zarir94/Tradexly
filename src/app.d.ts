// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			clientIP: string;
			userAgent: string;
			session: ({
				user: {
					id: string;
					createdAt: Date;
					affID: string | null;
					email: string;
					passwordHash: string;
					username: string;
					fullName: string | null;
					country: string | null;
					role: "ADMIN" | "TRADER" | "PARTNER";
					updatedAt: Date;
				};
				id: string;
				userId: string;
				token: string;
				user_agent: string | null;
				ip_address: string | null;
				createdAt: Date;
				expiresAt: Date;
			} | null | undefined);
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	type CacheData = {
		site_name: string;
		site_slogan: string;
	}
}

export {};
