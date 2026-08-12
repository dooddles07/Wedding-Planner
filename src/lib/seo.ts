import type { Metadata } from "next";
import { brand, voice } from "@/content/brand";
import { getPhoto, photoUrl } from "@/content/media";

const SITE = brand.url;

/**
 * One metadata builder for every page, so titles, canonicals and social cards
 * stay consistent and nothing ships with the Next.js defaults.
 */
export function pageMetadata({
  title,
  description,
  path,
  imageKey = "long-table",
  type = "website",
  publishedTime,
  noIndex,
}: {
  title: string;
  description: string;
  path: string;
  imageKey?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE}${path}`;
  const image = photoUrl(getPhoto(imageKey), { width: 1200, quality: 80 });
  const fullTitle = path === "/" ? title : `${title} — ${brand.name}`;

  return {
    // Absolute: pageMetadata already composes the studio name, so the root
    // layout’s title template must not add it a second time.
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: brand.name,
      locale: "en_GB",
      type,
      ...(publishedTime ? { publishedTime } : {}),
      images: [{ url: image, width: 1200, height: 800, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

/* -------------------------------------------------------------------------
   Structured data
   ------------------------------------------------------------------------- */

type Json = Record<string, unknown>;

export function organisationSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${SITE}#organization`,
    name: brand.name,
    description: voice.metaDescription,
    url: SITE,
    email: brand.email,
    telephone: brand.phone,
    foundingDate: String(brand.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: brand.address.street,
      addressLocality: brand.address.city,
      addressRegion: brand.address.region,
      postalCode: brand.address.postcode,
      addressCountry: brand.address.country,
    },
    areaServed: ["United Kingdom", "Europe"],
    sameAs: [brand.social.instagram, brand.social.pinterest],
  };
}

export function serviceSchema(service: {
  name: string;
  slug: string;
  promise: string;
  feeFrom: number;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.promise,
    url: `${SITE}/services/${service.slug}`,
    serviceType: "Wedding planning",
    provider: { "@id": `${SITE}#organization` },
    areaServed: ["United Kingdom", "Europe"],
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      price: service.feeFrom,
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: service.feeFrom,
        priceCurrency: "GBP",
        valueAddedTaxIncluded: false,
      },
    },
  };
}

export function articleSchema(story: {
  title: string;
  standfirst: string;
  slug: string;
  date: string;
  imageKey: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.standfirst,
    url: `${SITE}/weddings/${story.slug}`,
    datePublished: story.date,
    image: photoUrl(getPhoto(story.imageKey), { width: 1200, quality: 80 }),
    author: { "@id": `${SITE}#organization` },
    publisher: { "@id": `${SITE}#organization` },
  };
}

export function venueSchema(venue: {
  name: string;
  slug: string;
  standfirst: string;
  location: string;
  country: string;
  capacitySeated: number;
  coordinates: { lat: number; lng: number };
  imageKey: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: venue.name,
    description: venue.standfirst,
    url: `${SITE}/venues/${venue.slug}`,
    maximumAttendeeCapacity: venue.capacitySeated,
    image: photoUrl(getPhoto(venue.imageKey), { width: 1200, quality: 80 }),
    address: {
      "@type": "PostalAddress",
      addressLocality: venue.location,
      addressCountry: venue.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: venue.coordinates.lat,
      longitude: venue.coordinates.lng,
    },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE}${crumb.path}`,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
