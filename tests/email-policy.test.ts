// Email-policy tests: throwaway domains blocked, real addresses pass.
import { describe, expect, it } from "vitest";
import {
  emailDomain,
  isDisposableEmail,
  normalizeEmail,
} from "../src/lib/email-policy";

describe("normalizeEmail", () => {
  it("trims and lowercases", () => {
    expect(normalizeEmail("  Wren@Example.COM ")).toBe("wren@example.com");
  });
  it("returns empty for non-strings", () => {
    expect(normalizeEmail(null)).toBe("");
    expect(normalizeEmail(42)).toBe("");
  });
});

describe("emailDomain", () => {
  it("takes the part after the last @", () => {
    expect(emailDomain("a@b@mailinator.com")).toBe("mailinator.com");
  });
  it("returns empty without @", () => {
    expect(emailDomain("not-an-email")).toBe("");
  });
});

describe("isDisposableEmail", () => {
  it("blocks known throwaway providers", () => {
    expect(isDisposableEmail("x@mailinator.com")).toBe(true);
    expect(isDisposableEmail("x@guerrillamail.com")).toBe(true);
    expect(isDisposableEmail("x@10minutemail.com")).toBe(true);
    expect(isDisposableEmail("x@yopmail.com")).toBe(true);
    expect(isDisposableEmail("x@tempmail.com")).toBe(true);
    expect(isDisposableEmail("x@trashmail.com")).toBe(true);
  });
  it("is case-insensitive and trims", () => {
    expect(isDisposableEmail("  X@Mailinator.COM ")).toBe(true);
  });
  it("catches subdomains of throwaway providers", () => {
    expect(isDisposableEmail("x@sub.mailinator.com")).toBe(true);
  });
  it("allows real providers, custom domains, and plus-addressing", () => {
    expect(isDisposableEmail("wren@gmail.com")).toBe(false);
    expect(isDisposableEmail("wren+test@yahoo.com")).toBe(false);
    expect(isDisposableEmail("wren@outlook.com")).toBe(false);
    expect(isDisposableEmail("wren@proton.me")).toBe(false);
    expect(isDisposableEmail("wren@company.co")).toBe(false);
    expect(isDisposableEmail("wren@my-custom-domain.org")).toBe(false);
  });
  it("does not match partial names (example-mailinator.com is fine)", () => {
    expect(isDisposableEmail("x@example-mailinator.com")).toBe(false);
  });
  it("returns false for garbage instead of throwing", () => {
    expect(isDisposableEmail("")).toBe(false);
    expect(isDisposableEmail("no-at-sign")).toBe(false);
    expect(isDisposableEmail(null)).toBe(false);
  });
});
