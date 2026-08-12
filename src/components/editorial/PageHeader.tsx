import { Container } from "./Layout";
import { FadeIn, Reveal } from "./Reveal";

/**
 * The opening of an inner page.
 *
 * Deliberately not a hero: a rule, a time marker, a headline and a standfirst
 * on paper. Full-bleed photography is reserved for the homepage and the story
 * pages, so that when it does appear it still means something.
 */
export function PageHeader({
  marker,
  title,
  standfirst,
  aside,
  children,
}: {
  /** Sits where the running-order time sits everywhere else. */
  marker: string;
  title: string;
  standfirst?: string;
  aside?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Container className="pt-32 pb-14 lg:pt-44 lg:pb-20">
      <div className="lg:grid lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[9.5rem_minmax(0,1fr)]">
        <p className="eyebrow mb-6 border-t border-ink/15 pt-4 text-ink-50 lg:mb-0">
          {marker}
        </p>

        <div>
          <Reveal
            as="h1"
            className="max-w-[20ch] font-display text-[clamp(2.25rem,5.4vw,4.5rem)] leading-[1.02] font-light -tracking-[0.015em]"
            lineClassName="pb-[0.06em]"
            stagger={0.08}
          >
            {title}
          </Reveal>

          {standfirst ? (
            <FadeIn delay={0.12}>
              <p className="mt-7 max-w-[52ch] font-sans text-lg leading-[1.6] text-ink-70">
                {standfirst}
              </p>
            </FadeIn>
          ) : null}

          {aside ? <FadeIn delay={0.18} className="mt-8">{aside}</FadeIn> : null}
          {children}
        </div>
      </div>
    </Container>
  );
}
