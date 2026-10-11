// Resend transactional email. Without a key, mail is logged to the
// console (dev only) instead of sent — never fails silently in production.
import { Resend } from "resend";

export interface OutgoingMail {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail(mail: OutgoingMail): Promise<{ sent: boolean; logged: boolean }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("email: RESEND_API_KEY / EMAIL_FROM not configured");
    }
    console.log("[mail:dev]", mail.to, mail.subject);
    return { sent: false, logged: true };
  }
  const { error } = await new Resend(key).emails.send({
    from,
    to: mail.to,
    subject: mail.subject,
    html: mail.html,
  });
  if (error) throw new Error(`email: resend (${error.message})`);
  return { sent: true, logged: false };
}
