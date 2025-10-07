import { parsePaginationArgs, timeAgo } from '$main/src/lib/func';
import prisma from '$main/src/lib/prisma';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';


export const load: PageServerLoad = async ({ locals, url }) => {
    let { take, page, skip } = parsePaginationArgs(url, 10);

	let notifications = (await prisma.notification.findMany({ where: { userId: locals.session?.userId }, orderBy: { createdAt: 'desc' }, take: take + 1, skip })).map(i=>({...i, timeAgo: timeAgo(i.createdAt)}));
    let hasNext = notifications.length == take + 1;
    if (hasNext) {notifications.pop()}

    return { notifications, page, hasNext };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        let { action, id } = Object.fromEntries((await request.formData()).entries());
        let where = { id: String(id), userId: locals.session?.userId };
        try {
            prisma.purgeCache(`noti_count_${where.userId}`);
            if (action == 'read') {
                await prisma.notification.update({ where, data: { seen: true } });
                return { success: true, msg: 'Notification marked as read!' }
            } else if (action == 'unread') {
                await prisma.notification.update({ where, data: { seen: false } });
                return { success: true, msg: 'Notification marked as unread!' }
            } else if (action == 'delete') {
                await prisma.notification.delete({ where });
                return { success: true, msg: 'Notification deleted successfully!' }
            } else if (action == 'allread') {
                await prisma.notification.updateMany({ where: { userId: locals.session?.userId, seen: false }, data: { seen: true } });
                return { success: true, msg: 'All Notifications marked as read!' }
            }
        } catch (err) {
            console.error(err);
            return fail(400, { success: false, msg: err instanceof Error ? `Server Error: ${err.message}` : 'An error occurred. Please try again.' });
        }
    }
};

