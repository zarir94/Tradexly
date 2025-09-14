//@ts-nocheck
import prisma from "$main/src/lib/prisma";
import type { Actions, PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({  }) => {
  return { msgs: [
    { type: 'info', message: 'If you want fast response, try openning a support ticket or live chat!' },
  ] };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    try {
      let { name, email, subject, message } = Object.fromEntries((await request.formData()).entries());
      let ip = locals.clientIP;
      await prisma.contact.create({ data: { name, email, subject, message, ip } });
      return { type: 'success', message: 'Operation Completed Successfully. The admin will get in touch shortly' }
    } catch (err) {
      console.error(err);
      return { type: 'error', message: 'Something went wrong! Use alternate contact method.' }
    }
  }
};
