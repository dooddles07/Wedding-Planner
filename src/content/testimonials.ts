import type { Testimonial } from "@/types";

/**
 * Sample testimonials.
 *
 * Every entry carries `demo: true` and the UI says so where they appear. They
 * are written to show the shape and tone of a real one — replace them with
 * actual quotes and the components need no changes.
 */
export const testimonials: Testimonial[] = [
  {
    id: "hallam-osei",
    couple: "Freya & Kwame",
    location: "Elmhurst House, Suffolk",
    weddingType: "140 guests, September",
    quote:
      "We had eleven months and both of us were working six days a week. I don’t remember making most of the decisions, which sounds bad and was in fact the entire point.",
    imageId: "couple-doorway",
    demo: true,
  },
  {
    id: "ferreira-lund",
    couple: "Sofia & Nadine",
    location: "Masseria near Ostuni, Puglia",
    weddingType: "62 guests, June",
    quote:
      "The thing nobody tells you about getting married abroad is that your guests become your responsibility for four days. Marram planned the four days. The wedding was almost the easy bit.",
    imageId: "couple-coast",
    demo: true,
  },
  {
    id: "okonjo-price",
    couple: "Ada & Tom",
    location: "The Thorn Barn, Norfolk",
    weddingType: "38 guests, February",
    quote:
      "We wanted it small and everyone kept telling us small was a mistake. It was not a mistake. We spent the money on the food and I still get texts about the lamb.",
    imageId: "couple-table",
    demo: true,
  },
  {
    id: "reid-castellane",
    couple: "Marguerite & Jo",
    location: "Crag Path, Aldeburgh",
    weddingType: "90 guests, October",
    quote:
      "It rained sideways from eleven until four. We found out afterwards there had been a plan for that since March.",
    imageId: "couple-confetti",
    demo: true,
  },
];
