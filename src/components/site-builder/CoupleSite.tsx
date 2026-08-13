import type { WeddingSite } from "@/types";
import { Photo } from "@/components/editorial/Photo";
import { cn } from "@/lib/utils";

/**
 * The couple’s published site.
 *
 * One component, three templates. They differ in ground, type scale and
 * whether the hero is full-bleed — real design decisions rather than a colour
 * variable — but the content is identical, so switching never loses anything.
 *
 * Rendered both in the builder preview and at /w/[slug]. Same component, so
 * the preview cannot drift from the published page.
 */
export function CoupleSite({
  site,
  preview = false,
}: {
  site: WeddingSite;
  preview?: boolean;
}) {
  const names =
    site.partnerOne && site.partnerTwo
      ? `${site.partnerOne} & ${site.partnerTwo}`
      : site.partnerOne || site.partnerTwo || "Your names";

  const date = site.date
    ? (() => {
        const [y, m, d] = site.date!.split("-").map(Number);
        return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      })()
    : null;

  const skin = {
    "first-light": {
      shell: "bg-ink text-paper",
      panel: "bg-ink",
      rule: "border-paper/15",
      muted: "text-paper/65",
      hero: "aspect-[4/5] sm:aspect-[16/9]",
      display: "font-display text-[clamp(2.5rem,8vw,6rem)] font-light",
      overlay: 42,
    },
    "long-table": {
      shell: "bg-champagne-wash text-ink",
      panel: "bg-champagne-wash",
      rule: "border-ink/15",
      muted: "text-ink-70",
      hero: "aspect-[4/5] sm:aspect-[21/9]",
      display: "font-display text-[clamp(2.25rem,7vw,5rem)] font-light",
      overlay: 22,
    },
    "last-dance": {
      shell: "bg-paper text-ink",
      panel: "bg-paper",
      rule: "border-ink/12",
      muted: "text-ink-70",
      hero: "aspect-square sm:aspect-[3/2]",
      display: "font-display text-[clamp(2rem,6vw,4.5rem)] font-light",
      overlay: 10,
    },
  }[site.template];

  return (
    <div className={cn(skin.shell, preview ? "" : "min-h-dvh")}>
      {/* --- Hero ---------------------------------------------------------- */}
      <header className="relative">
        <Photo
          photoKey={site.heroImageId}
          ratio="fill"
          sizes="100vw"
          className={skin.hero}
          overlay={skin.overlay}
          priority={!preview}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 className={cn(skin.display, "leading-[0.98] text-paper")}>
            {names}
          </h1>
          {date ? (
            <p className="mt-5 font-mono text-[0.6875rem] tracking-[0.2em] text-paper/85 uppercase sm:text-xs">
              {date}
            </p>
          ) : null}
          {site.location ? (
            <p className="mt-2 font-mono text-[0.6875rem] tracking-[0.2em] text-paper/70 uppercase sm:text-xs">
              {site.location}
            </p>
          ) : null}
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-8 lg:py-24">
        {/* --- Story ------------------------------------------------------- */}
        {site.story ? (
          <section className={cn("border-b pb-12", skin.rule)}>
            <p
              className={cn(
                "font-sans text-[1.0625rem] leading-[1.8] whitespace-pre-line",
                skin.muted,
              )}
            >
              {site.story}
            </p>
          </section>
        ) : null}

        {/* --- Schedule ---------------------------------------------------- */}
        {site.schedule.length ? (
          <section className={cn("border-b py-12", skin.rule)}>
            <h2 className="eyebrow mb-7 opacity-60">The day</h2>
            <ol>
              {site.schedule.map((entry, index) => (
                <li
                  key={`${entry.time}-${index}`}
                  className={cn("flex gap-6 border-b py-4 last:border-0", skin.rule)}
                >
                  <time className="w-16 shrink-0 font-mono text-sm tabular-nums opacity-70">
                    {entry.time}
                  </time>
                  <div>
                    <p className="font-display text-xl leading-snug">{entry.title}</p>
                    {entry.detail ? (
                      <p className={cn("mt-1 font-sans text-sm", skin.muted)}>
                        {entry.detail}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {/* --- Practical --------------------------------------------------- */}
        {(site.venue || site.travel || site.accommodation || site.dressCode) && (
          <section className={cn("border-b py-12", skin.rule)}>
            <h2 className="eyebrow mb-7 opacity-60">What you need to know</h2>
            <dl className="space-y-7">
              {[
                { label: "Where", value: site.venue },
                { label: "Getting there", value: site.travel },
                { label: "Staying", value: site.accommodation },
                { label: "What to wear", value: site.dressCode },
              ]
                .filter((row) => row.value)
                .map((row) => (
                  <div key={row.label}>
                    <dt className="font-mono text-[0.6875rem] tracking-[0.14em] uppercase opacity-60">
                      {row.label}
                    </dt>
                    <dd
                      className={cn(
                        "mt-2 font-sans text-[0.9375rem] leading-[1.7] whitespace-pre-line",
                        skin.muted,
                      )}
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
            </dl>
          </section>
        )}

        {/* --- Registry ----------------------------------------------------- */}
        {site.registry ? (
          <section className={cn("border-b py-12", skin.rule)}>
            <h2 className="eyebrow mb-5 opacity-60">Presents</h2>
            <p className={cn("font-sans text-[0.9375rem] leading-[1.7]", skin.muted)}>
              {site.registry}
            </p>
            {site.registryUrl ? (
              <a
                href={site.registryUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-5 inline-flex min-h-11 items-center bg-ember px-6 font-mono text-[0.6875rem] tracking-[0.14em] text-ink uppercase"
              >
                The list
              </a>
            ) : null}
          </section>
        ) : null}

        {/* --- Gallery ------------------------------------------------------ */}
        {site.galleryImageIds.length ? (
          <section className={cn("border-b py-12", skin.rule)}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {site.galleryImageIds.map((key, index) => (
                <Photo
                  key={`${key}-${index}`}
                  photoKey={key}
                  ratio="square"
                  sizes="(min-width: 640px) 30vw, 45vw"
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* --- RSVP ---------------------------------------------------------- */}
        {site.rsvpEnabled ? (
          <section className="py-12 text-center">
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight font-light">
              Are you coming?
            </h2>
            <p className={cn("mx-auto mt-4 max-w-[36ch] font-sans text-base", skin.muted)}>
              Let us know either way. It genuinely helps.
            </p>
            <button
              type="button"
              disabled
              className="mt-7 inline-flex min-h-12 cursor-not-allowed items-center bg-ember px-8 font-mono text-[0.6875rem] tracking-[0.14em] text-ink uppercase opacity-90"
            >
              RSVP
            </button>
            <p className="mt-4 font-mono text-[0.625rem] tracking-wide opacity-60">
              Demo build — the RSVP form is not wired to a mailbox.
            </p>
          </section>
        ) : null}
      </div>
    </div>
  );
}
