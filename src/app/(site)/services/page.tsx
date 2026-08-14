import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/content/services";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Container, Ground } from "@/components/editorial/Layout";
import { Photo } from "@/components/editorial/Photo";
import { FadeIn } from "@/components/editorial/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata, serviceSchema } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Planning services",
  description:
    "Full planning, partial planning, day-of management, design and styling, and venue sourcing. Fees, what’s included, who each one suits.",
  path: "/services",
  imageKey: "long-table",
});

/**
 * Six services, alternating sides. The marker is how far out the work usually
 * starts, which is the most useful thing to know about each one and a more
 * honest structural device than numbering them.
 */
export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          ...services.map((service) => serviceSchema(service)),
        ]}
      />

      <PageHeader
        marker="Six ways in"
        title={"Six ways in.\nMost people need\nthe second one."}
        standfirst="The marker on each is how far out that work usually starts. It’s a guide rather than a rule — we’ve picked up a wedding six days before now, and it was fine."
      />

      <Container className="pb-10">
        {services.map((service, index) => (
          <FadeIn key={service.slug} delay={0.04}>
            <article
              className={`grid items-center gap-8 border-t border-ink/12 py-12 lg:grid-cols-2 lg:gap-20 lg:py-16 ${
                index % 2 === 1 ? "lg:[&>figure]:order-last" : ""
              }`}
            >
              <figure className="m-0">
                <Link href={`/services/${service.slug}`} className="group block overflow-hidden">
                  <Photo
                    photoKey={service.imageId}
                    ratio="wide"
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    imageClassName="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                </Link>
              </figure>

              <div>
                <p className="eyebrow text-ink-50">{service.index}</p>
                <h2 className="mt-4 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.06] font-light">
                  <Link href={`/services/${service.slug}`} className="hover:text-ink-70">
                    {service.name}
                  </Link>
                </h2>
                <p className="mt-4 max-w-[46ch] font-sans text-[1.0625rem] leading-[1.7] text-ink-70">
                  {service.standfirst}
                </p>

                <ul className="mt-7 space-y-2">
                  {service.includes.slice(0, 4).map((line) => (
                    <li
                      key={line}
                      className="flex gap-3 font-sans text-[0.9375rem] leading-relaxed text-ink-80"
                    >
                      <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-ember" />
                      {line}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <ButtonLink href={`/services/${service.slug}`} variant="onLight">
                    What’s included
                  </ButtonLink>
                  <p className="font-mono text-[0.6875rem] tracking-wide text-ink-50">
                    from {formatCurrency(service.feeFrom)}
                  </p>
                </div>
              </div>
            </article>
          </FadeIn>
        ))}
      </Container>

      <Ground name="ink" className="py-20 lg:py-28">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="max-w-[20ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08] font-light">
                Not sure which of these you need?
              </h2>
              <p className="mt-4 max-w-[44ch] font-sans text-base leading-relaxed text-paper/70">
                Ten questions and about three minutes. It’ll tell you, and it’s
                usually right.
              </p>
            </div>
            <ButtonLink href="/planning/quiz" variant="primary" size="lg">
              Find out
            </ButtonLink>
          </div>
        </Container>
      </Ground>
    </>
  );
}
