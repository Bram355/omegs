# Omegs — Cleaning Services Website

Marketing site, service catalogue, demo authentication and demo booking flow for **Omegs**, a residential and commercial cleaning company with an upcoming iOS/Android app.

Built with React 19, Vite, TypeScript, Tailwind CSS v4, React Router and Lucide React.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — configure store URLs / demo mode
npm run dev                  # http://localhost:5173
```

| Command           | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the Vite dev server                |
| `npm run build`   | Type-check (`tsc -b`) and build to `dist/` |
| `npm run preview` | Serve the production build locally       |
| `npm run lint`    | Lint with Oxlint                         |

The app uses client-side routing, so production hosting must rewrite unknown paths to `index.html`.

## Routes

| Path | Page |
| --- | --- |
| `/` | Landing page |
| `/services` | Service directory (category filter + search) |
| `/services/:serviceId` | Service detail |
| `/about` | About Omegs |
| `/contact` | Contact form and support info |
| `/download` | Mobile app page + launch waitlist |
| `/login`, `/signup`, `/forgot-password` | Demo authentication |
| `/book` | Demo booking flow (requires demo login) |
| `/privacy`, `/terms` | Legal placeholders |
| `*` | Custom 404 |

## Project structure

```
src/
  assets/images/   optimised WebP photography (+ typed metadata)
  components/      ui/, forms/, layout/, sections/, services/, booking/
  config/site.ts   contact details, social links, app-store URLs, demo flag
  context/         auth provider
  data/            services catalogue, marketing content, navigation
  hooks/           useForm, useDisclosure, useReveal, useSeo, useAuth
  layouts/         MainLayout, AuthLayout
  lib/             validation, dates, redirects, class helpers
  pages/           route components (lazy-loaded)
  services/        auth / booking / contact service interfaces + demo implementations
  types/           shared TypeScript types
```

Content lives in `src/data` and `src/config` — edit services, FAQs, pricing notes and contact details there.

## Configuration

| Variable | Description |
| --- | --- |
| `VITE_APP_STORE_URL` | Published App Store listing. Empty = "Coming soon" placeholder. |
| `VITE_PLAY_STORE_URL` | Published Google Play listing. Empty = "Coming soon" placeholder. |
| `VITE_DEMO_MODE` | Set to `false` only once real backends are connected. |

## Demo-only features

No backend is connected. The following are clearly labelled demos:

- **Authentication** — accounts and sessions live in `localStorage`/`sessionStorage` on the visitor's device. Not secure.
- **Booking** — requests are stored in `localStorage` only; nothing is sent to Omegs.
- **Contact form / password reset / app waitlist** — validated but not delivered.
- **Testimonials** — sample content, labelled as such.
- **Pricing** — "Quote on request" placeholders, configurable per service.

Each demo implements an interface in `src/services/` (`AuthService`, `BookingService`, `ContactService`) so it can be replaced with Firebase, Supabase or a custom API without touching the UI.

## Before production launch

- Replace demo auth with a real provider (Firebase Auth, Supabase Auth, or custom API) including email verification and password reset.
- Persist bookings in a real backend with availability, confirmation and notifications.
- Connect the contact form and waitlist to an email service or CRM, with spam protection.
- Publish a reviewed Privacy Policy and Terms and Conditions (current pages are placeholders).
- Set verified App Store / Google Play URLs.
- Replace placeholder phone, email, address, hours and social links in `src/config/site.ts`.
- Replace sample testimonials with genuine, consented customer reviews; confirm pricing.
- Set `VITE_DEMO_MODE=false` and configure SPA fallback rewrites on the host.
