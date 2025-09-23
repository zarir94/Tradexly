import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import * as api from "./apifunc";

export const POST: RequestHandler = async ({ request, params, locals }) => {
    let { func } = params as { func: keyof typeof api };
    let data = {};
    try { data = await request.json() } catch (err) {};
    try {
        let r = await api[func](data, locals);
        return json(r);
    } catch (err) {
        console.error(err);
        return json(
            { error: err instanceof Error ? err.message : "Unknown error" },
            { status: 500 }
        );
    }
};