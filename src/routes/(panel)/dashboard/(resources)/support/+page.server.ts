import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import prisma from "$main/src/lib/prisma";
import { parsePaginationArgs } from "$main/src/lib/func";


export const load: PageServerLoad = async ({ url, locals }) => {
    let { take, page, skip } = parsePaginationArgs(url, 10);
    let tickets = await prisma.supportTicket.findMany({ where: { userId: locals.session?.userId }, orderBy: { updatedAt: 'desc' }, include: { _count: { select: { messages: true } } }, take: take + 1, skip, cacheStrategy: { ttl: 60, swr: 180, tags: [`${locals.session?.userId}_tickets`] } });
    let hasNext = tickets.length == take + 1;
    if (hasNext) {tickets.pop()}
    return { tickets, hasNext, page }
};

export const actions: Actions = {
    async create ({ request, locals }) {
        let { subject, message_text, message_html } = Object.fromEntries((await request.formData()).entries()) as { [k: string]: string | undefined }
        if (!(subject && message_text && message_html)) return fail(400, { success: false, msg: 'Please fill up all required fields' });
        if (subject.trim().length < 20) return fail(400, { success: false, msg: 'Subject must be at least 20 chars long' });
        if (message_text.trim().length < 100) return fail(400, { success: false, msg: 'Message must be at least 100 chars long' });
        if (message_html.includes('<script>')) return fail(400, { success: false, msg: 'Invalid Message, it cannot contain scripts' });
        let ticketID: string | undefined = undefined;
        await prisma.$transaction(async (tx) => {
            let ticket = await tx.supportTicket.create({ data: { userId: locals.session?.userId as string, subject: subject.trim(), description: message_text.trim().slice(0, 150) } });
            ticketID = ticket.id;
            await tx.ticketMessage.create({ data: {
                html: message_html,
                from: 'USER',
                ticketId: ticket.id
            } })
        })
        if (ticketID) {
            prisma.purgeCache(`${locals.session?.userId}_tickets`);
            redirect(302, '/dashboard/support/ticket-' + ticketID);
        } else {
            return { success: false, msg: 'Cannot create Ticket, ID is undefined!' };
        }
    }
};
