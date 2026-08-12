import type { WeddingStory } from "@/types";

/**
 * Real-wedding stories.
 *
 * Sample content — the couples, venues and suppliers are invented. The shape
 * is the point: standfirst, chapters with optional margin notes and pull
 * quotes, the planner’s account of what was actually difficult, a running
 * order, a gallery and full credits.
 */
export const weddings: WeddingStory[] = [
  {
    slug: "freya-and-kwame",
    couple: "Freya & Kwame",
    title: "A September wedding at Elmhurst, planned in eleven months",
    standfirst:
      "Both of them were working six days a week. We had one free Saturday a month between February and July, and we used every one of them.",
    location: "Elmhurst House, Suffolk",
    country: "GB",
    venue: "Elmhurst House",
    date: "2025-09-13",
    season: "autumn",
    guestCount: 140,
    styleIds: ["classic", "garden"],
    heroImageId: "venue-elmhurst",
    readMinutes: 7,
    chapters: [
      {
        body: [
          "Freya rang on a Tuesday in October and said they’d like to get married the following September, that there would be about a hundred and forty people, and that neither of them had a single free evening until Christmas.",
          "That is not an unusual call. What made it workable was that they knew exactly two things — it had to be within an hour of her parents' house, and it had to be outdoors if the weather allowed. Everything else was open.",
        ],
        marginNote:
          "Two fixed points is plenty. Couples who arrive with twenty are harder to help than couples who arrive with two.",
      },
      {
        heading: "Finding the house",
        body: [
          "Elmhurst was the fourth of five we saw and the only one where the walk from the ceremony lawn to the dining room took under ninety seconds. That sounds like a small thing. It is the difference between a drinks reception that flows and one where a hundred and forty people stand in a corridor.",
          "The house itself is early Georgian, and for about eleven minutes in mid-September the stone turns a colour you cannot photograph any other time of year. We booked the fifth weekend after we saw it.",
        ],
        imageId: "venue-elmhurst",
      },
      {
        heading: "The one long table",
        body: [
          "They wanted everyone in one room and they did not want a top table. With a hundred and forty that usually means eight rounds and a lot of shouting.",
          "We measured the orangery and worked out that three long runs would seat a hundred and forty-four, with the couple in the middle of the centre run rather than at the head of anything. Nobody was more than eleven seats from them.",
        ],
        imageId: "long-table",
        pullQuote:
          "Nobody was more than eleven seats from them. That was the whole design brief, and everything else followed from it.",
      },
      {
        heading: "Flowers, eventually",
        body: [
          "The original scheme was white and green. In June the grower called to say the dahlias were three weeks ahead and there would be a great deal of deep russet and burnt orange available in the second week of September, or nothing much at all.",
          "We changed the scheme. Freya took about four minutes to decide, which is the fastest anyone has ever made that call.",
        ],
        marginNote:
          "Book the grower, not the flower. Anyone who guarantees a specific stem nine months out is guessing.",
      },
      {
        heading: "The day",
        body: [
          "It was twenty-one degrees and still. The ceremony ran four minutes late because the registrar’s car got stuck behind a combine harvester, which is the most Suffolk thing that has ever happened to one of our weddings.",
          "Speeches went before dinner, which we push for at every wedding and win about half the time. Three speeches, four minutes each, and then everyone ate a hot main course while relaxed.",
        ],
        imageId: "couple-confetti",
      },
    ],
    challenge: {
      title: "Eleven months, and one Saturday a month",
      body: "Everything had to be decided in person, in daylight, on a Saturday, because that was the only time both of them were free at once. So we front-loaded: venue, date, caterer and photographer were all locked by the end of February, which are the four bookings that actually run out. Everything after that could be settled by email at eleven at night, which is when Kwame answered emails.",
    },
    designNotes: [
      "Three long runs of table rather than rounds, no top table",
      "Deep russet and burnt orange after the dahlias came early",
      "Candles only after seven — the orangery has no good overhead light",
      "Speeches before dinner so the main course is eaten hot",
      "Linen in unbleached natural, hired; house glassware, free",
    ],
    runningOrder: [
      { time: "11:00", label: "Suppliers on site, flowers into the orangery" },
      { time: "13:30", label: "Guests arrive, drinks on the south lawn" },
      { time: "14:00", label: "Ceremony, ceremony lawn" },
      { time: "14:40", label: "Confetti, then drinks and canapés" },
      { time: "16:15", label: "Called through to dinner" },
      { time: "16:30", label: "Speeches — three, four minutes each" },
      { time: "17:00", label: "Dinner served" },
      { time: "19:45", label: "Tables cleared, band set up" },
      { time: "20:30", label: "First dance" },
      { time: "23:00", label: "Cheese and the last round" },
      { time: "00:30", label: "Carriages" },
    ],
    galleryImageIds: [
      "venue-elmhurst",
      "long-table",
      "couple-confetti",
      "detail-table",
      "floral-loose",
      "couple-walk",
      "speeches",
      "couple-dance",
    ],
    credits: [
      { role: "Planning and design", name: "Marram" },
      { role: "Venue", name: "Elmhurst House" },
      { role: "Photography", name: "Wren & Fold" },
      { role: "Flowers", name: "Sedge Field Flowers" },
      { role: "Catering", name: "Bowline Kitchen" },
      { role: "Band", name: "The Fen Six" },
      { role: "Stationery", name: "Cold Press Studio" },
    ],
  },

  {
    slug: "sofia-and-nadine",
    couple: "Sofia & Nadine",
    title: "Four days in Puglia, for sixty-two people who all had to fly",
    standfirst:
      "Once everyone has got on a plane, they are yours until Sunday. That changes what you’re planning. It stops being a wedding and becomes a weekend with a wedding in it.",
    location: "A masseria near Ostuni, Puglia",
    country: "IT",
    venue: "Masseria Torreluna",
    date: "2025-06-07",
    season: "summer",
    guestCount: 62,
    styleIds: ["destination", "intimate"],
    heroImageId: "style-destination",
    readMinutes: 8,
    chapters: [
      {
        body: [
          "Sofia is from Lisbon, Nadine from Manchester, and they live in Berlin. There was no location that would be convenient for anyone, so they stopped trying to find one and picked somewhere everyone would want to go instead.",
          "Puglia in early June: warm enough to eat outside every night, before the heat that makes a midday ceremony unkind.",
        ],
        marginNote:
          "When nowhere is convenient, convenience stops being a criterion. It’s oddly freeing.",
      },
      {
        heading: "The masseria",
        body: [
          "A fortified farmhouse with eleven rooms, four hectares of olives, and a long stone terrace facing west. We took the whole thing for five nights.",
          "Eleven rooms for sixty-two people obviously doesn’t work, so the immediate family stayed on site and everyone else took apartments in Ostuni, eight minutes away by the two minibuses we ran on a loop from six until two every night.",
        ],
        imageId: "venue-la-fontaine",
      },
      {
        heading: "Thursday, Friday, Saturday, Sunday",
        body: [
          "Thursday was arrivals and nothing scheduled, which matters more than it sounds — people land tired and want to swim, not socialise.",
          "Friday was a long dinner under the olives for everyone who had arrived. Saturday was the wedding. Sunday was lunch that started at one and finished when the last car left at six.",
          "The Friday dinner is the one we argue hardest for. By the time people sit down on Saturday they already know each other, and the room sounds completely different.",
        ],
        imageId: "long-table",
        pullQuote:
          "By Saturday they already knew each other. You can hear the difference in a room. It is not subtle.",
      },
      {
        heading: "Working in a language you don’t have",
        body: [
          "Our Italian is functional and not more than that. The florist in Ostuni has no English at all and is the best in the province.",
          "We work with a fixer in Brindisi on every Puglian wedding for exactly this reason. She reads the contracts, she makes the calls, and she knows which quote is a starting position and which one is the actual price.",
        ],
        marginNote:
          "The cost of a local fixer is recovered in the first two contracts. Every time, without exception.",
      },
      {
        heading: "The ceremony",
        body: [
          "Civil ceremony in the Ostuni town hall at six on the Saturday evening — the legal one, twenty minutes, eleven people. Then everybody back to the masseria for the ceremony that mattered to them, on the terrace, at eight, with the light going.",
          "Splitting the legal from the meaningful is standard abroad and it takes all the pressure off both.",
        ],
        imageId: "couple-coast",
      },
    ],
    challenge: {
      title: "Sixty-two people, four countries, one road",
      body: "The masseria is at the end of a single-track lane with one passing place. Sixty-two guests arriving in hire cars would have taken forty minutes and produced at least one reversing incident. We ran two minibuses on a fixed loop from Ostuni instead, published the times on their wedding site in March, and asked people not to hire cars at all. Fifty-four of them didn’t. The lane was never blocked, and nobody had to decide whether they’d had two glasses or three.",
    },
    designNotes: [
      "Nothing brought in that isn’t grown or made within thirty kilometres",
      "Terracotta, olive and unbleached linen — the building’s own palette",
      "Ceremony at eight, so the light does the work",
      "No floral centrepieces on the dinner table; fruit, bread and oil instead",
      "One string of festoons down the terrace and nothing else lit",
    ],
    runningOrder: [
      { time: "09:00", label: "Suppliers arrive, terrace cleared" },
      { time: "12:00", label: "Lunch for the wedding party in the kitchen" },
      { time: "17:40", label: "Cars to Ostuni for the civil ceremony" },
      { time: "18:00", label: "Civil ceremony, Palazzo di Città" },
      { time: "19:00", label: "Guests arrive at the masseria, drinks under the olives" },
      { time: "20:00", label: "Ceremony on the terrace" },
      { time: "20:45", label: "Aperitivo" },
      { time: "21:30", label: "Dinner, four courses, one long table" },
      { time: "23:30", label: "Music" },
      { time: "02:00", label: "Last minibus to Ostuni" },
    ],
    galleryImageIds: [
      "style-destination",
      "venue-la-fontaine",
      "long-table",
      "couple-coast",
      "detail-food",
      "couple-dusk",
      "floral-meadow",
      "couple-street",
    ],
    credits: [
      { role: "Planning and design", name: "Marram" },
      { role: "Local production", name: "Studio Brindisi" },
      { role: "Venue", name: "Masseria Torreluna" },
      { role: "Photography", name: "Alba Marchetti" },
      { role: "Flowers", name: "Fiori Ostuni" },
      { role: "Catering", name: "Cucina Torreluna" },
      { role: "Music", name: "Trio Salento" },
    ],
  },

  {
    slug: "ada-and-tom",
    couple: "Ada & Tom",
    title: "Thirty-eight people in a barn in February",
    standfirst:
      "Everyone told them small was a mistake and that February was worse. They spent the difference on the food, and people still send them messages about the lamb.",
    location: "The Thorn Barn, Norfolk",
    country: "GB",
    venue: "The Thorn Barn",
    date: "2025-02-15",
    season: "winter",
    guestCount: 38,
    styleIds: ["intimate", "minimal"],
    heroImageId: "venue-quay",
    readMinutes: 6,
    chapters: [
      {
        body: [
          "Thirty-eight was not a compromise. It was the number of people they could name who had been to their flat.",
          "February was partly budget — a barn in Norfolk costs about a third in February what it costs in July — and partly that they both hate being hot.",
        ],
      },
      {
        heading: "What a small budget buys when it isn’t spread",
        body: [
          "Their total was under twenty-five thousand, which for a hundred and twenty guests is tight and for thirty-eight is genuinely comfortable.",
          "It bought a whole hogget from a farm four miles away, cooked over fire for nine hours by a chef who does about twelve weddings a year. It bought proper glassware rather than the hire-company standard. It bought a photographer they actually wanted rather than one they could afford.",
        ],
        imageId: "detail-food",
        pullQuote:
          "Under twenty-five thousand. For a hundred and twenty guests that is tight. For thirty-eight it buys things you can taste.",
      },
      {
        heading: "Heat, light and February",
        body: [
          "A Norfolk barn in February is four degrees at nine in the morning. We had six indirect heaters running from seven, which brought it to seventeen by the time anyone arrived, and kept them running all day.",
          "It gets dark at half four. That is not a problem, it’s a gift — the entire evening happens by candlelight and you never have to fight a room full of daylight and a band.",
        ],
        imageId: "venue-thorn-barn",
        marginNote:
          "Winter weddings: budget for heat properly. It is the single most common thing people under-spend on and the only one guests notice within a minute.",
      },
      {
        heading: "One table",
        body: [
          "Thirty-eight people fit on one table, which means one conversation, one toast, and no seating plan negotiated over three drafts.",
          "There were no speeches in the formal sense. Tom’s brother stood up between courses, then Ada’s mother did, then two other people who hadn’t planned to. It ran about forty minutes and nobody looked at a phone.",
        ],
        imageId: "style-intimate",
      },
    ],
    challenge: {
      title: "Everyone else’s opinion",
      body: "The hardest part of this wedding had nothing to do with logistics. Both sets of parents thought thirty-eight was a snub to somebody, and the guest list was renegotiated four times between October and December. We ended up drawing the line as a rule rather than a list — anyone who had been to their flat — which took the decision out of the realm of who is more important and made it a fact you could check. It held.",
    },
    designNotes: [
      "One table for thirty-eight, no top table, no seating plan drama",
      "Candles only from four o’clock; no overhead light used at all",
      "Six indirect heaters from 07:00, running all day",
      "Hogget from four miles away, cooked over fire for nine hours",
      "Proper glassware instead of hire standard — about £340 of the difference",
    ],
    runningOrder: [
      { time: "07:00", label: "Heaters on" },
      { time: "10:00", label: "Fire lit, hogget on" },
      { time: "13:30", label: "Guests arrive" },
      { time: "14:00", label: "Ceremony" },
      { time: "14:30", label: "Drinks, barn doors closed" },
      { time: "16:00", label: "Candles lit" },
      { time: "16:30", label: "Dinner" },
      { time: "18:00", label: "Speeches, unplanned, about forty minutes" },
      { time: "20:00", label: "Table cleared to the sides" },
      { time: "23:30", label: "Last of it" },
    ],
    galleryImageIds: [
      "venue-thorn-barn",
      "style-intimate",
      "detail-food",
      "couple-table",
      "detail-cake",
      "couple-portrait",
      "detail-rings",
      "land-celebration",
    ],
    credits: [
      { role: "Planning", name: "Marram" },
      { role: "Venue", name: "The Thorn Barn" },
      { role: "Photography", name: "Iris Bell" },
      { role: "Fire cooking", name: "Ember & Ash" },
      { role: "Flowers", name: "Sedge Field Flowers" },
      { role: "Cake", name: "Marsh House Bakery" },
    ],
  },

  {
    slug: "marguerite-and-jo",
    couple: "Marguerite & Jo",
    title: "It rained sideways from eleven until four",
    standfirst:
      "There had been a plan for that since March. They found out about it the following week.",
    location: "Crag Path, Aldeburgh",
    country: "GB",
    venue: "The Net Shed and Crag Path",
    date: "2025-10-04",
    season: "autumn",
    guestCount: 90,
    styleIds: ["coastal", "modern"],
    heroImageId: "couple-confetti",
    readMinutes: 6,
    chapters: [
      {
        body: [
          "They wanted to get married on the shingle, in October, on the most exposed stretch of the Suffolk coast. We said yes and then went away and built two weddings.",
        ],
        marginNote:
          "A plan B that you’d be disappointed to use is not a plan B. It’s a threat.",
      },
      {
        heading: "Two weddings, one budget",
        body: [
          "The outdoor version was the ceremony on the shingle at two, drinks on the sea wall, dinner in the Net Shed.",
          "The indoor version was the ceremony in the Net Shed itself, at the far end, with the doors open to the weather. Same room, same flowers, same food, different ninety minutes.",
          "The cost of holding both was about eleven hundred pounds — the extra chairs, an extra hour of two staff, and a marquee sidewall we didn’t use.",
        ],
        imageId: "venue-crag-path",
      },
      {
        heading: "The call",
        body: [
          "We made it at eight in the morning. The forecast had been converging for three days and by Friday night there was no version of it that involved standing on shingle.",
          "Nobody was told there had been a change, because nobody outside the suppliers had been told there was a decision to make. The invitations said the Net Shed. They always had.",
        ],
        pullQuote:
          "Nobody was told there had been a change. The invitations said the Net Shed. They always had.",
      },
      {
        heading: "What the weather gave them",
        body: [
          "The doors stayed open through the ceremony with the rain going past horizontally about four feet beyond them. It was the loudest, strangest, best ceremony we have run.",
          "By six it had cleared entirely and about thirty people walked down to the water in dinner jackets and bare feet. That is not something you can plan.",
        ],
        imageId: "couple-coast",
      },
    ],
    challenge: {
      title: "Designing something you hope not to use",
      body: "The temptation with a wet-weather plan is to make it a downgrade — the same wedding, indoors, slightly sad. We built the indoor version first and treated the beach as the upgrade, which inverted the whole problem. The Net Shed ceremony was designed properly: the far wall lit, ninety chairs angled toward the open doors, flowers placed for that sightline. When we made the call at eight in the morning, we weren’t falling back on anything.",
    },
    designNotes: [
      "Indoor version designed first; the shingle treated as the upgrade",
      "Doors open throughout, whatever the weather",
      "Ninety chairs angled to the open doors, not to the wall",
      "Sea-worn timber, salt-bleached linen, nothing bright",
      "£1,100 to hold both versions to the morning of",
    ],
    runningOrder: [
      { time: "08:00", label: "Weather call — Net Shed confirmed" },
      { time: "09:00", label: "Suppliers briefed on version B" },
      { time: "13:15", label: "Guests arrive, hot drinks on arrival" },
      { time: "14:00", label: "Ceremony, doors open" },
      { time: "14:45", label: "Drinks, inside" },
      { time: "16:30", label: "Dinner" },
      { time: "18:00", label: "Speeches" },
      { time: "18:40", label: "Weather cleared; about thirty people to the water" },
      { time: "20:00", label: "Band" },
      { time: "00:00", label: "Carriages" },
    ],
    galleryImageIds: [
      "venue-crag-path",
      "couple-coast",
      "land-water",
      "detail-table",
      "couple-dusk",
      "style-coastal",
      "couple-window",
      "speeches",
    ],
    credits: [
      { role: "Planning and design", name: "Marram" },
      { role: "Venue", name: "The Net Shed, Aldeburgh" },
      { role: "Photography", name: "Wren & Fold" },
      { role: "Flowers", name: "Saltmarsh Botanics" },
      { role: "Catering", name: "Bowline Kitchen" },
      { role: "Band", name: "The Fen Six" },
    ],
  },
];

export const weddingBySlug = Object.fromEntries(
  weddings.map((wedding) => [wedding.slug, wedding]),
) as Record<string, WeddingStory>;
