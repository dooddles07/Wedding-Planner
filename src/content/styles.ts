import type { WeddingStyle, WeddingStyleId } from "@/types";

/**
 * The ten directions a wedding tends to go in.
 *
 * These are the spine of the site: the quiz weights against them, inspiration
 * and venues are tagged with them, and the homepage style section is built
 * from this list in this order.
 */
export const weddingStyles: WeddingStyle[] = [
  {
    id: "modern",
    name: "Modern",
    tagline: "Hard lines, soft food.",
    description:
      "Clean rooms, long tables, one strong material repeated. It works because everything else gets stripped out — no charger plates, no chair covers, nothing on the table that isn’t going to be eaten or lit.",
    imageId: "style-modern",
    palette: ["#EDE9E1", "#2E2910", "#8E8778", "#C6BFAF"],
    keywords: ["spare", "architectural", "confident", "considered"],
  },
  {
    id: "romantic",
    name: "Romantic",
    tagline: "Candles low, flowers loose.",
    description:
      "Soft light and a lot of it. Flowers that look picked rather than arranged, tables that fill up as the night goes on, and a room warm enough that nobody puts their jacket back on.",
    imageId: "style-romantic",
    palette: ["#E9D8CE", "#C9A08C", "#7C5B4C", "#F4EDE6"],
    keywords: ["warm", "candlelit", "generous", "unhurried"],
  },
  {
    id: "garden",
    name: "Garden",
    tagline: "Planned around what’s in bloom that week.",
    description:
      "The flowers come from within about twenty miles and whatever is having a good year gets the lead. It means committing to a season rather than a colour, which is the more interesting decision anyway.",
    imageId: "style-garden",
    palette: ["#A8B273", "#E4E7CE", "#5C6B3C", "#D9C87E"],
    keywords: ["seasonal", "green", "outdoors", "unforced"],
  },
  {
    id: "coastal",
    name: "Coastal",
    tagline: "Wind is part of it. Plan for the wind.",
    description:
      "Light off the water does most of the work. The rest is logistics: shelter that doesn’t look like shelter, hair that survives the walk, and a plan B you’d be happy to use.",
    imageId: "style-coastal",
    palette: ["#96B8BD", "#E7E4DA", "#3F5459", "#D8CBB4"],
    keywords: ["open", "bright", "salt", "practical"],
  },
  {
    id: "classic",
    name: "Classic",
    tagline: "Done properly.",
    description:
      "Church or registry, receiving line, a sit-down dinner and speeches in the right order. There’s a reason the shape has lasted. Done with any care at all it never looks dated.",
    imageId: "style-classic",
    palette: ["#F1ECE1", "#2C5745", "#B6AB97", "#3A3418"],
    keywords: ["traditional", "formal", "ordered", "familiar"],
  },
  {
    id: "destination",
    name: "Destination",
    tagline: "Three days, one town, everybody staying put.",
    description:
      "Once people have flown, they’re yours for the weekend. That changes the shape of it: a Friday dinner, the wedding, a long Sunday lunch nobody wants to leave.",
    imageId: "style-destination",
    palette: ["#C9A25E", "#7A7F79", "#EFE7D6", "#4A4322"],
    keywords: ["travel", "multi-day", "hosted", "immersive"],
  },
  {
    id: "intimate",
    name: "Intimate",
    tagline: "Under forty. Everyone knows everyone by pudding.",
    description:
      "The budget stops being spread thin and starts buying things you can actually taste. One room, one table if it fits, and no seating plan negotiation that runs to three drafts.",
    imageId: "style-intimate",
    palette: ["#8A7458", "#E8DFCD", "#2E2910", "#C7A96B"],
    keywords: ["small", "close", "relaxed", "generous"],
  },
  {
    id: "black-tie",
    name: "Black tie",
    tagline: "Long dresses, short speeches, a band that can play.",
    description:
      "Formal dress does a lot of the design for you, so the room can be simple. Spend the difference on the band and the wine, in that order.",
    imageId: "style-black-tie",
    palette: ["#1F1D1A", "#EBE3A7", "#5A554A", "#F4F1E8"],
    keywords: ["formal", "evening", "dressed", "grand"],
  },
  {
    id: "cultural",
    name: "Cultural",
    tagline: "Two families, two sets of rules, one long day.",
    description:
      "Where the day carries ceremony that isn’t negotiable, the planning works backwards from those fixed points. Everything else — the food, the music, the running order — bends around them.",
    imageId: "style-cultural",
    palette: ["#B5522A", "#EFC75E", "#2C5745", "#F2E8D5"],
    keywords: ["ceremonial", "family", "layered", "vivid"],
  },
  {
    id: "minimal",
    name: "Minimal",
    tagline: "One flower. One candle. Get the food right.",
    description:
      "The hardest one to do well, because there’s nothing to hide behind. Every remaining element has to be good: the linen, the glassware, the light, the room itself.",
    imageId: "style-minimal",
    palette: ["#FAF7EE", "#DDD7CD", "#2E2910", "#9C9484"],
    keywords: ["restrained", "quiet", "precise", "pale"],
  },
];

export const styleById = Object.fromEntries(
  weddingStyles.map((style) => [style.id, style]),
) as Record<WeddingStyleId, WeddingStyle>;

export function getStyles(ids: WeddingStyleId[]) {
  return ids.map((id) => styleById[id]).filter(Boolean);
}
