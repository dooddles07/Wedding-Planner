import { describe, expect, it } from "vitest";
import { escapeHtml } from "./escape";

describe("escapeHtml", () => {
  it("escapes HTML-significant characters", () => {
    expect(escapeHtml(`<img src=x onerror="alert('hi')">`)).toBe(
      "&lt;img src=x onerror=&quot;alert(&#39;hi&#39;)&quot;&gt;",
    );
  });

  it("escapes ampersands", () => {
    expect(escapeHtml("Jane & John")).toBe("Jane &amp; John");
  });

  it("leaves plain text untouched", () => {
    expect(escapeHtml("Jane Doe")).toBe("Jane Doe");
  });
});
