"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { getPhoto, photoUrl, tonePlaceholder } from "@/content/media";
import { cn } from "@/lib/utils";

/**
 * A photograph that moves a little slower than the page.
 *
 * Deliberately restrained: the image is scaled just enough to cover the extra
 * travel, so nothing crops unexpectedly, and the whole effect is skipped under
 * prefers-reduced-motion — where it falls back to a plain covered image.
 */
export function ParallaxPhoto({
  photoKey,
  className,
  sizes = "100vw",
  priority = false,
  /** Pixels of travel across the full scroll of the element. */
  travel = 90,
  overlay,
  alt,
}: {
  photoKey: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  travel?: number;
  overlay?: number;
  alt?: string;
}) {
  const photo = getPhoto(photoKey);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-travel, travel]);

  // Cover the travel plus a hair, so the edges never show through.
  const scale = 1 + (travel * 2) / 900;

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={{ backgroundColor: photo.tone }}
    >
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { y, scale }}
      >
        <Image
          src={photoUrl(photo, { width: 2400 })}
          alt={alt ?? photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={tonePlaceholder(photo.tone)}
          className="object-cover"
        />
      </motion.div>
      {overlay ? (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(28, 24, 10, ${overlay / 100})` }}
        />
      ) : null}
    </div>
  );
}
