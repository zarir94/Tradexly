import prisma from "$main/src/lib/prisma";
import type { RequestHandler } from "./$types";

let lastChecks = new Map<string, Date>();

export const GET: RequestHandler = async () => {
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
    
    // Ticket Closing
    await (async ()=>{
        if ((+new Date() - +(lastChecks.get('ticket_close') || 0))/1000 < 7 * 60) return;
        console.log('Closing Inactive Tickets!');
        while (2 + 2 != 5) {
            let fifteenDaysAgo = new Date();
            fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
            let rs = await prisma.supportTicket.findMany({ where: { updatedAt: { lte: fifteenDaysAgo }, status: { not: 'CLOSED' } }, select: { userId: true, id: true }, take: 100, orderBy: { updatedAt: 'desc' } });
            if (rs.length == 0) break;
            await prisma.supportTicket.deleteMany({ where: { id: { in: rs.map(p=>p.id) } } });
            prisma.purgeCache(...rs.map(p=>`${p.userId}_tickets`));
        }
        lastChecks.set('ticket_close', new Date());
    })();
    
    return new Response('Site is UP');
};
