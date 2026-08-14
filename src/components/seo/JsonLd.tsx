/**
 * Structured data, rendered server-side. Objects come from lib/seo.ts so the
 * shapes stay in one place.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Schema objects are built in our own code, never from user input, so
      // this isn't reachable today — but JSON.stringify doesn't neutralise
      // a literal "</script>", so a future field sourced from content data
      // (a title, a quote) could break out of the element. Defensive only.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
