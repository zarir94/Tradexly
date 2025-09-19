//@ts-nocheck
import Mailjet from "node-mailjet";
import { getSettings } from "../func";


export async function sendMail(email: string, name: string, subject: string, html: string) {
  let mjData = await getSettings('mailjet_apikey', 'mailjet_secretkey');
  let mj = Mailjet.apiConnect(mjData.mailjet_apikey, mjData.mailjet_secretkey);
  try {
    let req = await mj.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: { Email: 'no-reply@tradexcope.com', Name: 'TradeXcope' },
          To: [ { Email: email, Name: name } ],
          Subject: subject,
          HTMLPart: html,
        }
      ]
    });
    if (req.response.status == 200) {
      return true;
    } else {
      console.log('Error on api sendMail,', req);
      return false;
    }
  } catch (err) {
    console.error('Error on sendMail,', err);
    return false;
  }
}
