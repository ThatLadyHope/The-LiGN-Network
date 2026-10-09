import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { putFile } from "@/lib/storage";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 2 * 1024 * 1024;

// POST /api/profile/avatar (multipart `file`) — optional photo upload to R2.
// Avatars stay optional per §7. Without R2 keys configured, fails closed
// with storage-not-configured instead of pretending to work.
export async function POST(req: NextRequest) {
  const auth = createAuth(db);
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof Blob)) return NextResponse.json({ error: "no-file" }, { status: 400 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: "bad-type" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "too-large" }, { status: 400 });

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const key = `avatars/${session.user.id}-${Date.now()}.${ext}`;
  try {
    await putFile(key, new Uint8Array(await file.arrayBuffer()), file.type);
  } catch {
    return NextResponse.json({ error: "storage-not-configured" }, { status: 501 });
  }
  const base = process.env.R2_PUBLIC_URL;
  const url = base ? `${base}/${key}` : null;
  await db.user.update({
    where: { id: session.user.id },
    data: { avatarKind: "photo", avatarUrl: url },
  });
  return NextResponse.json({ ok: true, url });
}
