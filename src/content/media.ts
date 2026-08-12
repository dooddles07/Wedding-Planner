import type { Photograph } from "@/types";

/**
 * The photography register.
 *
 * Every image on the site is referenced by key, never by URL. A key names the
 * *role* an image plays — "first-light" is the 05:40 hero plate — and the alt
 * text describes what is actually in the frame. The two were checked against a
 * rendered contact sheet that pairs each key with its photograph side by side,
 * rather than assumed from the id.
 *
 * Source: Unsplash, served from images.unsplash.com through next/image. Every
 * id has been verified to resolve. The Unsplash Licence permits commercial use
 * and modification without attribution; a CDN id alone does not identify the
 * photographer, so rather than invent names each entry credits Unsplash. With
 * an Unsplash API key you can backfill `credit` and `creditUrl` per photograph
 * from /photos/:id — the shape is already right.
 *
 * `tone` is the dominant colour, painted under the image and used as the blur
 * placeholder, so the page never flashes grey.
 */

const UNSPLASH = "https://unsplash.com";

function photo(
  id: string,
  unsplashId: string,
  alt: string,
  tone: string,
  aspect: Photograph["aspect"],
): Photograph {
  return { id, unsplashId, alt, tone, aspect, credit: "Unsplash", creditUrl: UNSPLASH };
}

