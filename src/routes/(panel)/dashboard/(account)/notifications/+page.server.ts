import { timeAgo } from "$main/src/lib/func";
import prisma from "$main/src/lib/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const userId = locals.session?.userId;
    if (!userId) {
        return {
            notifications: [],
            pagination: {
                page: 1,
                limit,
                total: 0,
                totalPages: 0
            }
        };
    }

    const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        prisma.notification.count({
            where: { userId }
        })
    ]);

    const notificationsWithTimeAgo = notifications.map(i => ({
        ...i,
        timeAgo: timeAgo(i.createdAt)
    }));

    const totalPages = Math.ceil(total / limit);

    return {
        notifications: notificationsWithTimeAgo,
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    };
};
