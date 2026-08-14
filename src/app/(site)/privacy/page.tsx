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
        "The planning tools — checklist, budget, timeline, guest list, saved venues and images, and your wedding site — stay in this browser using localStorage, and we cannot see them. Clearing your browser data deletes them.",
        "If you sign in, that same data is copied to a database so it follows you to another device. Signing in is optional and everything works without it — it only changes where the data lives, not what the tools do.",
      ],
    },
    {
      heading: "What you send us",
      body: [
        "If you fill in a form — the contact form, an enquiry, the guide, the newsletter — we receive what you typed and the context you were in when you sent it, such as which venue page you were on or the direction the quiz produced.",
        "That submission is stored in our database and emailed to us. We do not sell it, and we do not share it with the suppliers on this site unless you ask us to introduce you.",
      ],
    },
    {
      heading: "Cookies and tracking",
      body: [
        "We use Vercel Analytics to see which pages get read and which links get clicked. It does not use cookies and cannot identify you personally. There are no advertising cookies and no third-party trackers on this site.",
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
