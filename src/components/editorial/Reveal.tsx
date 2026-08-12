"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * Type that rises into place behind a hard edge, one line or one word at a
 * time. Adapted from 21st.dev’s Vertical Cut Reveal (cnippet.dev, id 18595),
 * rebuilt for this site: it fires on scroll rather than on mount, splits by
 * line by default because editorial display type reads better that way, and
 * collapses to plain static text under prefers-reduced-motion.
 *
 * The visible copy is aria-hidden and the real string is exposed once to
 * assistive tech, so a headline is never announced letter by letter.
 */

const SPRING: Transition = { type: "spring", stiffness: 190, damping: 26 };

export function Reveal({
  children,
  as: Tag = "span",
  splitBy = "lines",
  stagger = 0.075,
  delay = 0,
  className,
  lineClassName,
  once = true,
}: {
  children: string;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  splitBy?: "lines" | "words";
  stagger?: number;
  delay?: number;
  className?: string;
  lineClassName?: string;
  once?: boolean;
}) {
  const reduced = useReducedMotion();

  const parts = useMemo(
    () =>
      splitBy === "lines"
        ? children.split("\n")
        : children.split(" ").map((w, i, all) => (i === all.length - 1 ? w : `${w} `)),
    [children, splitBy],
  );

  if (reduced) {
    return (
      <Tag className={cn(splitBy === "lines" && "whitespace-pre-line", className)}>
        {children}
      </Tag>
    );
  }

  const MotionTag = motion[Tag];

  return (
    <MotionTag
      className={cn(
        "flex flex-wrap",
        splitBy === "lines" && "flex-col flex-nowrap",
        className,
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "0px 0px -12% 0px" }}
    >
      <span className="sr-only">{children}</span>
      {parts.map((part, index) => (
        <span
          aria-hidden
          className={cn("inline-flex overflow-hidden", lineClassName)}
          key={index}
        >
          <motion.span
            className="inline-block whitespace-pre will-change-transform"
            variants={{
              hidden: { y: "112%" },
              visible: {
                y: 0,
                transition: { ...SPRING, delay: delay + index * stagger },
              },
            }}
          >
            {/* A trailing space collapses inside inline-block, so hold it. */}
            {part === "" ? " " : part}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/**
 * The quieter sibling. Blocks that shouldn’t announce themselves — images,
 * captions, cards — just lift and fade.
 */
export function FadeIn({
  children,
  delay = 0,
  y = 18,
  className,
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A hairline that draws itself across the measure. Used to open sections —
 * one small piece of choreography instead of a decorative border.
 */
export function RuleDraw({ className, delay = 0 }: { className?: string; delay?: number }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className={cn("h-px w-full origin-left bg-current opacity-20", className)}
      initial={reduced ? undefined : { scaleX: 0 }}
      whileInView={reduced ? undefined : { scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
