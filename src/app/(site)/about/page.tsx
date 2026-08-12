import type { Metadata } from "next";
import { brand } from "@/content/brand";
import { places } from "@/content/places";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Container, Ground, Marginalia } from "@/components/editorial/Layout";
import { Photo } from "@/components/editorial/Photo";
import { ParallaxPhoto } from "@/components/editorial/ParallaxPhoto";
import { FadeIn, Reveal } from "@/components/editorial/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Marram is a wedding studio on the Suffolk coast, working across Britain and Europe. Around forty weddings a year, never more than two in a weekend.",
  path: "/about",
  imageKey: "venue-crag-path",
});

/**
 * The about page carries the one piece of brand storytelling on the site — why
 * the studio is called Marram — and then gets out of the way. Principles are
 * stated as things the studio does, not adjectives it claims.
 */
export default function AboutPage() {
  const principles = [
    {
      title: "We say no to about half of it",
      body: "Around forty weddings a year across the studio, never more than two in a weekend. It is fewer than we could take, and it is the reason we can answer the phone in August.",
    },
    {
      title: "No supplier commission, ever",
      body: "If a supplier offers one we ask them to take it off your invoice instead. A shortlist you can’t trust is worse than no shortlist.",
    },
    {
      title: "Two of us, on every wedding",
      body: "From setup to carriages, on every package including day management. One planner alone at a 140-guest wedding is a planner who cannot leave the room.",
    },
    {
      title: "The budget is honest from month one",
      body: "We would rather tell you in February that the thing you want costs £30,000 more than you have, than discover it together in July.",
    },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <PageHeader
        marker={`Since ${brand.founded}`}
        title={"A small studio\non a cold coast."}
        standfirst={`${brand.name} plans weddings from ${brand.base}, across ${brand.reach}. Around forty a year. We are not trying to grow.`}
      />

      <Container className="pb-20 lg:pb-28">
        <ParallaxPhoto
          photoKey="venue-crag-path"
          className="aspect-[21/9] w-full"
          sizes="(min-width: 1024px) 92vw, 100vw"
          priority
          travel={50}
        />
      </Container>

      {/* --- The name ------------------------------------------------------ */}
      <Container className="pb-20 lg:pb-28">
        <div className="lg:grid lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[9.5rem_minmax(0,1fr)]">
          <p className="eyebrow mb-6 border-t border-ink/15 pt-4 text-ink-50 lg:mb-0">
            The name
          </p>
          <div>
            <Reveal
              as="h2"
              className="max-w-[20ch] font-display text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] font-light"
              stagger={0.07}
            >
              {brand.etymology}
            </Reveal>

            <FadeIn delay={0.12}>
              <div className="mt-8 max-w-[62ch] space-y-5 font-sans text-[1.0625rem] leading-[1.75] text-ink-80">
                <p>
                  Marram grass is the reason the dunes at Aldeburgh are still
                  there. It grows where nothing else will, it holds sand together
                  with a root system nobody sees, and it looks, at a glance, like
                  a weed.
                </p>
                <p>
                  It is a reasonable description of the job. On the day itself a
                  planner should be almost invisible: no clipboard theatre, no
                  radio chatter, nobody asking you a question you’d have to
                  think about. What holds the day up was put in place months
                  earlier and three metres down.
                </p>
                <p>
                  It also reads the same in both directions, which we noticed
                  after we’d chosen it and have been quietly pleased about ever
                  since.
                </p>
              </div>

              <Marginalia className="mt-10 max-w-[46ch]">
                Sample content — the studio, its people and its weddings are
                invented for this build. The structure is real enough to drop a
                real one into.
              </Marginalia>
            </FadeIn>
          </div>
        </div>
      </Container>

      {/* --- How we work --------------------------------------------------- */}
      <Ground name="forest" className="py-20 lg:py-28">
        <Container>
          <div className="lg:grid lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[9.5rem_minmax(0,1fr)]">
            <p className="eyebrow mb-6 border-t border-champagne/25 pt-4 text-champagne/85 lg:mb-0">
              How we work
            </p>

            <div className="grid gap-x-16 gap-y-10 sm:grid-cols-2">
              {principles.map((principle) => (
                <FadeIn key={principle.title}>
                  <h3 className="max-w-[22ch] font-display text-xl leading-snug font-light sm:text-2xl">
                    {principle.title}
                  </h3>
                  <p className="mt-3 max-w-[44ch] font-sans text-[0.9375rem] leading-[1.7] text-champagne/80">
                    {principle.body}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </Container>
      </Ground>

      {/* --- Where --------------------------------------------------------- */}
      <Container className="py-20 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-20">
          <div>
            <h2 className="eyebrow mb-7 text-ink-50">Where we work</h2>
            <ul className="border-t border-ink/12">
              {places.map((place) => (
                <li
                  key={place.region}
                  className="flex items-baseline justify-between gap-6 border-b border-ink/12 py-3.5"
                >
                  <span className="font-display text-lg">{place.region}</span>
                  <span className="shrink-0 font-mono text-[0.6875rem] tracking-wide text-ink-50">
                    {place.note}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:pt-12">
            <Photo
              photoKey="venue-elmhurst"
              ratio="portrait"
              sizes="(min-width: 1024px) 36vw, 100vw"
            />
            <p className="mt-5 max-w-[38ch] font-mono text-[0.6875rem] leading-relaxed tracking-wide text-ink-50">
              Suffolk and Norfolk are home. Everywhere else we work with a local
              producer we have used before — which costs a little and saves a
              great deal.
            </p>
          </div>
        </div>
      </Container>

      <Ground name="ink" className="py-20 lg:py-28">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-[22ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08] font-light">
              Come and tell us what you’re thinking.
            </h2>
            <ButtonLink href="/contact" variant="primary" size="lg">
              Start planning
            </ButtonLink>
          </div>
        </Container>
      </Ground>
    </>
  );
}
