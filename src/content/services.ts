import type { Service } from "@/types";

/**
 * What the studio actually sells.
 *
 * Fees are indicative and framed as such in the UI. `index` is the running
 * order marker the services section uses instead of 01 / 02 / 03 — these are
 * points in a wedding’s life, not a numbered list.
 */
export const services: Service[] = [
  {
    slug: "full-planning",
    name: "Full planning",
    promise: "From the first idea to the last song.",
    index: "18 months out",
    standfirst:
      "We take the whole thing. You make the decisions that matter to you and we handle everything between them.",
    description: [
      "Most couples come to us somewhere between the engagement and the first venue viewing, which is the right moment. Nothing is booked yet, so nothing has to be worked around.",
      "We start with what the day should feel like rather than what it should look like, because the second one follows from the first. Then venue, then date, then the people who make it happen — roughly in that order, and rarely in a straight line.",
      "By the last month you should be bored of us. That’s the aim: everything settled early enough that the final weeks are quiet.",
    ],
    includes: [
      "Venue search and site visits, including the ones we rule out",
      "Full design direction — light, table, flowers, paper, sound",
      "Vendor sourcing, contracts and payment schedule",
      "Budget built at the start and kept honest throughout",
      "Guest logistics, travel and accommodation",
      "Full running order and supplier schedule",
      "Rehearsal attendance",
      "Two planners on the day, from setup to carriages",
    ],
    idealFor: [
      "Couples planning around demanding jobs",
      "Weddings over 100 guests",
      "Anything abroad",
      "Anyone who’d rather not manage twelve suppliers by email",
    ],
    feeFrom: 12000,
    feeNote: "Or 12% of total spend, whichever is greater.",
    imageId: "long-table",
  },
  {
    slug: "partial-planning",
    name: "Partial planning",
    promise: "You’ve started. We’ll take it from here.",
    index: "9 months out",
    standfirst:
      "For couples who have the venue and the date and have hit the part where it stops being fun.",
    description: [
      "The venue is booked, maybe the photographer too, and then the list of remaining decisions turns out to be much longer than the list you’d already made.",
      "We pick it up from wherever you are. Sometimes that means sourcing the remaining suppliers; more often it means design, budget and the entire logistical spine of the day, which is the part nobody enjoys.",
    ],
    includes: [
      "Full review of what’s booked and what it commits you to",
      "Design direction for everything still open",
      "Remaining vendor sourcing and contracts",
      "Budget audit and forecast to the day",
      "Complete running order and supplier schedule",
      "Two planners on the day",
    ],
    idealFor: [
      "Couples 6–12 months out with the venue secured",
      "Anyone who has realised the spreadsheet isn’t going to hold",
      "Weddings where one part — usually design — needs specialist help",
    ],
    feeFrom: 6500,
    feeNote: "Scoped after a first call, once we know what’s already settled.",
    imageId: "detail-table",
  },
  {
    slug: "wedding-day-management",
    name: "Wedding-day management",
    promise: "You planned it. We’ll run it.",
    index: "6 weeks out",
    standfirst:
      "You’ve done the work. Someone else should be the one answering their phone at seven in the morning.",
    description: [
      "We come in at six weeks. You hand over every contract, every contact and every half-formed intention, and we turn it into a document that fifteen suppliers can work from.",
      "On the day, nobody asks you anything. Not the florist, not the band, not the aunt who has opinions about the seating. That’s the entire product.",
    ],
    includes: [
      "Handover meeting and full document review",
      "Supplier confirmation calls and timings",
      "Detailed running order distributed to everyone",
      "Venue walkthrough",
      "Rehearsal attendance",
      "Two planners from setup to the end of the night",
      "Kit box: pins, thread, plasters, painkillers, a lighter, spare vows",
    ],
    idealFor: [
      "Couples who enjoyed planning it and don’t want to run it",
      "Weddings at venues with no in-house coordinator",
      "Anyone whose family has been quietly volunteering to help",
    ],
    feeFrom: 2400,
    feeNote: "Fixed. Travel outside East Anglia charged at cost.",
    imageId: "detail-stationery",
  },
  {
    slug: "destination-weddings",
    name: "Destination weddings",
    promise: "A weekend, not a wedding.",
    index: "24 months out",
    standfirst:
      "Planning across borders, languages, currencies and one set of local suppliers you’ve never met.",
    description: [
      "We work regularly in Puglia, Provence, Mallorca and the Scottish islands, which is less about the scenery and more about knowing who is good and who merely has a good website.",
      "The real work in a destination wedding is guest logistics and the three days around the day itself. Get those right and the wedding takes care of itself.",
    ],
    includes: [
      "Location and venue search, with scouting trips",
      "Local supplier sourcing and contract negotiation in language",
      "Legal and civil requirements for the country",
      "Guest travel, transfers and accommodation blocks",
      "Welcome dinner and day-after plans",
      "On-site from the day before through to departure",
    ],
    idealFor: [
      "Weddings abroad of any size",
      "Multi-day celebrations",
      "Guests travelling from more than two countries",
    ],
    feeFrom: 18000,
    feeNote: "Plus travel and accommodation at cost. Scoped per location.",
    imageId: "venue-la-fontaine",
  },
  {
    slug: "design-and-styling",
    name: "Design and styling",
    promise: "The look, held together.",
    index: "12 months out",
    standfirst:
      "For couples with a planner, or a very capable venue, who need the visual side to be genuinely good.",
    description: [
      "Design is not a mood board. It’s a set of decisions about light, scale, material and colour that have to survive contact with a real room, a real budget and a real florist.",
      "We produce a scheme you can hand to any supplier and get the same answer back — drawings, palettes, sample tables, specified linen and glass, lighting plan.",
    ],
    includes: [
      "Concept development and full design scheme",
      "Table and room drawings to scale",
      "Floral brief and sourcing",
      "Linen, glass, china and furniture specification",
      "Lighting plan",
      "Stationery art direction",
      "Sample table before you commit",
      "On-site styling on the day",
    ],
    idealFor: [
      "Couples working with a venue coordinator rather than a planner",
      "Weddings where the room needs real work",
      "Anyone who has found the aesthetic decisions the hardest part",
    ],
    feeFrom: 4500,
    feeNote: "Excludes production and hire, which are quoted separately.",
    imageId: "floral-loose",
  },
  {
    slug: "venue-and-vendor-sourcing",
    name: "Venue and vendor sourcing",
    promise: "A shortlist worth its name.",
    index: "20 months out",
    standfirst:
      "The single most useful thing we do, and the cheapest. A short, specific list instead of forty open browser tabs.",
    description: [
      "Everyone starts the same way: a directory, a search, four hundred results, no way to tell which of them can actually cook.",
      "We know these venues and these suppliers because we have worked in them and with them. The list you get back is short, and every name on it is one we’d book ourselves.",
    ],
    includes: [
      "Brief-taking call",
      "Shortlist of five to eight venues with honest notes on each",
      "Availability and pricing checks",
      "Accompanied viewings, or a report if you’d rather go alone",
      "Supplier shortlists by category",
      "Contract review before you sign anything",
    ],
    idealFor: [
      "Couples at the very start",
      "Anyone who has been searching for a month and got nowhere",
      "Weddings in a region you don’t know",
    ],
    feeFrom: 1200,
    feeNote: "Credited in full against a planning fee if you go on to book us.",
    imageId: "venue-elmhurst",
  },
];

export const serviceBySlug = Object.fromEntries(
  services.map((service) => [service.slug, service]),
) as Record<string, Service>;
