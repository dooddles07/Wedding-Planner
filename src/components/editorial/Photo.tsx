import Image from "next/image";
import { getPhoto, photoUrl, tonePlaceholder } from "@/content/media";
import { cn } from "@/lib/utils";

const RATIO = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[3/2]",
  square: "aspect-square",
  tall: "aspect-[2/3]",
  wide: "aspect-[16/9]",
  cinema: "aspect-[21/9]",
  fill: "",
} as const;

export type PhotoRatio = keyof typeof RATIO;

/**
 * Every photograph on the site goes through here.
 *
 * It fixes the aspect box before the image arrives (so nothing shifts), paints
 * the dominant tone underneath (so nothing flashes grey), and takes alt text
 * from the register rather than from the call site — which is how alt text
 * stays written once and stays accurate.
 */
export function Photo({
  photoKey,
  ratio,
  sizes = "100vw",
  priority = false,
  className,
  imageClassName,
  overlay,
  alt,
}: {
  photoKey: string;
  ratio?: PhotoRatio;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  /** Darkens the photograph so type can sit on it. 0–100. */
  overlay?: number;
  /** Override only when context changes what the image means. */
  alt?: string;
}) {
  const photo = getPhoto(photoKey);
  const box = RATIO[ratio ?? photo.aspect];

  return (
    <div
      className={cn("relative overflow-hidden bg-ink-15", box, className)}
      style={{ backgroundColor: photo.tone }}
    >
      <Image
        src={photoUrl(photo, { width: 2000 })}
        alt={alt ?? photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={tonePlaceholder(photo.tone)}
        className={cn("object-cover", imageClassName)}
      />
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

/**
 * A photograph that drifts slightly slower than the page. Used sparingly —
 * the hero and one or two full-bleed plates, not every image.
 */
export { ParallaxPhoto } from "./ParallaxPhoto";
