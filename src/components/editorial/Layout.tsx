import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------
   Ground
   ------------------------------------------------------------------------- */

export type GroundName = "ink" | "paper" | "linen" | "forest" | "champagne";

const GROUND: Record<GroundName, string> = {
  ink: "bg-ink text-paper",
  paper: "bg-paper text-ink",
  linen: "bg-linen text-ink",
  forest: "bg-forest text-champagne",
  champagne: "bg-champagne text-ink",
};

/**
 * A band of the page with its own light.
 *
 * The homepage runs from first light to last dance, and the ground changes as
 * the day does: ink before dawn, paper through the morning, champagne at
 * golden hour, ink again at the end. `data-ground` is read by the header so
 * the navigation can invert itself over each band.
 */
export function Ground({
  name,
  children,
  className,
  id,
}: {
  name: GroundName;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} data-ground={name} className={cn(GROUND[name], className)}>
      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------
   Container
   ------------------------------------------------------------------------- */

export function Container({
  children,
  className,
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "wide" | "narrow" | "measure";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-8 lg:px-12",
        {
          default: "max-w-[100rem]",
          wide: "max-w-[120rem]",
          narrow: "max-w-[68rem]",
          measure: "max-w-[46rem]",
        }[size],
        className,
      )}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------
   The margin rail
   ------------------------------------------------------------------------- */

/**
 * The running order.
 *
 * A wedding planner’s core artefact is a timed sheet: what happens, and when.
 * That is the structural device for this whole site — a time and a note in the
 * outer margin, rather than 01 / 02 / 03, which would only be decoration. The
 * rail sticks as you read the chapter, so the hour stays with you.
 *
 * Below 1024px it collapses to an inline marker above the content, because a
 * margin you have to scroll sideways to see is not a margin.
 */
export function Chapter({
  time,
  note,
  children,
  className,
  contentClassName,
  id,
}: {
  time: string;
  note?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  id?: string;
}) {
  return (
    <Container className={className}>
      <div className="lg:grid lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[9.5rem_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="mb-8 flex items-baseline gap-4 border-t border-current/15 pt-4 lg:mb-0 lg:flex-col lg:gap-3">
            <time className="eyebrow tabular-nums" dateTime={toIsoTime(time)}>
              {time}
            </time>
            {note ? (
              <p className="font-mono text-[0.6875rem] leading-[1.6] tracking-wide opacity-70 lg:pr-2">
                {note}
              </p>
            ) : null}
          </div>
        </div>
        <div id={id} className={cn("min-w-0", contentClassName)}>
          {children}
        </div>
      </div>
    </Container>
  );
}

/** "17:00" -> "17:00" as a valid datetime; anything else is left off. */
function toIsoTime(time: string) {
  return /^\d{2}:\d{2}$/.test(time) ? time : undefined;
}

/* -------------------------------------------------------------------------
   Type
   ------------------------------------------------------------------------- */

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn("eyebrow opacity-70", className)}>{children}</p>;
}

/**
 * A note in the planner’s own hand. Sits beside the prose, not in it — the
 * aside that a good planner would actually make.
 */
export function Marginalia({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "border-l border-ember/40 py-1 pl-4 font-mono text-[0.75rem] leading-[1.7] opacity-70",
        className,
      )}
    >
      {children}
    </aside>
  );
}

export function Standfirst({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "max-w-[38ch] font-sans text-lg leading-[1.55] opacity-75 sm:text-xl",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Body copy set to a proper measure. Prose anywhere else is a mistake. */
export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-[62ch] space-y-5 font-sans text-[1.0625rem] leading-[1.7] opacity-85",
        className,
      )}
    >
      {children}
    </div>
  );
}
