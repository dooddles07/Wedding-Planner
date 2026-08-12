import type { Metadata } from "next";
import { faqs, flatFaqs } from "@/content/faq";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Container, Ground } from "@/components/editorial/Layout";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Questions",
  description:
    "What planning costs, when to get in touch, what happens if it rains, and whether we take supplier commission. The questions people actually ask on a first call.",
  path: "/faq",
  imageKey: "detail-stationery",
});

/**
 * Plain disclosure rather than an accordion: there are sixteen questions, the
 * answers are short, and hiding them behind a click helps nobody. Grouped, and
 * the group names sit in the rail.
 */
export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(flatFaqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Questions", path: "/faq" },
          ]),
        ]}
      />

      <PageHeader
        marker="Asked and answered"
        title={"The questions people\nactually ask."}
        standfirst="Answered the way we’d answer them on the phone, which is to say without a brochure open in front of us."
      />

      <Container className="pb-24 lg:pb-32">
        {faqs.map((group) => (
          <section
            key={group.group}
            className="mb-14 lg:mb-20 lg:grid lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[9.5rem_minmax(0,1fr)]"
          >
            <h2 className="eyebrow mb-7 border-t border-ink/15 pt-4 text-ink-50 lg:sticky lg:top-32 lg:mb-0 lg:self-start">
              {group.group}
            </h2>

            <dl className="border-t border-ink/12">
              {group.items.map((item) => (
                <div key={item.question} className="border-b border-ink/12 py-7">
                  <dt className="max-w-[36ch] font-display text-xl leading-snug font-light sm:text-2xl">
                    {item.question}
                  </dt>
                  <dd className="mt-4 max-w-[62ch] font-sans text-[1.0625rem] leading-[1.7] text-ink-70">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </Container>

      <Ground name="ink" className="py-20 lg:py-28">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-[22ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08] font-light">
              Something we haven’t answered?
            </h2>
            <ButtonLink href="/contact" variant="primary" size="lg">
              Ask us directly
            </ButtonLink>
          </div>
        </Container>
      </Ground>
    </>
  );
}
