import type { Metadata } from "next";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Container, Ground } from "@/components/editorial/Layout";
import { Photo } from "@/components/editorial/Photo";
import { LeadForm } from "@/components/forms/LeadForm";
import { TextLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "The planning guide",
  description:
    "An eighteen-month timeline, a budget model, the questions to ask a venue, a wedding-day running order and the emergency list. Free, by email.",
  path: "/guide",
  imageKey: "detail-stationery",
});

const contents = [
  {
    part: "One",
    title: "The eighteen-month timeline",
    body: "What has to happen when, and — more usefully — what genuinely doesn’t have to happen yet. Four pages.",
  },
  {
    part: "Two",
    title: "A budget that survives contact",
    body: "The thirteen lines every wedding budget has, what each one really costs at 40, 90 and 150 guests, and where the money quietly leaks.",
  },
  {
    part: "Three",
    title: "Forty questions to ask a venue",
    body: "Including the eleven that reveal whether the price you were quoted is the price you will pay.",
  },
  {
    part: "Four",
    title: "Choosing suppliers",
    body: "How to read a photographer’s portfolio, what a caterer’s tasting doesn’t tell you, and the two clauses worth arguing about in any contract.",
  },
  {
    part: "Five",
    title: "The wedding-day running order",
    body: "A real one, annotated — the document fifteen suppliers work from, and why speeches go before dinner.",
  },
  {
    part: "Six",
    title: "The final week, and the box",
    body: "What to do in the last seven days, and the list of things to put in a box that has saved every wedding we’ve ever run.",
  },
];

/**
 * The lead magnet. It has to look like something worth an email address, so
 * the contents are specific and the claims are small.
 */
export default function GuidePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "The guide", path: "/guide" },
        ])}
      />

      <PageHeader
        marker="Free, by email"
        title={"Everything we’d tell you\nin the first hour."}
        standfirst="Forty-odd pages of the things we say on repeat: the timeline, the budget model, the venue questions, and the running order from a real wedding. Written for people planning it themselves — including the ones who then decide they’d rather not."
      />

      <Container className="pb-20 lg:pb-28">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20">
          <div>
            <h2 className="eyebrow mb-7 text-ink-50">What’s in it</h2>
            <ol className="border-t border-ink/12">
              {contents.map((item) => (
                <li key={item.part} className="border-b border-ink/12 py-6">
                  <div className="flex gap-6">
                    <span className="w-12 shrink-0 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-50 uppercase">
                      {item.part}
                    </span>
                    <div>
                      <h3 className="font-display text-xl leading-snug font-light">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-[52ch] font-sans text-[0.9375rem] leading-[1.7] text-ink-70">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-8 max-w-[52ch] font-mono text-[0.6875rem] leading-relaxed tracking-wide text-ink-50">
              One email with the guide, then one a month you can leave at any
              time. We don’t sell the list. There is nothing to sell it to.
            </p>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <Photo
              photoKey="detail-stationery"
              ratio="square"
              sizes="(min-width: 1024px) 38vw, 100vw"
            />
            <div className="mt-9">
              <h2 className="font-display text-2xl leading-tight font-light">
                Where should we send it?
              </h2>
              <LeadForm
                source="guide"
                context={{ magnet: "planning-guide" }}
                submitLabel="Send me the guide"
                compact
                className="mt-6"
              />
            </div>
          </aside>
        </div>
      </Container>

      <Ground name="linen" className="py-16">
        <Container>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <p className="font-sans text-base text-ink-70">
              Or use the tools here, free and without an email address:
            </p>
            <TextLink href="/planning/budget" arrow>
              Budget planner
            </TextLink>
            <TextLink href="/planning/checklist" arrow>
              Checklist
            </TextLink>
            <TextLink href="/planning/timeline" arrow>
              Timeline
            </TextLink>
          </div>
        </Container>
      </Ground>
    </>
  );
}
