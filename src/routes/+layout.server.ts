import { getSettings } from "../lib/func";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
    let cached = await getSettings('site_name', 'site_slogan');
    return { cached }
};
