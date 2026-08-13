import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { weddingBySlug, weddings } from "@/content/weddings";
import { getStyles } from "@/content/styles";
import { Container, Ground, Marginalia } from "@/components/editorial/Layout";
import { ParallaxPhoto } from "@/components/editorial/ParallaxPhoto";
import { Photo } from "@/components/editorial/Photo";
import { FadeIn, Reveal } from "@/components/editorial/Reveal";
import { WeddingCard } from "@/components/cards/WeddingCard";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { SaveButton } from "@/components/ui/SaveButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { TrackEvent } from "@/components/analytics/TrackEvent";

export function generateStaticParams() {
  return weddings.map((wedding) => ({ slug: wedding.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const wedding = weddingBySlug[slug];
  if (!wedding) return {};

  return pageMetadata({
    title: wedding.title,
    description: wedding.standfirst,
    path: `/weddings/${wedding.slug}`,
    imageKey: wedding.heroImageId,
    type: "article",
    publishedTime: wedding.date,
  });
}

/**
 * The story template.
 *
 * Built to read like a magazine piece rather than a case study: a full-bleed
 * opening, prose set to a proper measure, the planner’s notes in the margin,
 * and — the part that makes it specific to this trade — the actual running
 * order of the day, printed in full.
 */
export default async function WeddingStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const wedding = weddingBySlug[slug];
  if (!wedding) notFound();

  const styles = getStyles(wedding.styleIds);
  const others = weddings.filter((item) => item.slug !== wedding.slug).slice(0, 2);

  const facts = [
    { label: "Where", value: wedding.location },
    { label: "Venue", value: wedding.venue },
    {
      label: "When",
      value: (() => {
        const [y, m, d] = wedding.date.split("-").map(Number);
        return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      })(),
    },
    { label: "Guests", value: String(wedding.guestCount) },
    { label: "Style", value: styles.map((style) => style.name).join(", ") },
  ];

  return (
    <article>
      <TrackEvent event={{ name: "wedding_story_viewed", slug: wedding.slug }} />
      <JsonLd
        data={[
          articleSchema({
            title: wedding.title,
            standfirst: wedding.standfirst,
            slug: wedding.slug,
            date: wedding.date,
            imageKey: wedding.heroImageId,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Real weddings", path: "/weddings" },
            { name: wedding.couple, path: `/weddings/${wedding.slug}` },
          ]),
        ]}
      />

      {/* --- Opening --------------------------------------------------- */}
      <section
        data-ground="ink"
        className="relative isolate flex min-h-[86svh] items-end overflow-hidden bg-ink text-paper"
      >
        <ParallaxPhoto
          photoKey={wedding.heroImageId}
          className="absolute inset-0 -z-10"
          sizes="100vw"
          priority
          travel={60}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/65 to-ink/30"
        />

        <Container className="pb-16 lg:pb-24">
          <div className="lg:grid lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[9.5rem_minmax(0,1fr)]">
            <p className="eyebrow mb-6 border-t border-paper/25 pt-4 lg:mb-0 lg:self-end">
              {wedding.couple}
            </p>
            <div>
              <Reveal
                as="h1"
                className="max-w-[18ch] font-display text-[clamp(2rem,5.2vw,4.5rem)] leading-[1.02] font-light -tracking-[0.015em]"
                lineClassName="pb-[0.06em]"
                splitBy="words"
                stagger={0.03}
              >
                {wedding.title}
              </Reveal>
              <FadeIn delay={0.25}>
                <p className="mt-7 max-w-[50ch] font-sans text-lg leading-[1.6] text-paper/75">
                  {wedding.standfirst}
                </p>
                <p className="mt-6 font-mono text-[0.6875rem] tracking-wide text-paper/65">
                  {wedding.readMinutes} min read
                </p>
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>

      {/* --- The facts -------------------------------------------------- */}
      <Ground name="linen" className="py-10">
        <Container>
          <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-6">
            <dl className="flex flex-wrap gap-x-10 gap-y-5">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="eyebrow text-ink-50">{fact.label}</dt>
                  <dd className="mt-1.5 font-sans text-[0.9375rem]">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <SaveButton kind="wedding" slug={wedding.slug} className="-mr-2" />
          </div>
        </Container>
      </Ground>

      {/* --- The story -------------------------------------------------- */}
      <Container className="py-20 lg:py-28">
        {wedding.chapters.map((chapter, index) => (
          <section
            key={index}
            className="mb-16 lg:mb-24 lg:grid lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[9.5rem_minmax(0,1fr)]"
          >
            <div className="lg:sticky lg:top-32 lg:self-start">
              {chapter.marginNote ? (
                <Marginalia className="mb-8 lg:mb-0">{chapter.marginNote}</Marginalia>
              ) : null}
            </div>

            <div>
              {chapter.heading ? (
                <h2 className="mb-6 max-w-[22ch] font-display text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.1] font-light">
                  {chapter.heading}
                </h2>
              ) : null}

              <div className="max-w-[62ch] space-y-5 font-sans text-[1.0625rem] leading-[1.75] text-ink-80">
                {chapter.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {chapter.pullQuote ? (
                <FadeIn className="my-12">
                  <blockquote className="max-w-[26ch] border-l-2 border-ember pl-6 font-display text-[clamp(1.375rem,2.6vw,2rem)] leading-[1.2] font-light">
                    {chapter.pullQuote}
                  </blockquote>
                </FadeIn>
              ) : null}

              {chapter.imageId ? (
                <FadeIn className="mt-10">
                  <Photo
                    photoKey={chapter.imageId}
                    ratio="wide"
                    sizes="(min-width: 1024px) 74vw, 100vw"
                  />
                </FadeIn>
              ) : null}
            </div>
          </section>
        ))}
      </Container>

      {/* --- What was hard ---------------------------------------------- */}
      <Ground name="forest" className="py-20 lg:py-28">
        <Container>
          <div className="lg:grid lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[9.5rem_minmax(0,1fr)]">
            <p className="eyebrow mb-6 border-t border-champagne/25 pt-4 text-champagne/85 lg:mb-0">
              The hard part
            </p>
            <div>
              <h2 className="max-w-[22ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08] font-light">
                {wedding.challenge.title}
              </h2>
              <p className="mt-7 max-w-[62ch] font-sans text-[1.0625rem] leading-[1.75] text-champagne/85">
                {wedding.challenge.body}
              </p>
            </div>
          </div>
        </Container>
      </Ground>

      {/* --- Decisions and the running order ----------------------------- */}
      <Container className="py-20 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <h2 className="eyebrow mb-7 text-ink-50">Design decisions</h2>
            <ul className="border-t border-ink/12">
              {wedding.designNotes.map((note) => (
                <li
                  key={note}
                  className="border-b border-ink/12 py-4 font-sans text-[0.9375rem] leading-relaxed"
                >
                  {note}
                </li>
              ))}
            </ul>
          </div>

          {/* The running order, printed as it was worked from. */}
          <div>
            <h2 className="eyebrow mb-7 text-ink-50">The running order</h2>
            <ol className="border-t border-ink/12">
              {wedding.runningOrder.map((entry) => (
                <li
                  key={`${entry.time}-${entry.label}`}
                  className="flex gap-5 border-b border-ink/12 py-3.5"
                >
                  <time className="w-14 shrink-0 font-mono text-[0.75rem] tabular-nums text-ink-50">
                    {entry.time}
                  </time>
                  <span className="font-sans text-[0.9375rem] leading-snug">
                    {entry.label}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>

      {/* --- Gallery ------------------------------------------------------ */}
      <Container className="pb-20 lg:pb-28">
        <h2 className="eyebrow mb-7 text-ink-50">The day</h2>
        <div className="columns-2 gap-4 lg:columns-3 lg:gap-6 [&>*]:mb-4 lg:[&>*]:mb-6">
          {wedding.galleryImageIds.map((key, index) => (
            <FadeIn key={`${key}-${index}`} delay={(index % 3) * 0.05} className="break-inside-avoid">
              <Photo photoKey={key} sizes="(min-width: 1024px) 30vw, 46vw" />
            </FadeIn>
          ))}
        </div>
      </Container>

      {/* --- Credits ------------------------------------------------------ */}
      <Ground name="linen" className="py-16 lg:py-20">
        <Container>
          <h2 className="eyebrow mb-7 text-ink-50">Credits</h2>
          <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {wedding.credits.map((credit) => (
              <div key={credit.role}>
                <dt className="font-mono text-[0.6875rem] tracking-wide text-ink-50">
                  {credit.role}
                </dt>
                <dd className="mt-1 font-sans text-[0.9375rem]">{credit.name}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 font-mono text-[0.625rem] leading-relaxed tracking-wide text-ink-50">
            Sample content. Supplier names are invented for demonstration.
          </p>
        </Container>
      </Ground>

      {/* --- Onward -------------------------------------------------------- */}
      <Container className="py-20 lg:py-28">
        <div className="mb-12 flex items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-none font-light">
            Read another
          </h2>
          <TextLink href="/weddings" arrow>
            All weddings
          </TextLink>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:gap-16">
          {others.map((other) => (
            <WeddingCard
              key={other.slug}
              wedding={other}
              ratio="landscape"
              sizes="(min-width: 640px) 45vw, 100vw"
            />
          ))}
        </div>
      </Container>

      <Ground name="ink" className="py-20 lg:py-28">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-[22ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08] font-light">
              Tell us when, and roughly where.
            </h2>
            <ButtonLink href="/contact" variant="primary" size="lg">
              Start planning
            </ButtonLink>
          </div>
        </Container>
      </Ground>
    </article>
  );
}
