import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "RSVPs",
  description: "Everyone who has replied so far.",
  path: "/dashboard/rsvps",
  noIndex: true,
});

export default async function RsvpsPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: sites } = await supabase
    .from("wedding_sites")
    .select("slug")
    .eq("user_id", user!.id);

  const slugs = (sites ?? []).map((s: { slug: string }) => s.slug);

  const { data: rsvps } = slugs.length
    ? await supabase
        .from("rsvps")
        .select("*")
        .in("site_slug", slugs)
        .order("created_at", { ascending: false })
    : { data: [] };

  const all = rsvps ?? [];
  const attending = all.filter(
    (r: { attending: boolean }) => r.attending,
  );
  const totalGuests = attending.reduce(
    (sum: number, r: { guests: number }) => sum + r.guests,
    0,
  );

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
              {all.map(
                (rsvp: {
                  id: string;
                  name: string;
                  attending: boolean;
                  guests: number;
                  message: string | null;
                  created_at: string;
                }) => (
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
                      {new Date(rsvp.created_at).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
