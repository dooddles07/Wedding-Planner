import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { WhereWeWork } from "@/components/home/WhereWeWork";
import { Styles } from "@/components/home/Styles";
import { QuizTeaser } from "@/components/home/QuizTeaser";
import { Stories } from "@/components/home/Stories";
import { GoldenHour } from "@/components/home/GoldenHour";
import { Services } from "@/components/home/Services";
import { BudgetTeaser } from "@/components/home/BudgetTeaser";
import { Voices } from "@/components/home/Voices";
import { Closing } from "@/components/home/Closing";
import { brand, voice } from "@/content/brand";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `${brand.name} — ${brand.discipline}, ${brand.address.city}`,
  description: voice.metaDescription,
  path: "/",
  imageKey: "long-table",
});

/**
 * The homepage runs as a single day, first light to last dance, and the light
 * on the page changes as it goes: ink, paper, forest, champagne, ink. Each
 * chapter carries the hour it belongs to in the margin.
 *
 * The two interactive sections — the quiz opener and the budget slice — sit
 * between the loud ones deliberately. They are the quiet beats.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <WhereWeWork />
      <Styles />
      <QuizTeaser />
      <Stories />
      <GoldenHour />
      <Services />
      <BudgetTeaser />
      <Voices />
      <Closing />
    </>
  );
}
