// Supabase Storage: two buckets (see docs/storage-layout.md).
// - lign-public: avatars, directly readable.
// - lign-private: shared/chat images, signed URLs after membership check.
// Service key stays server-side; it never leaves this module.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`storage: missing ${name} (see .env.example)`);
  return v;
}

let client: SupabaseClient | null = null;

export function storage(): SupabaseClient {
  if (!client) {
    client = createClient(required("SUPABASE_URL"), required("SUPABASE_SERVICE_KEY"));
  }
  return client;
}

export function publicBucket(): string {
  return required("SUPABASE_PUBLIC_BUCKET");
}

export function privateBucket(): string {
  return required("SUPABASE_PRIVATE_BUCKET");
}

// Public upload (avatars). Key pattern: avatars/{userId}.{ext}.
export async function putFile(key: string, body: Uint8Array, contentType: string): Promise<void> {
  const { error } = await storage().storage.from(publicBucket()).upload(key, body, {
    contentType,
    upsert: true,
  });
  if (error) throw new Error(`storage: upload failed (${error.message})`);
}

export async function getFile(key: string): Promise<Uint8Array> {
  const { data, error } = await storage().storage.from(publicBucket()).download(key);
  if (error || !data) throw new Error(`storage: download failed (${error?.message ?? "empty"})`);
  return new Uint8Array(await data.arrayBuffer());
}

export function publicUrl(key: string): string {
  const { data } = storage().storage.from(publicBucket()).getPublicUrl(key);
  return data.publicUrl;
}

// Private download: short-lived signed URL, only after the caller verified
// membership (participant of the memory/conversation). No URL, no bytes.
export async function signedUrl(key: string, expiresInSec = 300): Promise<string> {
  const { data, error } = await storage()
    .storage.from(privateBucket())
    .createSignedUrl(key, expiresInSec);
  if (error || !data?.signedUrl) {
    throw new Error(`storage: signed URL failed (${error?.message ?? "empty"})`);
  }
  return data.signedUrl;
}
