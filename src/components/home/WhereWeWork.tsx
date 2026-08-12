import { places, placesIntro } from "@/content/places";
import { Chapter, Ground, Marginalia } from "@/components/editorial/Layout";
import { FadeIn, Reveal } from "@/components/editorial/Reveal";
import { TextLink } from "@/components/ui/Button";

/**
 * 07:20. The house wakes.
 *
 * The trust strip. No logos, no client count, no awards — none of which this
 * studio has that we could honestly claim. Instead, a working index of where
 * it operates and in which months, which is a harder thing to fake and a more
 * useful thing to read.
 */
export function WhereWeWork() {
  return (
    <Ground name="paper" className="py-24 lg:py-36">
      <Chapter time="07:20" note="kettle on, someone’s already awake">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Reveal
              as="h2"
              className="font-display text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.05] font-light"
              stagger={0.08}
            >
              {placesIntro.heading}
            </Reveal>
            <FadeIn delay={0.15}>
              <p className="mt-7 max-w-[46ch] font-sans text-[1.0625rem] leading-[1.7] text-ink-70">
                {placesIntro.body}
              </p>
              <Marginalia className="mt-8 max-w-[42ch]">{placesIntro.note}</Marginalia>
            </FadeIn>
          </div>

          <FadeIn delay={0.1}>
            <ul className="border-t border-ink/12">
              {places.map((place) => (
                <li
                  key={place.region}
                  className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-ink/12 py-3.5"
                >
                  <span className="font-display text-lg leading-tight transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 sm:text-xl">
                    {place.region}
                  </span>
                  <span className="text-right font-mono text-[0.6875rem] tracking-wide text-ink-50 sm:shrink-0">
                    {place.note}
                    <span className="ml-3 hidden text-ink-50 sm:inline">{place.country}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <TextLink href="/venues" arrow>
                Browse venues in these regions
              </TextLink>
            </div>
          </FadeIn>
        </div>
      </Chapter>
    </Ground>
  );
}
