// prisma.ts
import { PrismaClient, Prisma } from '../../prisma/src/generated/prisma/client';
import { DATABASE_URL } from '$env/static/private';
import { withAccelerate } from '@prisma/extension-accelerate';
import { createHash } from 'node:crypto';

type CacheEntry = {
	data: any;
	createdAt: Date;
	ttl?: number | undefined;
	swr?: number | undefined;
	tags?: string[] | undefined;
};

const cache = new Map<string, CacheEntry>();
let inBackground = new Map<string, boolean>();

function generateKey(model: string, action: string, args: any) {
	return `${model}:${action}:${createHash('sha256').update(JSON.stringify(args)).digest('hex')}`;
}

let withMemoryCache = Prisma.defineExtension({
	name: 'withMemoryCache',
  client: {
    purgeCache(...tags: string[]) {
      cache.forEach((v, k)=>{
        if (v.tags && v.tags.some(t => tags.includes(t))) {
          cache.delete(k);
        }
      })
    }
  },
	query: {
		$allModels: {
			async $allOperations({ model, operation, args, query }) {
				let key = generateKey(model, operation, args);
				let { ttl, swr, tags } = (args as typeof args & { cacheStrategy: { ttl: number | undefined, swr: number | undefined, tags: string[] | undefined } | undefined })?.cacheStrategy || {};
				if ('cacheStrategy' in args) {
					args = { ...args };
					delete (args as typeof args & { cacheStrategy?: object }).cacheStrategy;
				}
				if (!ttl && !swr) { return await query(args) }
				let cd = cache.get(key);
				let mode : 'fetch' | 'stale' | 'cache' = cd ? (()=>{
					let isInTTL = (+new Date() - +cd.createdAt)/1000 <= (ttl || 0);
					let isInSWR = (+new Date() - +cd.createdAt)/1000 <= (ttl || 0) + (swr || 0);
					return isInTTL ? 'cache' : (isInSWR ? 'stale' : 'fetch');
				})() : 'fetch';
				if (mode == 'cache') {
					// console.log(`${model}.${operation}: Returning Cached Data!`);
					return (cd as CacheEntry).data
				} else {
					if (mode == 'stale') {
						// console.log(`${model}.${operation}: Returning stale data but refreshing in background!`);
						setTimeout(async () => {
							if (inBackground.get(key)) return;
							inBackground.set(key, true);
							try {
								let r = await query(args);
								cache.set(key, { data: r, createdAt: (cd as CacheEntry).createdAt, ttl, swr, tags });
								// console.log(`${model}.${operation}: Refresh Done!`);
							} catch (err) {
								console.error(err)
							}
							inBackground.set(key, false);
						}, 100);
						return (cd as CacheEntry).data;
					} else {
						// console.log(`${model}.${operation}: Fetching Data!`);
						let r = await query(args);
						cache.set(key, { data: r, createdAt: new Date(), ttl, swr, tags });
						return r;
					}
				}
			}
		}
	}
});

const prisma = new PrismaClient({
	datasourceUrl: DATABASE_URL
})
.$extends(withMemoryCache)
.$extends(withAccelerate())

export default prisma;
