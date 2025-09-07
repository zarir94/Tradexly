//@ts-nocheck
import prisma from "$main/src/lib/prisma";
import type { Actions, PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({  }) => {
  return {  };
};

export const actions: Actions = {
  default: async ({ request }) => {
    let { name, email, subject, message } = Object.fromEntries((await request.formData()).entries());
    // let ip = 
    await prisma.contact.create({ data: { name, email, subject, message } });
  }
};