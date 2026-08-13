import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VENDOR_CATEGORY_LABEL, vendorBySlug, vendors } from "@/content/vendors";
import { getStyles } from "@/content/styles";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Container, Ground } from "@/components/editorial/Layout";
import { Photo } from "@/components/editorial/Photo";
import { FadeIn } from "@/components/editorial/Reveal";
import { VendorCard } from "@/components/cards/VendorCard";
import { SaveButton } from "@/components/ui/SaveButton";
import { PriceBand } from "@/components/ui/Chip";
import { LeadForm } from "@/components/forms/LeadForm";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import { TextLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";
import { demoNotice } from "@/content/brand";

export function generateStaticParams() {
  return vendors.map((vendor) => ({ slug: vendor.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vendor = vendorBySlug[slug];
  if (!vendor) return {};

  return pageMetadata({
    title: `${vendor.name} — ${VENDOR_CATEGORY_LABEL[vendor.category]}`,
    description: vendor.standfirst,
    path: `/vendors/${vendor.slug}`,
    imageKey: vendor.heroImageId,
  });
}

/**
 * A supplier profile, built like a portfolio: the work first and large, the
 * details underneath. The price is a band and a starting figure, because that
 * is genuinely all anyone can tell you before a conversation.
 */
export default async function VendorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vendor = vendorBySlug[slug];
  if (!vendor) notFound();

  const styles = getStyles(vendor.styleIds);
  const sameCategory = vendors
    .filter((other) => other.slug !== vendor.slug && other.category === vendor.category)
    .slice(0, 3);
  const others =
    sameCategory.length > 0
      ? sameCategory
      : vendors.filter((other) => other.slug !== vendor.slug).slice(0, 3);

  const priceLabel =
    vendor.category === "caterers"
      ? `${formatCurrency(vendor.priceFrom)} a head`
      : `from ${formatCurrency(vendor.priceFrom)}`;

  const travel = vendor.travelsInternationally
    ? "Britain and abroad"
    : vendor.travelsNationally
      ? "Anywhere in Britain"
      : "Local only";

  return (
    <>
      <TrackEvent event={{ name: "vendor_viewed", slug: vendor.slug }} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Suppliers", path: "/vendors" },
          { name: vendor.name, path: `/vendors/${vendor.slug}` },
        ])}
      />

      <PageHeader
        marker={VENDOR_CATEGORY_LABEL[vendor.category]}
        title={vendor.name}
        standfirst={vendor.standfirst}
        aside={
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <span className="flex items-center gap-2 font-mono text-[0.6875rem] tracking-wide text-ink-50">
              <PriceBand band={vendor.priceBand} />
              {priceLabel}
            </span>
            <span className="font-mono text-[0.6875rem] tracking-wide text-ink-50">
              {vendor.location}
            </span>
            <span className="font-mono text-[0.6875rem] tracking-wide text-ink-50">
              {travel}
            </span>
            <SaveButton kind="vendor" slug={vendor.slug} className="-ml-2" />
          </div>
        }
      />

      {/* --- The work ------------------------------------------------------ */}
      <Container className="pb-16 lg:pb-24">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
          {vendor.portfolioImageIds.map((key, index) => (
            <FadeIn
              key={`${key}-${index}`}
              delay={(index % 3) * 0.05}
              className={index === 0 ? "col-span-2 row-span-2 lg:col-span-2" : undefined}
            >
              <Photo
                photoKey={key}
                ratio={index === 0 ? "landscape" : "square"}
                sizes={index === 0 ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, 46vw"}
                className="h-full"
                priority={index === 0}
              />
            </FadeIn>
          ))}
        </div>
      </Container>

      {/* --- About --------------------------------------------------------- */}
      <Container className="pb-16 lg:pb-24">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
          <div className="max-w-[62ch] space-y-5 font-sans text-[1.0625rem] leading-[1.75] text-ink-80">
            {vendor.description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <aside>
            <h2 className="eyebrow mb-5 text-ink-50">Good at</h2>
            <ul className="border-t border-ink/12">
              {vendor.specialities.map((speciality) => (
                <li
                  key={speciality}
                  className="border-b border-ink/12 py-3 font-sans text-[0.9375rem]"
                >
                  {speciality}
                </li>
              ))}
            </ul>

            <h2 className="eyebrow mt-9 mb-4 text-ink-50">Suits</h2>
            <div className="flex flex-wrap gap-2">
              {styles.map((style) => (
                <TextLink key={style.id} href={`/inspiration?style=${style.id}`}>
                  {style.name}
                </TextLink>
              ))}
            </div>

            {demoNotice ? (
              <p className="mt-9 font-mono text-[0.625rem] leading-relaxed tracking-wide text-ink-50">
                Sample profile, invented for this build. We take no commission.
              </p>
            ) : null}
          </aside>
        </div>
      </Container>

      {/* --- Enquiry -------------------------------------------------------- */}
      <Ground name="linen" className="py-20 lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-24">
            <div>
              <h2 className="max-w-[20ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08] font-light">
                Ask about {vendor.name}.
              </h2>
              <p className="mt-5 max-w-[44ch] font-sans text-base leading-[1.7] text-ink-70">
                We will check their availability for your date and tell you
                honestly whether they are the right fit — sometimes they are
                not, and it is better to know now.
              </p>
            </div>
            <LeadForm
              source="vendor"
              inquiry={{ targetSlug: vendor.slug, targetType: "vendor" }}
              context={{ vendor: vendor.slug, category: vendor.category }}
              submitLabel="Check availability"
              compact
            />
          </div>
        </Container>
      </Ground>

      <Container className="py-20 lg:py-28">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-none font-light">
            {sameCategory.length ? "Others in this category" : "Also on the list"}
          </h2>
          <TextLink href="/vendors" arrow>
            All suppliers
          </TextLink>
        </div>
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((other) => (
            <VendorCard key={other.slug} vendor={other} />
          ))}
        </div>
      </Container>
    </>
  );
}
