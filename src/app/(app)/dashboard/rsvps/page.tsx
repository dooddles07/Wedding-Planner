import type { Metadata } from "next";
import { desc, eq, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { rsvps, weddingSites } from "@/lib/db/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "RSVPs",
  description: "Everyone who has replied so far.",
  path: "/dashboard/rsvps",
  noIndex: true,
});

export default async function RsvpsPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const sites = await db
    .select({ slug: weddingSites.slug })
    .from(weddingSites)
    .where(eq(weddingSites.userId, userId));

  const slugs = sites.map((s) => s.slug);

  const all = slugs.length
    ? await db
        .select()
        .from(rsvps)
        .where(inArray(rsvps.siteSlug, slugs))
        .orderBy(desc(rsvps.createdAt))
    : [];

  const attending = all.filter((r) => r.attending);
  const totalGuests = attending.reduce((sum, r) => sum + r.guests, 0);

  return (
    <div className="pt-12">
      <div className="mb-8 border-b border-ink/12 pb-6">
        <p className="eyebrow text-ink-50">
          {attending.length} attending &middot; {totalGuests} guests total
        </p>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3.4vw,2.5rem)] leading-none font-light">
          RSVPs
        </h1>
        <p className="mt-3 font-sans text-base text-ink-70">
          Everyone who has replied so far.
        </p>
      </div>

      {all.length === 0 ? (
        <p className="font-sans text-base text-ink-70">No RSVPs yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-sans text-[0.9375rem]">
            <thead>
              <tr className="border-b border-ink/12">
                <th className="pb-3 text-left font-mono text-[0.625rem] tracking-wide text-ink-50 uppercase">
                  Name
                </th>
                <th className="pb-3 text-left font-mono text-[0.625rem] tracking-wide text-ink-50 uppercase">
                  Attending
                </th>
                <th className="pb-3 text-left font-mono text-[0.625rem] tracking-wide text-ink-50 uppercase">
                  Guests
                </th>
                <th className="pb-3 text-left font-mono text-[0.625rem] tracking-wide text-ink-50 uppercase">
                  Message
                </th>
                <th className="pb-3 text-left font-mono text-[0.625rem] tracking-wide text-ink-50 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {all.map((rsvp) => (
                <tr key={rsvp.id} className="border-b border-ink/8">
                  <td className="py-4 pr-6">{rsvp.name}</td>
                  <td className="py-4 pr-6">
                    {rsvp.attending ? "Yes" : "No"}
                  </td>
                  <td className="py-4 pr-6">
                    {rsvp.attending ? rsvp.guests : "—"}
                  </td>
                  <td className="py-4 pr-6 text-ink-70">
                    {rsvp.message || "—"}
                  </td>
                  <td className="py-4 font-mono text-[0.6875rem] text-ink-50">
                    {rsvp.createdAt.toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
