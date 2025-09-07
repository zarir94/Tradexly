//@ts-nocheck
import prisma from "./prisma";

let cached: CacheData;

export async function updateCache() {
    let db_data = await prisma.settings.findMany({where: { key: {in: ['site_name', 'site_slogan']} }});
    db_data = Object.fromEntries(db_data.map((i) => [i.key, parseFloat(i.value) || i.value]));
    
    
    cached = db_data;
}

await updateCache();
export default cached;
