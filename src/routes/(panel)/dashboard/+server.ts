import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import prisma from "$main/src/lib/prisma";

export const GET: RequestHandler = async ({ url, cookies, locals }) => {
    if (url.searchParams.get('action') == 'logout' && locals.session) {
        cookies.delete('session', { path: '/' });
        await prisma.session.delete({ where: { id: locals.session.id } });
        return redirect(307, '/');
    }
    return redirect(308, '/dashboard/trade');
};

