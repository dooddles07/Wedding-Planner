import type { Metadata } from "next";
import { weddings } from "@/content/weddings";
import { weddingStyles } from "@/content/styles";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Container, Ground } from "@/components/editorial/Layout";
import { WeddingCard } from "@/components/cards/WeddingCard";
import { FadeIn } from "@/components/editorial/Reveal";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = pageMetadata({
  title: "Real weddings",
  description:
    "Four weddings written up in full — what was decided, what was difficult, and what it cost in effort. From a Suffolk country house to four days in Puglia.",
  path: "/weddings",
  imageKey: "couple-confetti",
});

/**
 * The index reads as a contents page rather than a card grid: every story
 * alternates side, and the second column drops a beat so the eye moves down
 * the page diagonally.
 */
export default function WeddingsPage() {
  const [lead, ...rest] = weddings;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Real weddings", path: "/weddings" },
        ])}
      />

      <PageHeader
        marker="Four written up"
        title={"Four weddings, in\nrather more detail\nthan is usual."}
        standfirst="Including the parts that went wrong, the decisions we argued about, and what each one actually cost in effort. Sample content — the couples are invented, the planning is not."
        aside={
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {weddingStyles.slice(0, 6).map((style) => (
              <TextLink key={style.id} href={`/inspiration?style=${style.id}`}>
                {style.name}
              </TextLink>
            ))}
          </div>
        }
      />

      <Container className="pb-24 lg:pb-32">
        <FadeIn>
          <WeddingCard
            wedding={lead}
            ratio="cinema"
            size="lg"
            sizes="(min-width: 1024px) 92vw, 100vw"
          />
        </FadeIn>

        <div className="mt-24 grid gap-16 sm:grid-cols-2 sm:gap-10 lg:mt-32 lg:gap-20">
          {rest.map((wedding, index) => (
            <FadeIn
              key={wedding.slug}
              delay={index * 0.06}
              className={index % 2 === 1 ? "sm:mt-28" : undefined}
            >
              <WeddingCard
                wedding={wedding}
                ratio={index % 2 === 1 ? "portrait" : "landscape"}
                sizes="(min-width: 640px) 45vw, 100vw"
              />
            </FadeIn>
          ))}
        </div>
      </Container>

      <Ground name="ink" className="py-20 lg:py-28">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-[20ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08] font-light">
              Yours would be the fifth.
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
