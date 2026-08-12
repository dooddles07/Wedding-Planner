/**
 * Where the studio works, and when.
 *
 * This is the trust strip on the homepage. It is deliberately a working index
 * rather than a row of logos or a client count — it says something true and
 * useful, which is more convincing than a number nobody can check.
 */
export const places = [
  { region: "Suffolk", note: "Home. All year", country: "England" },
  { region: "Norfolk", note: "All year", country: "England" },
  { region: "Essex & Cambridgeshire", note: "April to October", country: "England" },
  { region: "London", note: "All year", country: "England" },
  { region: "Somerset & Dorset", note: "May to September", country: "England" },
  { region: "Northumberland", note: "June to September", country: "England" },
  { region: "Argyll & the Inner Hebrides", note: "May to September", country: "Scotland" },
  { region: "Pembrokeshire", note: "June to September", country: "Wales" },
  { region: "West Cork", note: "June to September", country: "Ireland" },
  { region: "Puglia", note: "May, June, September", country: "Italy" },
  { region: "Provence & the Luberon", note: "May to October", country: "France" },
  { region: "Mallorca", note: "May, June, September", country: "Spain" },
] as const;

export const placesIntro = {
  heading: "Twelve places we know properly",
  body: "Not a list of everywhere we’d travel. These are the regions where we know the registrar, the good florist, which lane floods, and who to ring on a Sunday. Anywhere else, we’ll say so and price the learning in.",
  note: "Suffolk and Norfolk are home. Everywhere else we work with a local producer we’ve used before.",
};
