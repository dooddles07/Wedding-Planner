import type { Metadata } from "next";
import { brand } from "@/content/brand";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Container } from "@/components/editorial/Layout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms",
  description: "What this site is, what the numbers on it mean, and what they don’t.",
  path: "/terms",
});

export default function TermsPage() {
  const sections = [
    {
      heading: "This is a demonstration build",
      body: [
        `${brand.name} is an invented wedding studio. Every wedding story, venue, supplier, couple and testimonial on this site was written to demonstrate the design and is not a record of real people or real businesses. Any resemblance to a real venue or supplier of the same name is coincidental.`,
      ],
    },
    {
      heading: "Prices are indicative",
      body: [
        "Fees, venue hire ranges and supplier starting prices shown here are illustrative bands. They are not quotes, they are not offers, and nothing on this site forms a contract.",
        "The budget planner is a working model, not a national average. It responds to guest count, region, style and planning level because those are the four things that genuinely move a wedding budget — but it is a starting point for a conversation, not a forecast.",
      ],
    },
    {
      heading: "The planning tools",
      body: [
        "The checklist, timeline, budget planner and wedding site builder are provided as they are. Everything you enter is stored in your own browser, so it is yours — and it is also your only copy. Export the guest list if you need something durable.",
      ],
    },
    {
      heading: "Photography",
      body: [
        "Photographs are from Unsplash and used under the Unsplash Licence. They illustrate the design; they are not photographs of the weddings described, which did not happen.",
      ],
    },
    {
      heading: "Getting in touch",
      body: [`Questions about any of this go to ${brand.email}.`],
    },
  ];

  return (
    <>
      <PageHeader
        marker="The small print"
        title={"What this is,\nand what it isn’t."}
        standfirst="Short, because there is not much to say and none of it should be hidden."
      />

      <Container className="pb-24">
        <div className="max-w-[62ch]">
          {sections.map((section) => (
            <section key={section.heading} className="border-t border-ink/12 py-8">
              <h2 className="font-display text-2xl leading-snug font-light">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4 font-sans text-[1.0625rem] leading-[1.75] text-ink-70">
                {section.body.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
