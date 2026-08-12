import type { Metadata } from "next";
import { brand } from "@/content/brand";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Container } from "@/components/editorial/Layout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description:
    "What this site stores, where it stores it, and what happens to anything you send us.",
  path: "/privacy",
});

/**
 * Written plainly. A privacy page nobody can read is not a privacy page, and
 * this site genuinely does almost nothing worth obscuring.
 */
export default function PrivacyPage() {
  const sections = [
    {
      heading: "What stays in your browser",
      body: [
        "The planning tools — checklist, budget, timeline, guest list, saved venues and images, and your wedding site — are stored in this browser using localStorage. They are not sent to us. We cannot see them. Clearing your browser data deletes them, and there is no copy to restore from.",
      ],
    },
    {
      heading: "What you send us",
      body: [
        "If you fill in a form — the contact form, an enquiry, the guide, the newsletter — we receive what you typed and the context you were in when you sent it, such as which venue page you were on or the direction the quiz produced.",
        "In this demonstration build that submission is logged by the server and kept in your browser. In a live version it would go to our inbox and our client records, and nowhere else. We do not sell it, and we do not share it with the suppliers on this site unless you ask us to introduce you.",
      ],
    },
    {
      heading: "Cookies and tracking",
      body: [
        "There are no advertising cookies and no third-party trackers on this site. The analytics layer is built but not connected to any provider — no events leave your browser.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        `Under UK GDPR you can ask what we hold about you, ask us to correct it, or ask us to delete it. Email ${brand.email} and we will do it within a month, usually the same week.`,
      ],
    },
    {
      heading: "This is a demonstration",
      body: [
        `${brand.name} is an invented studio, and the weddings, venues, suppliers and couples on this site are written for demonstration. If you have arrived here expecting a real business, this is not one.`,
      ],
    },
  ];

  return (
    <>
      <PageHeader
        marker="Plainly"
        title={"What we keep,\nand where."}
        standfirst="Almost nothing, and mostly not on our machines. The long version is below and it is genuinely short."
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
