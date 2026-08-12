"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/editorial/Layout";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/tasks", label: "Tasks" },
  { href: "/dashboard/budget", label: "Budget" },
  { href: "/dashboard/guests", label: "Guests" },
  { href: "/dashboard/vendors", label: "Suppliers" },
  { href: "/dashboard/venues", label: "Venues" },
  { href: "/dashboard/inspiration", label: "Saved" },
  { href: "/dashboard/timeline", label: "Timeline" },
  { href: "/dashboard/site", label: "Your site" },
  { href: "/dashboard/settings", label: "Settings" },
];

/**
 * The second row. Scrolls horizontally on small screens rather than
 * collapsing into a menu — ten short labels are faster to thumb through than
 * they are to open a drawer for.
 */
export function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-19 z-30 border-b border-ink/12 bg-paper/98 backdrop-blur-[2px]" data-ground="paper">
      <Container>
        <nav aria-label="Dashboard" className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <ul className="flex gap-7">
            {LINKS.map((link) => {
              const active =
                link.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(link.href);

              return (
                <li key={link.href} className="shrink-0">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group/tab relative block py-4 font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors",
                      active ? "text-ink" : "text-ink-50 hover:text-ink",
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute right-0 bottom-0 left-0 h-px origin-right bg-ember transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        active
                          ? "scale-x-100"
                          : "scale-x-0 group-hover/tab:origin-left group-hover/tab:scale-x-100",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </Container>
    </div>
  );
}
