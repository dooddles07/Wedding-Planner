import { weddings } from "@/content/weddings";
import { Chapter, Ground } from "@/components/editorial/Layout";
import { WeddingCard } from "@/components/cards/WeddingCard";
import { FadeIn, Reveal } from "@/components/editorial/Reveal";
import { ButtonLink } from "@/components/ui/Button";

/**
 * 13:30. The ceremony.
 *
 * The emotional centre of the page, so it gets the darkest ground between the
 * hero and the close, and the most asymmetric layout: one story large, two
 * smaller and dropped down a beat so the eye moves diagonally rather than
 * scanning a row.
 */
export function Stories() {
  const [lead, ...rest] = weddings.slice(0, 3);

  return (
    <Ground name="forest" className="py-24 lg:py-36">
      <Chapter time="13:30" note="everyone standing, nobody sitting down">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal
            as="h2"
            className="max-w-[18ch] font-display text-[clamp(2rem,4.6vw,3.75rem)] leading-[1.03] font-light"
            stagger={0.08}
          >
            {"Four weddings, written up honestly."}
          </Reveal>
          <FadeIn delay={0.1} className="shrink-0">
            <ButtonLink href="/weddings" variant="onDark" arrow>
              All weddings
            </ButtonLink>
          </FadeIn>
        </div>

        <FadeIn delay={0.1} className="mt-14">
          <WeddingCard
            wedding={lead}
            ratio="cinema"
            size="lg"
            sizes="(min-width: 1024px) 76vw, 100vw"
            onDark
          />
        </FadeIn>

        <div className="mt-20 grid gap-14 sm:grid-cols-2 sm:gap-10 lg:gap-16">
          {rest.map((wedding, index) => (
            <FadeIn
              key={wedding.slug}
              delay={index * 0.08}
              // The second one drops a beat. Two equal columns would read as
              // a grid; this reads as a spread.
              className={index === 1 ? "sm:mt-24" : undefined}
            >
              <WeddingCard
                wedding={wedding}
                ratio="portrait"
                sizes="(min-width: 640px) 38vw, 100vw"
                onDark
              />
            </FadeIn>
          ))}
        </div>
      </Chapter>
    </Ground>
  );
}
