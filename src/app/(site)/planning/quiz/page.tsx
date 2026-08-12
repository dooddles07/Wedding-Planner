import type { Metadata } from "next";
import { Suspense } from "react";
import { Quiz } from "@/components/tools/Quiz";
import { Container } from "@/components/editorial/Layout";
import { quizIntro } from "@/content/quiz";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Find your wedding",
  description:
    "Ten questions, about three minutes. You get two styles, a shape for the day, the venues that suit it and the three things we’d do first. No account needed.",
  path: "/planning/quiz",
  imageKey: "style-garden",
});

export default function QuizPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Planning", path: "/planning" },
          { name: quizIntro.heading, path: "/planning/quiz" },
        ])}
      />
      <Suspense fallback={<QuizFallback />}>
        <Quiz />
      </Suspense>
    </>
  );
}

function QuizFallback() {
  return (
    <Container className="pt-32 pb-24 lg:pt-40">
      <div className="mx-auto max-w-3xl">
        <div className="h-3 w-24 animate-pulse bg-linen" />
        <div className="mt-3 h-px w-full bg-ink/15" />
        <div className="mt-14 h-16 w-3/4 animate-pulse bg-linen" />
        <div className="mt-10 grid gap-2.5 sm:grid-cols-2">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="h-16 animate-pulse border border-ink/10 bg-linen/60" />
          ))}
        </div>
      </div>
    </Container>
  );
}
