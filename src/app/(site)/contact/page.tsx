import type { Metadata } from "next";
import { brand } from "@/content/brand";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Container, Ground } from "@/components/editorial/Layout";
import { Photo } from "@/components/editorial/Photo";
import { LeadForm } from "@/components/forms/LeadForm";
import { TextLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Talk to a planner",
  description:
    "Tell us when, and roughly where. We’ll come back with what’s possible and what it costs. Marram, wedding studio, Aldeburgh.",
  path: "/contact",
  imageKey: "getting-ready",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Talk to a planner", path: "/contact" },
        ])}
      />

      <PageHeader
        marker="First contact"
        title={"Tell us when,\nand roughly where."}
        standfirst="That’s genuinely enough to start with. We’ll come back with what’s possible on that date, in that place, and what it would cost — and if we’re not the right studio for it, we’ll say so and suggest who is."
      />

      <Container className="pb-24 lg:pb-32">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-24">
          <LeadForm source="contact" submitLabel="Send it" compact />

          <aside className="lg:pt-2">
            <Photo
              photoKey="couple-window"
              ratio="landscape"
              sizes="(min-width: 1024px) 38vw, 100vw"
            />

            <dl className="mt-10 space-y-7">
              <div>
                <dt className="eyebrow text-ink-50">Email</dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${brand.email}`}
                    className="font-display text-xl underline decoration-ember decoration-1 underline-offset-[6px]"
                  >
                    {brand.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-ink-50">Telephone</dt>
                <dd className="mt-2 font-sans text-base">
                  <a href={`tel:${brand.phone.replace(/\s/g, "")}`}>{brand.phone}</a>
                  <span className="mt-1 block font-mono text-[0.6875rem] tracking-wide text-ink-50">
                    Weekdays, 9 to 6. Somebody actually answers.
                  </span>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-ink-50">Studio</dt>
                <dd className="mt-2 font-sans text-base leading-relaxed not-italic">
                  {brand.address.street}
                  <br />
                  {brand.address.city}, {brand.address.region}
                  <br />
                  {brand.address.postcode}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-ink-50">What happens next</dt>
                <dd className="mt-2 max-w-[38ch] font-sans text-[0.9375rem] leading-[1.7] text-ink-70">
                  We read it, usually the same day. If it looks like a fit we
                  suggest a call — forty minutes, no charge, no deck. You’ll know
                  by the end of it whether you want to work with us.
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </Container>

      <Ground name="linen" className="py-16">
        <Container>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <p className="font-sans text-base text-ink-70">Not ready to write yet?</p>
            <TextLink href="/planning/quiz" arrow>
              Take the ten-question version
            </TextLink>
            <TextLink href="/guide" arrow>
              Get the planning guide
            </TextLink>
            <TextLink href="/weddings" arrow>
              Read a wedding first
            </TextLink>
          </div>
        </Container>
      </Ground>
    </>
  );
}
