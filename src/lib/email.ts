// ZeptoMail transactional email. Without a token, mail is logged to the
// console (dev only) instead of sent — never fails silently in production.

export interface OutgoingMail {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail(mail: OutgoingMail): Promise<{ sent: boolean; logged: boolean }> {
  const token = process.env.ZEPTOMAIL_TOKEN;
  const from = process.env.EMAIL_FROM;
  if (!token || !from) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("email: ZEPTOMAIL_TOKEN / EMAIL_FROM not configured");
    }
    console.log("[mail:dev]", mail.to, mail.subject);
    return { sent: false, logged: true };
  }
  const res = await fetch("https://api.zeptomail.com/v1.1/email", {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      from: { address: from },
      to: [{ email_address: { address: mail.to } }],
      subject: mail.subject,
      htmlbody: mail.html,
    }),
  });
  if (!res.ok) throw new Error(`email: zeptomail ${res.status}`);
  return { sent: true, logged: false };
}
