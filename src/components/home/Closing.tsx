import { ParallaxPhoto } from "@/components/editorial/ParallaxPhoto";
import { Reveal, FadeIn } from "@/components/editorial/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { nav } from "@/content/brand";

/**
 * 23:50. Last dance.
 *
 * The day closes where it opened — in the dark, on ink. The line has to do
 * two jobs: end the story, and hand it over. "That’s one day. Yours will be
 * nothing like it." does both, and it is the truest thing on the page.
 */
export function Closing() {
  return (
    <section
      data-ground="ink"
      className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-ink text-paper"
    >
      <ParallaxPhoto
        photoKey="last-dance"
        className="absolute inset-0 -z-10"
        sizes="100vw"
        travel={70}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/35"
      />

      <div className="mx-auto w-full max-w-[100rem] px-6 pb-20 sm:px-8 lg:px-12 lg:pb-28">
        <div className="lg:grid lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[9.5rem_minmax(0,1fr)]">
          <div className="mb-8 flex items-baseline gap-4 border-t border-paper/25 pt-4 lg:mb-0 lg:flex-col lg:gap-3 lg:self-end">
            <time className="eyebrow tabular-nums" dateTime="23:50">
              23:50
            </time>
            <p className="font-mono text-[0.6875rem] tracking-wide opacity-70">
              last dance
            </p>
          </div>

          <div>
            <Reveal
              as="h2"
              className="font-display text-[clamp(2.25rem,6.4vw,5.5rem)] leading-[1] font-light -tracking-[0.015em]"
              lineClassName="pb-[0.08em]"
              stagger={0.1}
            >
              {"That’s one day.\nYours will be nothing like it."}
            </Reveal>

            <FadeIn delay={0.2}>
              <p className="mt-8 max-w-[44ch] font-sans text-base leading-[1.65] text-paper/70 sm:text-lg">
                Tell us when, and roughly where. We’ll tell you what’s possible
                and what it costs, and you can decide from there.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href={nav.cta.href} variant="primary" size="lg">
                  {nav.cta.label}
                </ButtonLink>
                <ButtonLink href="/weddings" variant="onDark" size="lg" arrow={false}>
                  Read another wedding
                </ButtonLink>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
