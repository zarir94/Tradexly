//@ts-nocheck
import prisma from "./prisma";
import { getSettings } from "./func";


let cached: CacheData;

export async function updateCache() {
    let db_data = await getSettings('site_name', 'site_slogan');
    
    cached = db_data;
}

await updateCache();
export default cached;
