import prisma from "$main/src/lib/prisma";
import type { RequestHandler } from "./$types";

let lastChecks = new Map<string, Date>();

export const GET: RequestHandler = async () => {
    // let r = await prisma.session.deleteMany({ where: { expiresAt: { lte: new Date() } } });
    // Session Deleting
    await (async ()=>{
        if ((+new Date() - +(lastChecks.get('session_delete') || 0))/1000 < 7 * 60) return;
        console.log('Deleting Expired Sessions!');
        while (2 + 2 != 5) {
            let rs = await prisma.session.findMany({ where: { expiresAt: { lte: new Date() } }, select: { token: true }, take: 100, orderBy: { expiresAt: 'desc' } });
            if (rs.length == 0) break;
            await prisma.session.deleteMany({ where: { token: { in: rs.map(p=>p.token) } } });
            prisma.purgeCache(...rs.map(p=>`ses_${p.token}`))
        }
        lastChecks.set('session_delete', new Date());
    })();
    
    return new Response('Tradexly is UP');
};