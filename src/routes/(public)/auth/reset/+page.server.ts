//@ts-nocheck
import { sendMail } from "$main/src/lib/js/mailjet";
import prisma from "$main/src/lib/prisma";
import type { Actions, PageServerLoad } from "./$types";
import bcrypt from "bcrypt";

let resetEmailHTML = (name: string, link: string) => `
<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
  <tr>
    <td>
      <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
        <tr>
          <td style="height:80px;">&nbsp;</td>
        </tr>
        <tr>
          <td style="height:20px;">&nbsp;</td>
        </tr>
        <tr>
          <td>
            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
              <tr>
                <td style="height:40px;">&nbsp;</td>
              </tr>
              <tr>
                <td style="padding:0 35px;">
                  <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have requested to reset your password</h1>
                  <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                  <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                    Dear ${name}, We cannot simply send you your old password. So, A unique link to reset your
                    password has been generated for you. To reset your password, click the
                    following link and follow the instructions.
                  </p>
                  <a href="${link}" style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset Password</a>
                </td>
              </tr>
              <tr>
                <td style="height:40px;">&nbsp;</td>
              </tr>
            </table>
          </td>
        <tr>
          <td style="height:20px;">&nbsp;</td>
        </tr>

        <tr>
          <td style="height:80px;">&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;


export const load: PageServerLoad = async ({ url, locals }) => {
    if (locals.session) {
        redirect(302, '/dashboard')
    }
    let alerts = [];
    let query_token = url.searchParams.get('token');
    let token = null;
    if (query_token) {
        if (await prisma.user.findFirst({ where: { resetToken: query_token }, select: { id: true } })) { token = query_token }
        else { alerts.push({ type: 'error', message: 'The Reset Link/Token is either deleted or expired.' }) }
    }
    return { token, alerts };
};

export const actions: Actions = {
    reset: async ({ request }) => {
        let { email } = Object.fromEntries((await request.formData()).entries());
        let token = crypto.randomUUID();
        let urlObj = new URL(request.url);
        urlObj.search = "";
        urlObj.searchParams.set("token", token);
        let resetLink = urlObj.toString();
        let u = await prisma.user.findUnique({ where: { email: String(email) } });
        if (u) {
            await prisma.user.update({ where: { email: u.email }, data: { resetToken: token } });
            if (!await sendMail(u.email, u.fullName, 'A Password Reset Was Requested on Your Account', resetEmailHTML(u.fullName, resetLink))) {
                return { type: 'error', message: 'We cannot send email at this moment. Please try again later' }
            }
        }
        return { type: 'success', message: 'If an account exists with that email, a password reset link has been sent. Please check your inbox and spam folder' }
    },
    update: async ({ request }) => {
        let { token, password, passwordConfirm } = Object.fromEntries((await request.formData()).entries());
        if (password != passwordConfirm) return { type: 'error', message: 'Password and Confirm Password does not match' };
        let u = await prisma.user.findFirst({ where: { resetToken: token } });
        if (!u) return { type: 'error', message: 'The reset link is either deleted or expired. Please refresh the page and request another' };
        await prisma.user.update({ where: { email: u.email }, data: { passwordHash: await bcrypt.hash(password, 5), resetToken: null } });
        return { type: 'success', message: 'Your password has been updated. Feel free to login' };
    }
};

