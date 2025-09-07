import cached from "$lib/cache";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
    return { cached }
};
