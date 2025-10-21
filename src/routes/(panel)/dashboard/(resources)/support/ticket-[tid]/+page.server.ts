import prisma from "$main/src/lib/prisma";
import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
    let ticket = await prisma.supportTicket.findUnique({ where: { id: params.tid, userId: locals.session?.userId }, include: { messages: { orderBy: { createdAt: 'desc' } } } })
    if (!ticket) error(404, { message: '404 - Ticket not found' });
    return { ticket };
};


export const actions: Actions = {
    async create ({ request, locals, params }) {
        let { message_text, message_html } = Object.fromEntries((await request.formData()).entries()) as { [k: string]: string | undefined }
        if (!(message_text && message_html)) return fail(400, { success: false, msg: 'Please fill up all required fields' });
        if (message_text.trim().length < 100) return fail(400, { success: false, msg: 'Message must be at least 100 chars long' });
        if (message_html.includes('<script>')) return fail(400, { success: false, msg: 'Invalid Message, it cannot contain scripts' });

        await prisma.$transaction(async (tx)=>{
            await tx.ticketMessage.create({ data: { html: message_html, from: 'USER', ticketId: params.tid } });
            await tx.supportTicket.update({ where: { id: params.tid, userId: locals.session?.userId }, data: { status: 'REPLIED', description: message_text.trim().slice(0, 150) } })
        })
        prisma.purgeCache(`${locals.session?.userId}_tickets`);

        return { success: true, msg: 'Your reply submitted sucessfully!', clearForm: true };
    },
    async close ({ request, locals, params }) {
        await prisma.supportTicket.update({ where: { id: params.tid, userId: locals.session?.userId }, data: { status: 'CLOSED' } });
        prisma.purgeCache(`${locals.session?.userId}_tickets`);
        redirect(302, '/dashboard/support');
    }
};