# Changelog

Format loosely follows [Keep a Changelog](https://keepachangelog.com/).
Grouped by milestone rather than by individual commit — see `git log` for
the full commit-level history. Version has stayed `0.1.0`
(`package.json`) throughout; nothing below has been tagged as a release.

## 2026-08-14 — Security & production hardening

**Full-project audit, round two** (`ddee9e5`) — 20 zero-cost fixes across
four tiers:
- **P0 (data-loss / account-takeover)**: a failed `user-state` read now
  throws instead of resolving `null` and hydrating the store to defaults;
  anonymous→account data migration is awaited before the first
  server-backed read; a published wedding site is never claimable
  regardless of owner-account state.
- **P1 (abuse vectors / broken core flows)**: rate limiting now keys off
  `x-vercel-forwarded-for`/`x-real-ip` instead of spoofable `X-Forwarded-For`;
  `publish-site` gained the rate limit every other write route already had;
  publish/unpublish now await and check the server response instead of
  firing-and-forgetting; budget rebuilds only override allocations the
  couple explicitly changed; the quiz's last answer is no longer dropped by
  a stale closure; RSVP requires the target site to be published and
  RSVP-enabled; an inspiration-gallery lint violation (setState-in-effect)
  fixed by syncing query state from the URL during render.
- **P2 (robustness)**: `user-state` PUT keys are now allowlisted; unknown/
  stale template ids fall back to a known skin instead of throwing; the
  `user-state` route returns 500 (not 400) on DB failure so the client
  surfaces a real save error; a site's slug freezes on first-ever publish,
  not just while currently published; guest-count input guards against
  `NaN`; wedding dates parse consistently across timezones; newsletter form
  ids no longer collide across multiple instances on one page.
- **P3 (cleanup)**: JSON-LD defensively escapes `<`; email templates strip
  CR/LF from subject-line inputs; dead `recharts` config entry removed;
  schedule rows keyed by stable id; short-TTL session cache added to cut
  redundant `/api/auth/session` calls.

**P2 hardening cleanup** (`a0913d2`) and **stored XSS / email HTML
injection fixes** (`0667daa`): registry links restricted to `http(s)` URLs
(no `javascript:`), outbound email bodies HTML-escape user input, the
published-site payload is validated and stored parsed (not raw), a
Content-Security-Policy and related security headers were added
(`next.config.ts`), and the post-login redirect (`next`) is restricted to
same-site relative paths.

**Backend security / API hardening** (`b6bb39d`): first pass at rate
limiting, ownership checks, and Zod validation across the write routes
introduced the previous day.

Also this day: guest-count validation on the lead form, quiz result
capitalization fix, dashboard budget lead-form leak + republish slug growth
fix, plain-language dashboard copy pass, `data-scroll-behavior` warning
silenced, RSVP form label association, branded failed-sign-in redirect,
mobile filter-sheet focus trapping, stale privacy copy fixed, two React
Hooks violations fixed (`/dashboard/site` crash, `/dashboard/inspiration`
infinite loop), `NEXT_PUBLIC_SITE_URL` trailing-slash strip, session
callback guarded against an undefined token.

## 2026-08-13 — Backend integration

The frontend (built 08-12) was frozen and a real backend wired in behind
its existing seams (see `docs/backend-integration.md` for the original
handoff spec those seams describe):
- Full auth, database persistence, and email wired end-to-end
  (`97473eb`–`e05c3d0`).
- **Provider swap**: started on Supabase (`68d45cd`, "Wire full Supabase +
  Resend backend"), then replaced with **Neon + Drizzle + NextAuth**
  (`1222ca3`) — the stack this app now runs on.
- Resend sandbox sender used until the studio's own sending domain is
  verified.
- Three tiers of frontend bugs found against the original static build
  fixed in one pass each: 5 ship-blockers (`ff25e5a`), 5 integration
  blockers (`fdcb78e`), 5 cleanup items (`049dedb`) — see
  `audit/v1-2026-08-13-*.md` for the full list.
- Backend design spec added (`dfc29b6`, later superseded by the actual
  Neon/Drizzle/NextAuth implementation).

## 2026-08-12 — Initial build

Frontend-only demo: static content (`src/content/*`), all client state in
`localStorage`, no authentication, `/api/lead` a logging-only stub. Photo
register diversified, budget chart moved to the brand palette, mobile
overflow and focus-ring visibility fixed, page-gutter layout finalized.

## 2026-08-12 — `a5c6809` Initial commit
