import { timeAgo } from "$main/src/lib/func";
import prisma from "$main/src/lib/prisma";


export async function getNotifications({max = 10} = {}, locals: App.Locals) {
    return (await prisma.notification.findMany({ where: { userId: locals.session?.userId }, orderBy: { createdAt: "desc" }, take: max })).map(e=>({
        id: e.id,
        title: e.title,
        message: e.message,
        seen: e.seen,
        time: timeAgo(e.createdAt)
    }))
}

export async function getHelpArticle({id = ''} = {}, locals: App.Locals) {
    return await prisma.helpArticle.findUnique({ where: { id } });
}

export async function markAllNotificationsSeen({} = {}, locals: App.Locals) {
    await prisma.notification.updateMany({ where: { userId: locals.session?.userId, seen: false }, data: { seen: true } });
    prisma.purgeCache(`noti_count_${locals.session?.userId}`);
    return {success: true};
}

