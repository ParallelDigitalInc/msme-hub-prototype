# MSME Hub — Dashboard prototype

A clickable HTML/CSS prototype of the MSME Hub dashboard. It's built from the Figma design and matches it within about a pixel at 1440px wide.

**Live:** https://paralleldigitalinc.github.io/msme-hub-prototype/

## What's in it

- The dashboard screen. It adapts to desktop widths from 1024px to 1920px+: below 1320px the sidebar becomes an icon rail, and below 1180px the BMR card moves under the Daily digest.
- The Loans screen (`loans.html`), reached from the sidebar or "Explore loan offers": safe borrowing limit, CIBIL MSME Rank, top loan matches and a borrowing summary.
- The Government Subsidies screen (`subsidies.html`), reached from the sidebar or "See schemes": benefit you can claim, refine your matches, key schemes and a grow-beyond-your-state prompt.
- Top bar: page title (it becomes a breadcrumb on sub-pages), search (⌘K), language menu, support helpline (dummy number), messages, notifications and Ask AI Mitra.
- Micro-interactions:
  - a shine around the Daily digest border on load;
  - the BMR gauge moving from 2 to 3;
  - AI question prompts that change every few seconds;
  - cards that lift on hover;
  - sidebar groups that collapse.
- Anyone whose system asks for reduced motion gets the page without these animations.

All data is sample data. Mobile layouts haven't been designed yet.

## Structure

```
index.html          dashboard screen
loans.html          Loans screen
subsidies.html      Government Subsidies screen
css/tokens.css      colours, type, shadows, radii (shared)
css/components.css  sidebar, top bar, menus, buttons, chips, orb, gauge (shared)
css/dashboard.css   styles for the dashboard only
css/finance.css     Finance Hub screens: hero card, tabs, filters, offer/scheme cards
js/app.js           menus, sidebar groups, tabs and filter chips, rotating AI questions (shared)
js/gauge.js         BMR / CMR gauge animation (shared)
js/dashboard.js     digest shine, scrollable business cards
js/loans.js         compare checkboxes, borrowing bar intro
assets/             icons and images exported from Figma
```

## Run locally

Any static file server works:

```bash
python3 -m http.server 4321
```

Then open http://localhost:4321.
