import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { serviceBySlug, services } from "@/content/services";
import { Container, Ground, Marginalia } from "@/components/editorial/Layout";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Photo } from "@/components/editorial/Photo";
import { LeadForm } from "@/components/forms/LeadForm";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata, serviceSchema } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug[slug];
  if (!service) return {};

  return pageMetadata({
    title: service.name,
    description: service.standfirst,
    path: `/services/${service.slug}`,
    imageKey: service.imageId,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = serviceBySlug[slug];
  if (!service) notFound();

  const others = services.filter((item) => item.slug !== service.slug);

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(service),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.name, path: `/services/${service.slug}` },
          ]),
        ]}
      />

      <PageHeader
        marker={service.index}
        title={service.name}
        standfirst={service.standfirst}
        aside={
          <p className="font-mono text-[0.6875rem] tracking-wide text-ink-50">
            from {formatCurrency(service.feeFrom)} · {service.feeNote}
          </p>
        }
      />

      <Container className="pb-16 lg:pb-24">
        <Photo
          photoKey={service.imageId}
          ratio="cinema"
          sizes="(min-width: 1024px) 92vw, 100vw"
          priority
        />
      </Container>

      <Container className="pb-20 lg:pb-28">
        <div className="lg:grid lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[9.5rem_minmax(0,1fr)]">
          <Marginalia className="mb-10 lg:sticky lg:top-32 lg:mb-0 lg:self-start">
            {service.promise}
          </Marginalia>

          <div>
            <div className="max-w-[62ch] space-y-5 font-sans text-[1.0625rem] leading-[1.75] text-ink-80">
              {service.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-14 grid gap-12 sm:grid-cols-2 sm:gap-10">
              <div>
                <h2 className="eyebrow mb-6 text-ink-50">What’s included</h2>
                <ul className="border-t border-ink/12">
                  {service.includes.map((line) => (
                    <li
                      key={line}
                      className="border-b border-ink/12 py-3.5 font-sans text-[0.9375rem] leading-relaxed"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="eyebrow mb-6 text-ink-50">Right for you if</h2>
                <ul className="space-y-3">
                  {service.idealFor.map((line) => (
                    <li
                      key={line}
                      className="flex gap-3 font-sans text-[0.9375rem] leading-relaxed"
                    >
                      <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-ember" />
                      {line}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 border-t border-ink/12 pt-6">
                  <p className="font-display text-2xl leading-none font-light">
                    {formatCurrency(service.feeFrom)}
                    <span className="ml-2 font-sans text-sm text-ink-50">to begin</span>
                  </p>
                  <p className="mt-3 max-w-[36ch] font-sans text-sm leading-relaxed text-ink-70">
                    {service.feeNote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* --- Enquiry ------------------------------------------------------ */}
      <Ground name="linen" className="py-20 lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-24">
            <div>
              <h2 className="max-w-[18ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08] font-light">
                Tell us when, and roughly where.
              </h2>
              <p className="mt-5 max-w-[44ch] font-sans text-base leading-[1.7] text-ink-70">
                Two fields to start. We’ll come back with whether {service.name.toLowerCase()} is
                actually the right one for you — sometimes it isn’t.
              </p>

              <div className="mt-10">
                <h3 className="eyebrow mb-4 text-ink-50">Or look at</h3>
                <ul className="space-y-2.5">
                  {others.slice(0, 3).map((other) => (
                    <li key={other.slug}>
                      <TextLink href={`/services/${other.slug}`} arrow>
                        {other.name}
                      </TextLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <LeadForm
              source="service"
              context={{ service: service.slug }}
              submitLabel="Send it"
              compact
            />
          </div>
        </Container>
      </Ground>

      <Ground name="ink" className="py-16 lg:py-20">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-[40ch] font-sans text-base text-paper/70">
              Still deciding? The quiz takes three minutes and recommends one of
              these six at the end.
            </p>
            <ButtonLink href="/planning/quiz" variant="onDark">
              Take the quiz
            </ButtonLink>
          </div>
        </Container>
      </Ground>
    </>
  );
}
