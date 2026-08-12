import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Container, Ground } from "@/components/editorial/Layout";
import { Photo } from "@/components/editorial/Photo";
import { FadeIn } from "@/components/editorial/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Planning tools",
  description:
    "Four free tools: find your direction, model the budget, work the timeline, and tick off the checklist. No account, nothing sent anywhere.",
  path: "/planning",
  imageKey: "detail-paper",
});

const tools = [
  {
    href: "/planning/quiz",
    marker: "Three minutes",
    title: "Find your direction",
    body: "Ten questions. You get two styles, a shape for the day, the venues that suit it and what we’d do first.",
    imageId: "style-garden",
  },
  {
    href: "/planning/budget",
    marker: "Five minutes",
    title: "Model the budget",
    body: "Thirteen lines that respond to guest count, region, style and how much help you’re buying. Override anything.",
    imageId: "detail-paper",
  },
  {
    href: "/planning/timeline",
    marker: "Set the date",
    title: "Work the timeline",
    body: "Every task against your actual calendar, so you can see what should already have happened.",
    imageId: "land-light",
  },
  {
    href: "/planning/checklist",
    marker: "Forty-four things",
    title: "The checklist",
    body: "Grouped by how far out the work happens, because that’s the question you’re actually asking.",
    imageId: "detail-stationery",
  },
];

/**
 * The hub. Four tools, alternating sides, each with the honest time cost at
 * the top — because "three minutes" converts better than "get started" and is
 * also simply more useful.
 */
export default function PlanningPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Planning", path: "/planning" },
        ])}
      />

      <PageHeader
        marker="Free, no account"
        title={"Four tools we built\nfor ourselves first."}
        standfirst="These are the working versions of what we use with couples — the budget model, the timeline, the checklist and the direction-finder. Everything saves in your browser. Nothing is sent anywhere unless you ask us to look at it."
      />

      <Container className="pb-12">
        {tools.map((tool, index) => (
          <FadeIn key={tool.href} delay={0.04}>
            <article
              className={`grid items-center gap-8 border-t border-ink/12 py-12 lg:grid-cols-2 lg:gap-20 lg:py-16 ${
                index % 2 === 1 ? "lg:[&>figure]:order-last" : ""
              }`}
            >
              <figure className="m-0">
                <Link href={tool.href} className="group block overflow-hidden">
                  <Photo
                    photoKey={tool.imageId}
                    ratio="wide"
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    imageClassName="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                </Link>
              </figure>

              <div>
                <p className="eyebrow text-ink-50">{tool.marker}</p>
                <h2 className="mt-4 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.06] font-light">
                  <Link href={tool.href} className="hover:text-ink-70">
                    {tool.title}
                  </Link>
                </h2>
                <p className="mt-4 max-w-[46ch] font-sans text-[1.0625rem] leading-[1.7] text-ink-70">
                  {tool.body}
                </p>
                <div className="mt-8">
                  <ButtonLink href={tool.href} variant="onLight">
                    Open it
                  </ButtonLink>
                </div>
              </div>
            </article>
          </FadeIn>
        ))}
      </Container>

      <Ground name="linen" className="py-16 lg:py-20">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="max-w-[24ch] font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] font-light">
                Or have the whole thing written down.
              </h2>
              <p className="mt-3 max-w-[48ch] font-sans text-base leading-relaxed text-ink-70">
                Forty-odd pages: the timeline, the budget model, forty questions
                to ask a venue, and a real running order.
              </p>
            </div>
            <ButtonLink href="/guide" variant="onLight">
              Get the guide
            </ButtonLink>
          </div>
        </Container>
      </Ground>
    </>
  );
}
