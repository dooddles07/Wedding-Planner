import { describe, expect, it } from "vitest";
import { canClaimSlug } from "./ownership";

describe("canClaimSlug", () => {
  it("allows claiming an unowned slug", () => {
    expect(canClaimSlug(null, "user-1")).toBe(true);
    expect(canClaimSlug(undefined, "user-1")).toBe(true);
  });

  it("allows the owner to update their own slug", () => {
    expect(canClaimSlug("user-1", "user-1")).toBe(true);
  });

  it("rejects a non-owner claiming someone else's slug", () => {
    expect(canClaimSlug("user-1", "user-2")).toBe(false);
  });
});
