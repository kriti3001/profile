# BharosaGhar — Website Prototype

A frontend prototype for **BharosaGhar**, an Indian property rental/listing
platform positioned around trust ("Bharosa" = trust) for a Tier-2-first
market. Built as a portfolio/pitch-deck demo — all data is mocked, there is
no real backend, no real authentication, and no real property-portal
integrations.

## Stack

- [Next.js](https://nextjs.org) (App Router) + React
- [Tailwind CSS v4](https://tailwindcss.com)
- [lucide-react](https://lucide.dev) for icons
- Placeholder "photos" are deterministic colored gradients (no external image service required)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `data/` — all mock data (properties, localities, leads, portals, pricing). Swap this out for real API calls later.
- `components/` — shared UI components, including the multi-step `post-property/` wizard.
- `context/AuthContext.jsx` — mock login/session state (localStorage only, no real auth).
- `app/` — route pages: homepage, Rent/Buy/PG/Commercial listings, property detail, Post Property wizard, Dashboard, For Brokers, About.

Search the codebase for `TODO:` comments marking where real integrations
(portal publishing, ID verification, payments, a real backend) would go.

## Pages

- `/` — homepage with hero search, trust strip, localities, featured listings, testimonials
- `/rent`, `/buy`, `/pg-coliving`, `/commercial` — filterable listings with list/map toggle
- `/property/[id]` — property detail page with gallery, details, enquiry form, similar properties
- `/post-property` — the core "list once, publish everywhere" wizard
- `/dashboard` — mock owner/broker dashboard (My Listings, Leads Inbox, Sync Status, Account, Billing)
- `/for-brokers` — broker pitch + pricing
- `/about` — mission and trust positioning
