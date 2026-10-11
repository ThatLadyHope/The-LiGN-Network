// Rate limit + file-type tests.
import { describe, expect, it } from "vitest";
import { checkLimit } from "../src/lib/rate-limit";
import { sniffImage, verifyImage } from "../src/lib/filetype";

describe("rate limiting", () => {
  it("allows up to the limit then blocks until the window rolls", () => {
    const rule = { limit: 2, windowMs: 1000 };
    expect(checkLimit("ip-a", rule, 0)).toBe(true);
    expect(checkLimit("ip-a", rule, 10)).toBe(true);
    expect(checkLimit("ip-a", rule, 20)).toBe(false);
    expect(checkLimit("ip-a", rule, 2000)).toBe(true);
    expect(checkLimit("ip-b", rule, 20)).toBe(true);
  });
});

describe("image sniffing", () => {
  it("reads magic bytes, never the claimed label", () => {
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
    const jpg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const html = new Uint8Array([0x3c, 0x68, 0x74, 0x6d, 0x6c, 0, 0, 0, 0, 0, 0, 0]); // "<html"
    expect(sniffImage(png)).toBe("png");
    expect(sniffImage(jpg)).toBe("jpg");
    expect(sniffImage(html)).toBeNull();
    expect(verifyImage(png, "image/png")).toBe("png");
    expect(verifyImage(png, "image/jpeg")).toBeNull(); // spoofed label rejected
    expect(verifyImage(new Uint8Array(4), "image/png")).toBeNull(); // too short
  });
});
