// Cloudflare R2 storage (S3-compatible). Bucket/keys come from env;
// without them every call fails closed with a clear error.
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`storage: missing ${name} (see .env.example)`);
  return v;
}

let client: S3Client | null = null;

export function r2(): S3Client {
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${required("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: required("R2_ACCESS_KEY_ID"),
        secretAccessKey: required("R2_SECRET_ACCESS_KEY"),
      },
    });
  }
  return client;
}

export async function putFile(key: string, body: Uint8Array, contentType: string): Promise<void> {
  await r2().send(
    new PutObjectCommand({ Bucket: required("R2_BUCKET"), Key: key, Body: body, ContentType: contentType }),
  );
}

export async function getFile(key: string): Promise<Uint8Array> {
  const out = await r2().send(new GetObjectCommand({ Bucket: required("R2_BUCKET"), Key: key }));
  return out.Body!.transformToByteArray();
}
