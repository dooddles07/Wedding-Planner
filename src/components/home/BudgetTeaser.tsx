"use client";

import { useMemo, useState } from "react";
import { buildBudget, perHead } from "@/lib/budget";
import { Chapter, Ground } from "@/components/editorial/Layout";
import { FadeIn, Reveal } from "@/components/editorial/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { formatCurrency, formatNumber } from "@/lib/utils";

/**
 * 20:30. Between courses.
 *
 * A working slice of the budget tool rather than a screenshot of it: move
 * either slider and the four biggest lines move with it. The point being made
 * is that the shape of a budget is set by guest count more than by total, and
 * you can feel that here in about five seconds.
 */
export function BudgetTeaser() {
  const [total, setTotal] = useState(45000);
  const [guests, setGuests] = useState(90);

  const items = useMemo(
    () =>
      buildBudget({
        total,
        guestCount: guests,
        location: "East of England",
        styleId: null,
        planningLevel: "partial",
      }),
    [total, guests],
  );

  const top = [...items].sort((a, b) => b.allocated - a.allocated).slice(0, 4);
  const max = top[0]?.allocated || 1;
  const head = perHead(items, guests);

  return (
    <Ground name="linen" className="py-20 lg:py-28">
      <Chapter time="20:30" note="somebody’s doing sums on a napkin">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div>
            <Reveal
              as="h2"
              className="font-display text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] font-light"
              stagger={0.08}
            >
              {"Where the money actually goes."}
            </Reveal>
            <FadeIn delay={0.1}>
              <p className="mt-5 max-w-[44ch] font-sans text-base leading-[1.7] text-ink-70">
                Move either one. The lines move with them — guest count changes
                the shape of a budget far more than the total does.
              </p>
            </FadeIn>

            <div className="mt-9 space-y-7">
              <Slider
                id="teaser-total"
                label="Total budget"
                value={total}
                min={10000}
                max={200000}
                step={2500}
                display={formatCurrency(total)}
                onChange={setTotal}
              />
              <Slider
                id="teaser-guests"
                label="Guests"
                value={guests}
                min={20}
                max={250}
                step={5}
                display={formatNumber(guests)}
                onChange={setGuests}
              />
            </div>

            <p className="mt-8 font-mono text-[0.6875rem] leading-relaxed tracking-wide text-ink-50">
              About {formatCurrency(head)} a head on food, drink, paper and
              transport.
            </p>
          </div>

          <FadeIn delay={0.12}>
            <ul className="space-y-5">
              {top.map((item) => (
                <li key={item.category}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-sans text-[0.9375rem]">{item.label}</span>
                    <span className="font-mono text-sm tabular-nums">
                      {formatCurrency(item.allocated)}
                    </span>
                  </div>
                  <div className="mt-2 h-[3px] w-full bg-ink/10">
                    <div
                      className="h-full bg-ember transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{ width: `${(item.allocated / max) * 100}%` }}
                    />
                  </div>
                  {item.note ? (
                    <p className="mt-2 font-mono text-[0.625rem] leading-relaxed tracking-wide text-ink-50">
                      {item.note}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <ButtonLink href="/planning/budget" variant="onLight" arrow>
                Build the whole thing
              </ButtonLink>
            </div>
          </FadeIn>
        </div>
      </Chapter>
    </Ground>
  );
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (next: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="eyebrow text-ink-50">
          {label}
        </label>
        <output htmlFor={id} className="font-display text-2xl leading-none tabular-nums">
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="marram-range mt-4 w-full"
      />
    </div>
  );
}
