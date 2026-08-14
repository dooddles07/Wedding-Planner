import { describe, expect, it } from "vitest";
import {
  inquirySchema,
  leadSchema,
  publishSiteSchema,
  userStatePutSchema,
} from "./validation";

const validSite = {
  slug: "jane-and-john",
  template: "first-light" as const,
  partnerOne: "Jane",
  partnerTwo: "John",
  date: null,
  location: "Devon",
  venue: "The Barn",
  story: "Once upon a time",
  heroImageId: "first-light",
  schedule: [{ time: "14:00", title: "Ceremony", detail: "" }],
  travel: "",
  accommodation: "",
  dressCode: "",
  registry: "",
  registryUrl: "https://registry.example.com/jane-and-john",
  galleryImageIds: [],
  rsvpEnabled: true,
  published: true,
};

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

  it("accepts a full valid site payload", () => {
    expect(publishSiteSchema.safeParse(validSite).success).toBe(true);
  });

  it("rejects a javascript: registryUrl", () => {
    expect(
      publishSiteSchema.safeParse({
        ...validSite,
        registryUrl: "javascript:alert(1)",
      }).success,
    ).toBe(false);
  });

  it("rejects an unknown template", () => {
    expect(
      publishSiteSchema.safeParse({ ...validSite, template: "evil" }).success,
    ).toBe(false);
  });

  it("allows an empty registryUrl", () => {
    expect(
      publishSiteSchema.safeParse({ ...validSite, registryUrl: "" }).success,
    ).toBe(true);
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
