//@ts-nocheck
import { getGravatarUrl } from "$main/src/lib/func";
import prisma from "$main/src/lib/prisma";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, url }) => {
    let user = locals.session.user;
    return {
        url: url.toString(),  // To make sure this function runs every time user visits any page
        user: {
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            country: user.country,
            img: getGravatarUrl(user.email),
        },
        unseenNotificationCount: await prisma.notification.count({ where: { userId: user.id, seen: false } })
    }
};
