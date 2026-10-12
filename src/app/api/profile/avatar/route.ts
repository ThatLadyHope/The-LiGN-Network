import { NextRequest, NextResponse } from "next/server";
import { localUserId } from "@/lib/session";
import { db } from "@/lib/db";
import { verifyImage } from "@/lib/filetype";
import { publicUrl, putFile } from "@/lib/storage";

const MAX_BYTES = 2 * 1024 * 1024;

// POST /api/profile/avatar (multipart `file`) — optional photo upload to the
// public Supabase bucket. Avatars stay optional per §7. Without keys
// configured, fails closed instead of pretending to work.
export async function POST(req: NextRequest) {
  const userId = await localUserId();
  if (!userId) return NextResponse.json({ error: "sign-in-required" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof Blob)) return NextResponse.json({ error: "no-file" }, { status: 400 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes.length > MAX_BYTES || bytes.length === 0) {
    return NextResponse.json({ error: "bad-size" }, { status: 400 });
  }
  // Magic bytes must agree with the claimed label — spoofed types rejected.
  const kind = verifyImage(bytes, file.type);
  if (!kind) return NextResponse.json({ error: "bad-type" }, { status: 400 });

  const key = `avatars/${userId}-${Date.now()}.${kind}`;
  try {
    await putFile(key, bytes, file.type);
  } catch {
    return NextResponse.json({ error: "storage-not-configured" }, { status: 501 });
  }
  const url = publicUrl(key);
  await db.user.update({
    where: { id: userId },
    data: { avatarKind: "photo", avatarUrl: url },
  });
  return NextResponse.json({ ok: true, url });
}
