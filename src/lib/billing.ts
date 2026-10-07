// Paystack billing (Phase 10+ only — MVP core stays free per §72).
// Without keys every call fails closed; nothing here gates connection.

function secret(): string {
  const v = process.env.PAYSTACK_SECRET_KEY;
  if (!v) throw new Error("billing: PAYSTACK_SECRET_KEY not configured (Phase 10+)");
  return v;
}

export async function initializeSubscription(email: string, amountKobo: number): Promise<unknown> {
  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: { Authorization: `Bearer ${secret()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email, amount: amountKobo }),
  });
  if (!res.ok) throw new Error(`billing: paystack ${res.status}`);
  return res.json();
}

export async function verifyTransaction(reference: string): Promise<unknown> {
  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${secret()}` },
  });
  if (!res.ok) throw new Error(`billing: paystack ${res.status}`);
  return res.json();
}
