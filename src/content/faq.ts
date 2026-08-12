import type { FAQ } from "@/types";

/**
 * The questions people actually ask on a first call, answered the way they’d
 * be answered on that call.
 */
export const faqs: { group: string; items: FAQ[] }[] = [
  {
    group: "Working with us",
    items: [
      {
        question: "How many weddings do you take a year?",
        answer:
          "Around forty across the whole studio, and no more than two in any weekend. It is fewer than we could take. It is the reason we can answer the phone in August.",
      },
      {
        question: "When should we get in touch?",
        answer:
          "Earlier than feels necessary. The venues and photographers worth having go twelve to eighteen months out, and the first thing we do is stop you booking the wrong one.",
      },
      {
        question: "We’ve already booked the venue. Is it too late?",
        answer:
          "No. About half our couples come to us after the venue, and it makes the brief clearer, not harder. Partial planning exists for exactly this.",
      },
      {
        question: "Do you work outside Britain?",
        answer:
          "Regularly — Puglia, Provence, Mallorca and the Scottish islands most often. We work with a local producer we’ve used before in each. Anywhere genuinely new to us, we’ll say so and price the learning in rather than pretend.",
      },
      {
        question: "Can we just hire you for the day itself?",
        answer:
          "Yes. Wedding-day management starts six weeks out. You hand over every contract and half-formed intention and we turn it into something fifteen suppliers can work from.",
      },
    ],
  },
  {
    group: "Money",
    items: [
      {
        question: "What does planning cost?",
        answer:
          "Full planning starts at £12,000 or 12% of total spend, whichever is greater. Partial from £6,500. Wedding-day management is fixed at £2,400. Sourcing alone is £1,200, credited in full if you go on to book planning.",
      },
      {
        question: "Do you take commission from suppliers?",
        answer:
          "No. If a supplier offers one we ask them to take it off your invoice instead. It is the only way our shortlist means anything.",
      },
      {
        question: "What should we budget overall?",
        answer:
          "It depends far more on guest count than on anything else — the same money spent on 40 people buys a different wedding entirely from the one it buys 140. The budget planner on this site will show you the shape of it in about a minute.",
      },
      {
        question: "When do we pay?",
        answer:
          "A third to book, a third at six months, the balance a month before. Supplier payments run on their own schedule, which we manage and you approve.",
      },
    ],
  },
  {
    group: "The day",
    items: [
      {
        question: "How many of you are there on the day?",
        answer:
          "Two, from setup to carriages, on every package including day management. One planner alone at a 140-guest wedding is a planner who cannot leave the room.",
      },
      {
        question: "What happens if it rains?",
        answer:
          "There is a plan, it was made in month two, and it is one you would be happy to use. We design the indoor version first and treat the outdoor one as the upgrade — it inverts the whole problem.",
      },
      {
        question: "Do you handle the legal side?",
        answer:
          "We handle the paperwork, the notice period and the registrar booking in Britain, and the civil requirements abroad. You still have to turn up in person.",
      },
      {
        question: "Can we do speeches before dinner?",
        answer:
          "Please do. We push for it at every wedding and win about half the time. Everybody eats a hot main course, and nobody sits through three courses being nervous.",
      },
    ],
  },
];

export const flatFaqs: FAQ[] = faqs.flatMap((group) => group.items);
