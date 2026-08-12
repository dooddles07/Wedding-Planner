import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VENUE_TYPE_LABEL, venueBySlug, venues } from "@/content/venues";
import { getStyles } from "@/content/styles";
import { Container, Ground, Marginalia } from "@/components/editorial/Layout";
import { ParallaxPhoto } from "@/components/editorial/ParallaxPhoto";
import { Photo } from "@/components/editorial/Photo";
import { FadeIn, Reveal } from "@/components/editorial/Reveal";
import { VenueCard } from "@/components/cards/VenueCard";
import { SaveButton } from "@/components/ui/SaveButton";
import { PriceBand } from "@/components/ui/Chip";
import { LeadForm } from "@/components/forms/LeadForm";
import { TextLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, pageMetadata, venueSchema } from "@/lib/seo";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function generateStaticParams() {
  return venues.map((venue) => ({ slug: venue.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const venue = venueBySlug[slug];
  if (!venue) return {};

  return pageMetadata({
    title: `${venue.name}, ${venue.region}`,
    description: venue.standfirst,
    path: `/venues/${venue.slug}`,
    imageKey: venue.heroImageId,
  });
}

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = venueBySlug[slug];
  if (!venue) notFound();

  const styles = getStyles(venue.styleIds);
  const similar = venues
    .filter(
      (other) =>
        other.slug !== venue.slug &&
        (other.type === venue.type ||
          other.styleIds.some((id) => venue.styleIds.includes(id))),
    )
    .slice(0, 3);

  const seasonLabel = venue.availability
    .map((season) => season[0].toUpperCase() + season.slice(1))
    .join(", ");

  return (
    <>
      <JsonLd
        data={[
          venueSchema({
            name: venue.name,
            slug: venue.slug,
            standfirst: venue.standfirst,
            location: venue.location,
            country: venue.country,
            capacitySeated: venue.capacitySeated,
            coordinates: venue.coordinates,
            imageKey: venue.heroImageId,
          }),
          faqSchema(venue.faqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Venues", path: "/venues" },
            { name: venue.name, path: `/venues/${venue.slug}` },
          ]),
        ]}
      />

      <section
        data-ground="ink"
        className="relative isolate flex min-h-[76svh] items-end overflow-hidden bg-ink text-paper"
      >
        <ParallaxPhoto
          photoKey={venue.heroImageId}
          className="absolute inset-0 -z-10"
          sizes="100vw"
          priority
          travel={55}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/65 to-ink/25"
        />

        <Container className="pb-14 lg:pb-20">
          <div className="lg:grid lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[9.5rem_minmax(0,1fr)]">
            <p className="eyebrow mb-6 border-t border-paper/25 pt-4 lg:mb-0 lg:self-end">
              {VENUE_TYPE_LABEL[venue.type]}
            </p>
            <div>
              <Reveal
                as="h1"
                className="font-display text-[clamp(2.25rem,5.4vw,4.5rem)] leading-[1.02] font-light -tracking-[0.015em]"
                lineClassName="pb-[0.06em]"
                stagger={0.08}
              >
                {venue.name}
              </Reveal>
              <FadeIn delay={0.2}>
                <p className="mt-5 font-mono text-[0.6875rem] tracking-[0.14em] text-paper/60 uppercase">
                  {venue.location}, {venue.region}
                </p>
                <p className="mt-5 max-w-[52ch] font-sans text-lg leading-[1.6] text-paper/75">
                  {venue.standfirst}
                </p>
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>

      {/* --- The numbers -------------------------------------------------- */}
      <Ground name="linen" className="py-8">
        <Container>
          <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-6">
            <dl className="flex flex-wrap gap-x-10 gap-y-5">
              <div>
                <dt className="eyebrow text-ink-50">Seated</dt>
                <dd className="mt-1.5 font-sans text-[0.9375rem]">
                  {formatNumber(venue.capacitySeated)}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-ink-50">Standing</dt>
                <dd className="mt-1.5 font-sans text-[0.9375rem]">
                  {formatNumber(venue.capacityStanding)}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-ink-50">Beds</dt>
                <dd className="mt-1.5 font-sans text-[0.9375rem]">
                  {venue.accommodation || "None on site"}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-ink-50">Indicative hire</dt>
                <dd className="mt-1.5 flex items-center gap-3 font-sans text-[0.9375rem]">
                  {formatCurrency(venue.priceFrom)}–{formatCurrency(venue.priceTo)}
                  <PriceBand band={venue.priceBand} />
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-ink-50">Dates open</dt>
                <dd className="mt-1.5 font-sans text-[0.9375rem]">{seasonLabel}</dd>
              </div>
            </dl>
            <SaveButton kind="venue" slug={venue.slug} className="-mr-2" />
          </div>
        </Container>
      </Ground>

      {/* --- Description and features -------------------------------------- */}
      <Container className="py-16 lg:py-24">
        <div className="lg:grid lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[9.5rem_minmax(0,1fr)]">
          <Marginalia className="mb-10 lg:sticky lg:top-32 lg:mb-0 lg:self-start">
            {styles.map((style) => style.name).join(" · ")}
          </Marginalia>

          <div>
            <div className="max-w-[62ch] space-y-5 font-sans text-[1.0625rem] leading-[1.75] text-ink-80">
              {venue.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="eyebrow mb-6 text-ink-50">What you get</h2>
              <ul className="grid gap-x-10 sm:grid-cols-2">
                {venue.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-3 border-b border-ink/12 py-3.5 font-sans text-[0.9375rem] leading-relaxed"
                  >
                    <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-ember" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>

      {/* --- Gallery -------------------------------------------------------- */}
      <Container className="pb-16 lg:pb-24">
        <div className="columns-2 gap-4 lg:columns-3 lg:gap-6 [&>*]:mb-4 lg:[&>*]:mb-6">
          {venue.galleryImageIds.map((key, index) => (
            <FadeIn key={`${key}-${index}`} delay={(index % 3) * 0.05} className="break-inside-avoid">
              <Photo photoKey={key} sizes="(min-width: 1024px) 30vw, 46vw" />
            </FadeIn>
          ))}
        </div>
      </Container>

      {/* --- Questions and location ---------------------------------------- */}
      <Container className="pb-16 lg:pb-24">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-24">
          <div>
            <h2 className="eyebrow mb-6 text-ink-50">Questions</h2>
            <dl className="border-t border-ink/12">
              {venue.faqs.map((faq) => (
                <div key={faq.question} className="border-b border-ink/12 py-6">
                  <dt className="max-w-[34ch] font-display text-xl leading-snug font-light">
                    {faq.question}
                  </dt>
                  <dd className="mt-3 max-w-[54ch] font-sans text-[0.9375rem] leading-[1.7] text-ink-70">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="eyebrow mb-6 text-ink-50">Where it is</h2>
            {/* A static, link-out map: no third-party script, no cookie banner,
                no key to leak. It only has to answer "roughly where". */}
            <a
              href={`https://www.openstreetmap.org/?mlat=${venue.coordinates.lat}&mlon=${venue.coordinates.lng}#map=13/${venue.coordinates.lat}/${venue.coordinates.lng}`}
              target="_blank"
              rel="noreferrer noopener"
              className="group block border border-ink/15 bg-linen p-8 transition-colors hover:border-ink/40"
            >
              <p className="font-display text-2xl leading-tight font-light">
                {venue.location}
              </p>
              <p className="mt-2 font-sans text-[0.9375rem] text-ink-70">
                {venue.region}, {venue.country === "GB" ? "United Kingdom" : venue.country}
              </p>
              <p className="mt-6 font-mono text-[0.6875rem] tracking-wide text-ink-50 tabular-nums">
                {venue.coordinates.lat.toFixed(4)}, {venue.coordinates.lng.toFixed(4)}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.14em] text-ember uppercase">
                Open in maps
                <svg
                  aria-hidden
                  viewBox="0 0 20 10"
                  width="18"
                  height="9"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M0 5h18M14 1l4 4-4 4" stroke="currentColor" strokeWidth="1.25" />
                </svg>
              </span>
            </a>

            <p className="mt-6 font-mono text-[0.625rem] leading-relaxed tracking-wide text-ink-50">
              Sample venue, invented for this build. Prices are indicative bands
              rather than quotes.
            </p>
          </div>
        </div>
      </Container>

      {/* --- Enquiry -------------------------------------------------------- */}
      <Ground name="forest" className="py-20 lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-24">
            <div>
              <h2 className="max-w-[18ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08] font-light">
                Ask us about {venue.name}.
              </h2>
              <p className="mt-5 max-w-[44ch] font-sans text-base leading-[1.7] text-champagne/85">
                We will tell you what it is actually like on a wet Tuesday, what
                the quoted price does not include, and whether your date is
                realistic.
              </p>
            </div>
            <div className="bg-paper p-7 text-ink lg:p-10">
              <LeadForm
                source="venue"
                context={{ venue: venue.slug }}
                submitLabel="Ask about this venue"
                compact
              />
            </div>
          </div>
        </Container>
      </Ground>

      {similar.length ? (
        <Container className="py-20 lg:py-28">
          <div className="mb-10 flex items-end justify-between gap-6">
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-none font-light">
              In the same spirit
            </h2>
            <TextLink href="/venues" arrow>
              All venues
            </TextLink>
          </div>
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((other) => (
              <VenueCard key={other.slug} venue={other} />
            ))}
          </div>
        </Container>
      ) : null}
    </>
  );
}
