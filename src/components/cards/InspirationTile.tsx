"use client";

import Link from "next/link";
import type { Inspiration } from "@/types";
import { Photo } from "@/components/editorial/Photo";
import { SaveButton } from "@/components/ui/SaveButton";
import { cn } from "@/lib/utils";

function Plate({ item, sizes }: { item: Inspiration; sizes: string }) {
  return (
    <div className="overflow-hidden bg-linen">
      <Photo
        photoKey={item.imageId}
        sizes={sizes}
        imageClassName="transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
      />
    </div>
  );
}

/**
 * One image in the gallery.
 *
 * The caption is always present rather than revealed on hover, because hover
 * doesn’t exist on a phone and a photograph with no context is just wallpaper.
 * What hover does add is a slow scale on the image and the save mark coming
 * up to full strength.
 */
export function InspirationTile({
  item,
  onOpen,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  className,
  showCaption = true,
}: {
  item: Inspiration;
  onOpen?: (slug: string) => void;
  sizes?: string;
  className?: string;
  showCaption?: boolean;
}) {
  return (
    <figure className={cn("group relative", className)}>
      {/* Inside the gallery this opens a dialog; anywhere else it has to be a
          real link, so it can be opened in a new tab and crawled. */}
      {onOpen ? (
        <button
          type="button"
          onClick={() => onOpen(item.slug)}
          className="block w-full cursor-zoom-in text-left"
        >
          <span className="sr-only">Open {item.title}</span>
          <Plate item={item} sizes={sizes} />
        </button>
      ) : (
        <Link href={`/inspiration/${item.slug}`} className="block">
          <span className="sr-only">Open {item.title}</span>
          <Plate item={item} sizes={sizes} />
        </Link>
      )}

      <div className="absolute top-1 right-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100 sm:top-2 sm:right-2">
        <SaveButton
          kind="inspiration"
          slug={item.slug}
          onDark
          size="sm"
          className="bg-ink/45 backdrop-blur-[2px]"
        />
      </div>

      {showCaption ? (
        <figcaption className="mt-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {/* Smaller on narrow columns — at 165px a 17px display face wraps
                to four lines and the caption starts competing with the image. */}
            <p className="font-display text-[0.9375rem] leading-snug sm:text-[1.0625rem]">
              {item.title}
            </p>
            <p className="mt-1 font-mono text-[0.5625rem] tracking-wide text-ink-50 sm:text-[0.625rem]">
              {item.location} · {item.season}
            </p>
          </div>
          <div className="flex shrink-0 gap-1 pt-1.5">
            {item.colours.slice(0, 3).map((hex) => (
              <span
                key={hex}
                className="h-2.5 w-2.5 rounded-full ring-1 ring-ink/10"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </figcaption>
      ) : null}
    </figure>
  );
}
