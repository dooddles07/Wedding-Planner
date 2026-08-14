import { describe, expect, it } from "vitest";
import {
  inquirySchema,
  leadSchema,
  publishSiteSchema,
  userStatePutSchema,
} from "./validation";

describe("leadSchema", () => {
  it("accepts a minimal valid lead", () => {
    expect(
      leadSchema.safeParse({ email: "a@b.com", source: "quiz" }).success,
    ).toBe(true);
  });

  it("rejects a missing email", () => {
    expect(leadSchema.safeParse({ source: "quiz" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(
      leadSchema.safeParse({ email: "not-an-email", source: "quiz" })
        .success,
    ).toBe(false);
  });

  it("rejects a missing source", () => {
    expect(leadSchema.safeParse({ email: "a@b.com" }).success).toBe(false);
  });

  it("rejects a negative guest count", () => {
    expect(
      leadSchema.safeParse({
        email: "a@b.com",
        source: "quiz",
        guestCount: -1,
      }).success,
    ).toBe(false);
  });
});

describe("inquirySchema", () => {
  it("accepts a valid inquiry", () => {
    expect(
      inquirySchema.safeParse({
        targetSlug: "some-vendor",
        targetType: "vendor",
        name: "Jane",
        email: "jane@example.com",
      }).success,
    ).toBe(true);
  });

  it("rejects a missing name", () => {
    expect(
      inquirySchema.safeParse({
        targetSlug: "some-vendor",
        targetType: "vendor",
        email: "jane@example.com",
      }).success,
    ).toBe(false);
  });
});

describe("publishSiteSchema", () => {
  it("accepts a valid slug", () => {
    expect(publishSiteSchema.safeParse({ slug: "jane-and-john" }).success).toBe(
      true,
    );
  });

  it("rejects uppercase or invalid characters", () => {
    expect(publishSiteSchema.safeParse({ slug: "Jane_And_John!" }).success).toBe(
      false,
    );
  });

  it("rejects an empty slug", () => {
    expect(publishSiteSchema.safeParse({ slug: "" }).success).toBe(false);
  });
});

describe("userStatePutSchema", () => {
  it("accepts a valid key/value pair", () => {
    expect(
      userStatePutSchema.safeParse({ key: "budget", value: "{}" }).success,
    ).toBe(true);
  });

  it("rejects a non-string value", () => {
    expect(
      userStatePutSchema.safeParse({ key: "budget", value: { foo: "bar" } })
        .success,
    ).toBe(false);
  });

  it("rejects an empty key", () => {
    expect(userStatePutSchema.safeParse({ key: "", value: "{}" }).success).toBe(
      false,
    );
  });
});
