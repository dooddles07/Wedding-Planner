import { inspiration } from "@/content/inspiration";
import { Chapter, Ground } from "@/components/editorial/Layout";
import { InspirationTile } from "@/components/cards/InspirationTile";
import { FadeIn, Reveal } from "@/components/editorial/Reveal";
import { ButtonLink } from "@/components/ui/Button";

/**
 * 17:00. Golden hour.
 *
 * The brightest ground on the page, because this is the hour the light is
 * doing the work. A masonry of eight, then a way through to the full gallery
 * — which is the real acquisition surface.
 */
export function GoldenHour() {
  const picks = [
    "one-long-table-under-lights",
    "flowers-from-twenty-miles",
    "the-hour-before",
    "cypress-and-gravel",
    "a-barn-with-the-doors-open",
    "two-plain-bands",
    "the-walk-back-down",
    "sharing-plates-down-the-middle",
  ]
    .map((slug) => inspiration.find((item) => item.slug === slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <Ground name="champagne" className="py-24 lg:py-36">
      <Chapter time="17:00" note="the hour everyone photographs">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal
              as="h2"
              className="font-display text-[clamp(2rem,4.6vw,3.75rem)] leading-[1.03] font-light"
              stagger={0.08}
            >
              {"A few thousand hours\nof other people’s weddings."}
            </Reveal>
            <FadeIn delay={0.1}>
              <p className="mt-6 max-w-[48ch] font-sans text-[1.0625rem] leading-[1.7] text-ink/70">
                Filter it by style, season, colour or venue. Keep what you like
                — no account, it stays in your browser — and bring the list to
                the first call.
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={0.15} className="shrink-0">
            <ButtonLink href="/inspiration" variant="onLight" arrow>
              Open the gallery
            </ButtonLink>
          </FadeIn>
        </div>

        <FadeIn delay={0.1} className="mt-14">
          <div className="columns-2 gap-4 lg:columns-4 lg:gap-6 [&>*]:mb-4 lg:[&>*]:mb-6">
            {picks.map((item) => (
              <InspirationTile
                key={item.slug}
                item={item}
                className="break-inside-avoid"
                sizes="(min-width: 1024px) 22vw, 46vw"
              />
            ))}
          </div>
        </FadeIn>
      </Chapter>
    </Ground>
  );
}