const register = [
  /* --- The day, in order ------------------------------------------------ */
  photo(
    "first-light",
    "1519225421980-715cb0215aed",
    "A long table laid with white linen and loose flowers, outdoors, before anyone has sat down",
    "#4a4433",
    "landscape",
  ),
  photo(
    "house-waking",
    "1505691938895-1758d7feb511",
    "A sitting room in the morning, cushions untouched, nobody in it yet",
    "#c9bda9",
    "landscape",
  ),
  photo(
    "getting-ready",
    "1594552072238-b8a33785b261",
    "A wedding dress laid out across a bed in a pale room",
    "#d8cfc2",
    "portrait",
  ),
  photo(
    "the-ceremony",
    "1523438885200-e635ba2c371e",
    "A flower-covered arch with white chairs set out beneath it",
    "#a89376",
    "landscape",
  ),
  photo(
    "golden-hour",
    "1500375592092-40eb2168fd21",
    "A wave breaking under a sky gone pink and amber",
    "#c98f4a",
    "landscape",
  ),
  photo(
    "long-table",
    "1414235077428-338989a2e8c0",
    "A table mid-dinner — wine, candles and a plated course, close in",
    "#6d5540",
    "landscape",
  ),
  photo(
    "speeches",
    "1583939003579-730e3918a45a",
    "A wedding party outside in confetti, everyone mid-laugh",
    "#a49a86",
    "landscape",
  ),
  photo(
    "last-dance",
    "1600585154340-be6161a56a0c",
    "A house at night with the lights on inside and a tree across the front",
    "#241f18",
    "landscape",
  ),

  /* --- Styles ------------------------------------------------------------ */
  photo(
    "style-modern",
    "1600607687939-ce8a6c25118c",
    "An open-plan room with clean lines and almost nothing in it",
    "#d5cec4",
    "portrait",
  ),
  photo(
    "style-romantic",
    "1487070183336-b863922373d4",
    "A florist’s shopfront, buckets of loose flowers out on the pavement",
    "#c8a99a",
    "portrait",
  ),
  photo(
    "style-garden",
    "1465146344425-f00d5f5c8f07",
    "Poppies and long grasses in a meadow under a pale sky",
    "#a3a878",
    "portrait",
  ),
  photo(
    "style-coastal",
    "1507525428034-b723cf961d3e",
    "Clear shallow water meeting white sand at the end of the day",
    "#96b8bd",
    "portrait",
  ),
  photo(
    "style-classic",
    "1519167758481-83f550bb49b3",
    "A grand room laid with round tables under chandeliers, before anyone arrives",
    "#8a7f6b",
    "portrait",
  ),
  photo(
    "style-destination",
    "1470071459604-3b5ec3a7fe05",
    "Green hills falling away to a valley at dusk",
    "#7a7f79",
    "portrait",
  ),
  photo(
    "style-intimate",
    "1467003909585-2f8a72700288",
    "A single plated course on a laid table, photographed close",
    "#8a7458",
    "portrait",
  ),
  photo(
    "style-black-tie",
    "1594938298603-c8148c4dae35",
    "A three-piece suit photographed close, no face in frame",
    "#5b6377",
    "portrait",
  ),
  photo(
    "style-cultural",
    "1492684223066-81342ee5ff30",
    "Confetti falling over a crowd under stage light",
    "#6a5a8c",
    "portrait",
  ),
  photo(
    "style-minimal",
    "1533090161767-e6ffed986c88",
    "A white wall with a clock, a lamp and one small plant",
    "#ddd7cd",
    "portrait",
  ),

  /* --- Venues ------------------------------------------------------------ */
  photo(
    "venue-elmhurst",
    "1464146072230-91cabc968266",
    "A stone country house reflected in still water, trees behind it",
    "#8a8a72",
    "landscape",
  ),
  photo(
    "venue-thorn-barn",
    "1513694203232-719a280e022f",
    "A pale room with dried grasses, a low sofa and a plain chest of drawers",
    "#c7bda9",
    "landscape",
  ),
  photo(
    "venue-crag-path",
    "1476514525535-07fb3b4ae5f1",
    "The bow of a wooden boat on flat water, hills beyond",
    "#7d8a8f",
    "landscape",
  ),
  photo(
    "venue-la-fontaine",
    "1512917774080-9991f1c4c750",
    "A low white villa beside a pool in hard southern light",
    "#b6ab97",
    "landscape",
  ),
  photo(
    "venue-castello",
    "1506905925346-21bda4d32df4",
    "Snow peaks standing above a sea of cloud at dusk",
    "#7d8a8f",
    "landscape",
  ),
  photo(
    "venue-glasshouse",
    "1523217582562-09d0def993a6",
    "A white building with hard shadow cut across its face",
    "#cfc7bb",
    "landscape",
  ),
  photo(
    "venue-quay",
    "1505873242700-f289a29e1e0f",
    "A warm room with exposed brick, low seating and hanging lights",
    "#6d5540",
    "landscape",
  ),
  photo(
    "venue-hollow",
    "1447752875215-b2761acb3c5d",
    "A boardwalk running into woodland with light coming through high branches",
    "#5f7050",
    "landscape",
  ),
  photo(
    "venue-lake",
    "1449057528837-7ca097b3520c",
    "A still lake below mountains early in the day",
    "#7f7a6c",
    "landscape",
  ),
  photo(
    "venue-dock",
    "1439066615861-d1af74d74000",
    "A wooden dock reaching out into a calm lake",
    "#6b7a6a",
    "landscape",
  ),

  /* --- Detail ------------------------------------------------------------ */
  photo(
    "detail-table",
    "1519225421980-715cb0215aed",
    "A place setting on a long table, loose flowers down the middle",
    "#4a4433",
    "landscape",
  ),
  photo(
    "detail-stationery",
    "1544716278-ca5e3f4abd8c",
    "An open notebook, a cup and a pair of glasses on white linen",
    "#d3c9b7",
    "square",
  ),
  photo(
    "detail-paper",
    "1544716278-ca5e3f4abd8c",
    "An open notebook on a plain pale surface",
    "#d3c9b7",
    "square",
  ),
  photo(
    "detail-invitations",
    "1544716278-ca5e3f4abd8c",
    "Paper laid out on a plain pale surface",
    "#d3c9b7",
    "square",
  ),
  photo(
    "detail-rings",
    "1520854221256-17451cc331bf",
    "Two hands held, a lace sleeve and a suit cuff",
    "#8f9a74",
    "square",
  ),
  photo(
    "detail-jewellery",
    "1515562141207-7a88fb7ce338",
    "A string of pearls resting in an open box",
    "#c4b096",
    "square",
  ),
  photo(
    "detail-jewellery-two",
    "1605100804763-247f67b3557e",
    "A single ring photographed close against a dark ground",
    "#5a5044",
    "square",
  ),
  photo(
    "detail-cake",
    "1535254973040-607b474cb50d",
    "A tiered cake dressed with garden roses",
    "#e0d3c8",
    "portrait",
  ),
  photo(
    "detail-food",
    "1467003909585-2f8a72700288",
    "A plated course set down on a laid table",
    "#8a7458",
    "landscape",
  ),
  photo(
    "detail-food-two",
    "1555939594-58d7cb561ad1",
    "Grilled meat and vegetables on a board, photographed from above",
    "#8a6f52",
    "square",
  ),
  photo(
    "detail-toast",
    "1414235077428-338989a2e8c0",
    "Wine poured and candles lit at a laid table",
    "#6d5540",
    "landscape",
  ),

  /* --- Florals ----------------------------------------------------------- */
  photo(
    "floral-loose",
    "1487070183336-b863922373d4",
    "Buckets of loose garden flowers outside a florist",
    "#c8a99a",
    "portrait",
  ),
  photo(
    "floral-branch",
    "1522748906645-95d8adfd52c7",
    "Blossom against a pale sky",
    "#cdbfb4",
    "portrait",
  ),
  photo(
    "floral-meadow",
    "1465146344425-f00d5f5c8f07",
    "Poppies and grasses photographed close in",
    "#a3a878",
    "landscape",
  ),
  photo(
    "floral-field",
    "1490750967868-88aa4486c946",
    "Yellow poppies against a clear blue sky",
    "#b6a94a",
    "landscape",
  ),
  photo(
    "floral-single",
    "1465495976277-4387d4b0b4c6",
    "Two hands resting on a bouquet, rings showing",
    "#a99a86",
    "square",
  ),

  /* --- Couples and people ------------------------------------------------ */
  photo(
    "couple-field",
    "1591604466107-ec97de577aff",
    "A couple beside water in autumn light",
    "#c3a271",
    "landscape",
  ),
  photo(
    "couple-ceremony",
    "1511285560929-80b456fea0bc",
    "A couple at the front of a ceremony with guests gathered behind",
    "#a08f78",
    "landscape",
  ),
  photo(
    "couple-portrait",
    "1481653125770-b78c206c59d4",
    "A couple close together, lace sleeve and dark suit, no faces to camera",
    "#5a5148",
    "portrait",
  ),
  photo(
    "couple-doorway",
    "1583939003579-730e3918a45a",
    "A wedding party outside in confetti, mid-laugh",
    "#a49a86",
    "portrait",
  ),
  photo(
    "couple-walk",
    "1606216794074-735e91aa2c92",
    "Two people walking together, laughing, trees behind",
    "#5f6b4e",
    "landscape",
  ),
  photo(
    "couple-quiet",
    "1550005809-91ad75fb315f",
    "Holding a bouquet, waiting, before it starts",
    "#c2b3a1",
    "portrait",
  ),
  photo(
    "couple-confetti",
    "1460978812857-470ed1c77af0",
    "Black and white, a veil caught by the wind",
    "#9a9490",
    "landscape",
  ),
  photo(
    "couple-dusk",
    "1470071459604-3b5ec3a7fe05",
    "A valley at dusk with the light nearly gone",
    "#5a5645",
    "landscape",
  ),
  photo(
    "couple-coast",
    "1507525428034-b723cf961d3e",
    "The tide coming in over pale sand at the end of the day",
    "#96b8bd",
    "landscape",
  ),
  photo(
    "couple-street",
    "1478146896981-b80fe463b330",
    "A figure in a white dress on an open road with hills behind",
    "#9d8f7c",
    "portrait",
  ),
  photo(
    "couple-table",
    "1414235077428-338989a2e8c0",
    "A table mid-service, candles lit",
    "#6d5540",
    "landscape",
  ),
  photo(
    "couple-dance",
    "1502082553048-f009c37129b9",
    "Hands over a set of decks in low, coloured light",
    "#4a2d55",
    "landscape",
  ),
  photo(
    "couple-garden",
    "1522673607200-164d1b6ce486",
    "Two chairs set out on a lawn with flowers tied to the backs",
    "#8f9a74",
    "portrait",
  ),
  photo(
    "couple-window",
    "1519741497674-611481863552",
    "Someone holding a bouquet in warm backlight",
    "#9c8b78",
    "portrait",
  ),

  /* --- Vendors ----------------------------------------------------------- */
  photo(
    "vendor-photography",
    "1460978812857-470ed1c77af0",
    "A black-and-white frame of a veil caught by the wind",
    "#9a9490",
    "landscape",
  ),
  photo(
    "vendor-music",
    "1502082553048-f009c37129b9",
    "Hands over a set of decks in low, coloured light",
    "#4a2d55",
    "landscape",
  ),
  photo(
    "vendor-dj",
    "1492684223066-81342ee5ff30",
    "Confetti falling over a crowd under stage light",
    "#6a5a8c",
    "landscape",
  ),
  photo(
    "vendor-beauty",
    "1515562141207-7a88fb7ce338",
    "A string of pearls resting in an open box",
    "#c4b096",
    "landscape",
  ),
  photo(
    "vendor-transport",
    "1439066615861-d1af74d74000",
    "A wooden dock reaching out into a calm lake",
    "#6b7a6a",
    "landscape",
  ),
  photo(
    "vendor-dress",
    "1594552072238-b8a33785b261",
    "A wedding dress laid out across a bed in a pale room",
    "#d8cfc2",
    "portrait",
  ),
  photo(
    "vendor-suit",
    "1594938298603-c8148c4dae35",
    "A three-piece suit photographed close, no face in frame",
    "#5b6377",
    "portrait",
  ),

  /* --- Landscape and atmosphere ------------------------------------------ */
  photo(
    "land-forest",
    "1441974231531-c6227db76b6e",
    "A path through tall trees, light on the far side",
    "#54654a",
    "portrait",
  ),
  photo(
    "land-light",
    "1518495973542-4542c06a5843",
    "Sun coming through the branches of a big tree",
    "#a3a95c",
    "landscape",
  ),
  photo(
    "land-water",
    "1476514525535-07fb3b4ae5f1",
    "The bow of a wooden boat on flat water",
    "#7d8a8f",
    "landscape",
  ),
  photo(
    "land-interior",
    "1600585154340-be6161a56a0c",
    "A house at night with the lights on inside",
    "#241f18",
    "landscape",
  ),
  photo(
    "land-celebration",
    "1492684223066-81342ee5ff30",
    "Confetti in the air over a crowd",
    "#6a5a8c",
    "landscape",
  ),
  photo(
    "land-tree",
    "1470225620780-dba8ba36b745",
    "A single large tree standing alone in a field",
    "#7f8a6c",
    "landscape",
  ),
] as const satisfies readonly Photograph[];

export const photographs: Record<string, Photograph> = Object.fromEntries(
  register.map((p) => [p.id, p]),
);

export type PhotoKey = (typeof register)[number]["id"];

export const photoKeys = register.map((p) => p.id) as PhotoKey[];

/** Falls back rather than throwing — a bad key should never take a page down. */
export function getPhoto(key: string): Photograph {
  return photographs[key] ?? photographs["first-light"];
}

/**
 * Unsplash applies the crop and resize at the CDN, so next/image only has to
 * choose a width.
 */
export function photoUrl(
  photo: Photograph,
  { width = 1600, quality = 72 }: { width?: number; quality?: number } = {},
) {
  const crop = { portrait: "3:4", landscape: "3:2", square: "1:1", tall: "2:3" }[
    photo.aspect
  ];
  return `https://images.unsplash.com/photo-${photo.unsplashId}?auto=format&fit=crop&ar=${crop}&w=${width}&q=${quality}`;
}

/** A 4x4 of the dominant tone. Cheaper than a real LQIP and never wrong. */
export function tonePlaceholder(tone: string) {
  const hex = tone.replace("#", "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="%23${hex}"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}
