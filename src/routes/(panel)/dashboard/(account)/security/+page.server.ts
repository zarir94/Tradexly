import { comparePassword, hashPassword, parsePaginationArgs } from "$main/src/lib/func";
import prisma from "$main/src/lib/prisma";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { UAParser } from "ua-parser-js";

function getSessionDevice(ua: string) {
  let uap = UAParser(ua);
  let ht = [uap.browser.name, uap.device.vendor, `${uap.os.name || ''} ${uap.os.version || ''}`.trim()].filter(Boolean).slice(0, 2).join(' on ');
  return ht || 'Unknown Device';
}

export const load: PageServerLoad = async ({ locals, url }) => {
    let { take, page, skip } = parsePaginationArgs(url);
    let qSes = await prisma.session.findMany({ where: { userId: locals.session?.userId }, orderBy: { createdAt: 'desc' }, select: { id: true, user_agent: true, ip_address: true, createdAt: true }, take: take + 1, skip });
    let hasNext = qSes.length == take + 1;
    if (hasNext) {qSes.pop()}
    
    let sessions = qSes.map(e=>({...e, device: getSessionDevice(e.user_agent || ''), isCurrent: e.id == locals.session?.id}));

    return {sessions, page, hasNext};
};


export const actions: Actions = {
	changePassword: async ({ request, locals }) => {
        let { currentPassword, newPassword, confirmPassword } = Object.fromEntries((await request.formData()).entries());
        if (!(currentPassword && newPassword && confirmPassword)) return fail(400, { success: false, msg: 'Please fill up all the fields', fields: [ 'currentPassword', 'newPassword', 'confirmPassword' ] });
        if (newPassword != confirmPassword) return fail(400, { success: false, msg: 'New Password and Confirm New Password does not match', fields: [ 'newPassword', 'confirmPassword' ] });
        if (newPassword.toString().length < 6) return fail(400, { success: false, msg: 'New Password must be at least 6 chars long', fields: [ 'newPassword', 'confirmPassword' ] });
        if (!await comparePassword(currentPassword.toString(), locals.session?.user.passwordHash as string)) return fail(400, { success: false, msg: 'The current password you entered is invalid', fields: [ 'currentPassword' ] });
        await prisma.user.update({ where: { id: locals.session?.userId }, data: { passwordHash: await hashPassword(newPassword.toString()) } });
        return { success: true, msg: 'Password Changed Successfully!' };
    },
    terminateSession: async ({ request, locals }) => {
        let { id } = Object.fromEntries((await request.formData()).entries());
        if (!id) return fail(400, { success: false, msg: 'Session ID is required' });
        await prisma.session.deleteMany({ where: { id: id.toString(), userId: locals.session?.userId } });
        return { success: true, msg: 'Session is Terminated. It may take a few minutes to take effect.' };
    }
};
