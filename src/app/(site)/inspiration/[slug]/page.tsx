import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { inspiration, inspirationBySlug } from "@/content/inspiration";
import { styleById } from "@/content/styles";
import { Container, Ground } from "@/components/editorial/Layout";
import { Photo } from "@/components/editorial/Photo";
import { InspirationTile } from "@/components/cards/InspirationTile";
import { SaveButton } from "@/components/ui/SaveButton";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return inspiration.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = inspirationBySlug[slug];
  if (!item) return {};

  return pageMetadata({
    title: item.title,
    description: item.caption,
    path: `/inspiration/${item.slug}`,
    imageKey: item.imageId,
  });
}

/**
 * The shareable version of what the gallery shows in a dialog. Same content,
 * its own URL — so a saved image can be sent to a florist and still open.
 */
export default async function InspirationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = inspirationBySlug[slug];
  if (!item) notFound();

  const related = inspiration
    .filter(
      (other) =>
        other.slug !== item.slug &&
        (other.styleIds.some((id) => item.styleIds.includes(id)) ||
          other.season === item.season),
    )
    .slice(0, 4);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Inspiration", path: "/inspiration" },
          { name: item.title, path: `/inspiration/${item.slug}` },
        ])}
      />

      <Container className="pt-32 pb-16 lg:pt-40 lg:pb-24">
        <TextLink href="/inspiration">Back to the gallery</TextLink>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
          <Photo photoKey={item.imageId} sizes="(min-width: 1024px) 60vw, 100vw" />

          <div>
            <p className="eyebrow text-ink-50">
              {item.location} · {item.season}
            </p>
            <h1 className="mt-4 font-display text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] font-light">
              {item.title}
            </h1>
            <p className="mt-5 max-w-[46ch] font-sans text-[1.0625rem] leading-[1.7] text-ink-70">
              {item.caption}
            </p>

            <dl className="mt-9 space-y-4 border-t border-ink/12 pt-6">
              <div className="flex gap-6">
                <dt className="w-24 shrink-0 font-mono text-[0.6875rem] tracking-wide text-ink-50">
                  Colours
                </dt>
                <dd className="flex gap-2">
                  {item.colours.map((hex) => (
                    <span
                      key={hex}
                      className="h-6 w-6 rounded-full ring-1 ring-ink/10"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </dd>
              </div>
              <div className="flex gap-6">
                <dt className="w-24 shrink-0 font-mono text-[0.6875rem] tracking-wide text-ink-50">
                  Mood
                </dt>
                <dd className="font-sans text-[0.9375rem]">{item.mood.join(", ")}</dd>
              </div>
              <div className="flex gap-6">
                <dt className="w-24 shrink-0 font-mono text-[0.6875rem] tracking-wide text-ink-50">
                  Style
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {item.styleIds.map((id) => (
                    <Link
                      key={id}
                      href={`/inspiration?style=${id}`}
                      className="inline-flex min-h-9 items-center border border-ink/20 px-3 font-sans text-[0.8125rem] transition-colors hover:border-ink"
                    >
                      {styleById[id]?.name ?? id}
                    </Link>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="mt-9 flex items-center gap-4">
              <SaveButton kind="inspiration" slug={item.slug} className="-ml-2" />
              {item.storySlug ? (
                <ButtonLink href={`/weddings/${item.storySlug}`} variant="primary">
                  Read the wedding
                </ButtonLink>
              ) : (
                <ButtonLink href="/contact" variant="primary">
                  Start planning
                </ButtonLink>
              )}
            </div>
          </div>
        </div>
      </Container>

      {related.length ? (
        <Ground name="linen" className="py-16 lg:py-24">
          <Container>
            <h2 className="eyebrow mb-8 text-ink-50">In the same direction</h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {related.map((other) => (
                <InspirationTile
                  key={other.slug}
                  item={other}
                  sizes="(min-width: 1024px) 22vw, 46vw"
                />
              ))}
            </div>
          </Container>
        </Ground>
      ) : null}
    </>
  );
}
