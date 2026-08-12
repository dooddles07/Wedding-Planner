/**
 * Structured data, rendered server-side. Objects come from lib/seo.ts so the
 * shapes stay in one place.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Schema objects are built in our own code, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
