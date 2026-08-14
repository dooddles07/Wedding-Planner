import { describe, expect, it } from "vitest";
import { safeExternalUrl } from "./utils";

describe("safeExternalUrl", () => {
  it("allows https URLs", () => {
    expect(safeExternalUrl("https://example.com/list")).toBe(
      "https://example.com/list",
    );
  });

  it("allows http URLs", () => {
    expect(safeExternalUrl("http://example.com")).toBe("http://example.com");
  });

  it("blocks javascript: URLs", () => {
    expect(safeExternalUrl("javascript:alert(1)")).toBeNull();
  });

  it("blocks data: URLs", () => {
    expect(safeExternalUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
  });

  it("returns null for empty or missing input", () => {
    expect(safeExternalUrl("")).toBeNull();
    expect(safeExternalUrl(null)).toBeNull();
    expect(safeExternalUrl(undefined)).toBeNull();
  });

  it("returns null for unparseable input", () => {
    expect(safeExternalUrl("not a url")).toBeNull();
  });
});
