import Link from "next/link";
import { brand, demoNotice, footerMeta, footerNav, voice } from "@/content/brand";
import { Container } from "@/components/editorial/Layout";
import { Wordmark } from "./Wordmark";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="bg-ink text-paper" data-ground="ink">
      <Container className="py-20 lg:py-28">
        {/* The newsletter gets the top of the footer and a proper measure,
            rather than being squeezed into a column beside the sitemap. */}
        <div className="grid gap-10 border-b border-paper/12 pb-16 lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-end lg:gap-20">
          <div>
            <h2 className="font-display text-3xl leading-[1.15] sm:text-4xl">
              {voice.newsletter.heading}
            </h2>
            <p className="mt-4 max-w-[42ch] font-sans text-base leading-relaxed text-paper/65">
              {voice.newsletter.body}
            </p>
          </div>
          <NewsletterForm location="footer" />
        </div>

        <div className="grid gap-12 pt-16 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-10">
          <div>
            <Wordmark size="lg" />
            <p className="mt-6 max-w-[34ch] font-sans text-sm leading-[1.75] text-paper/65">
              {brand.etymology}
            </p>
            <address className="mt-8 font-mono text-[0.6875rem] leading-[2] tracking-wide text-paper/65 not-italic">
              {brand.address.street}
              <br />
              {brand.address.city} {brand.address.postcode}
              <br />
              <a href={`mailto:${brand.email}`} className="hover:text-paper">
                {brand.email}
              </a>
            </address>
          </div>

          {footerNav.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h3 className="eyebrow text-paper/60">{column.heading}</h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-paper/75 transition-colors hover:text-paper"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-paper/12 pt-8 lg:flex-row lg:items-start lg:justify-between">
          <p className="max-w-[52ch] font-mono text-[0.6875rem] leading-[1.8] tracking-wide text-paper/60">
            {demoNotice}
          </p>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 font-mono text-[0.6875rem] tracking-wide text-paper/65">
            <a
              href={brand.social.instagram}
              rel="noreferrer noopener"
              target="_blank"
              className="hover:text-paper"
            >
              Instagram
            </a>
            <a
              href={brand.social.pinterest}
              rel="noreferrer noopener"
              target="_blank"
              className="hover:text-paper"
            >
              Pinterest
            </a>
            {footerMeta.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-paper">
                {item.label}
              </Link>
            ))}
            <span className="text-paper/65">
              © {new Date().getFullYear()} {brand.name}
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
