// Magic-byte sniffing for image uploads. The browser's MIME label is
// attacker-controlled; only the first bytes tell the truth. Anything else
// (HTML/JS renamed to .png) is rejected before storage.
export type SniffedImage = "jpg" | "png" | "webp" | "gif";

export function sniffImage(bytes: Uint8Array): SniffedImage | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  )
    return "webp";
  if (
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38
  )
    return "gif";
  return null;
}

const MIME_OF: Record<SniffedImage, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

// The claimed MIME must match the sniffed bytes. Returns the safe extension.
export function verifyImage(bytes: Uint8Array, claimedMime: string): SniffedImage | null {
  const sniffed = sniffImage(bytes);
  if (!sniffed) return null;
  if (MIME_OF[sniffed] !== claimedMime) return null;
  return sniffed;
}
