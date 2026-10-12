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

## Backend (Supabase) and payments

Everything server-side lives in `supabase/`:

- `migrations/20261012000000_init.sql`: tables (`profiles`, `bookings`, `contact_messages`, `app_waitlist`, `app_settings`), row level security, the server-enforced price, and owner/admin role assignment (the `admin_email` in `app_settings` becomes admin on signup).
- `functions/notify`: emails the owner (via Resend) about new bookings and contact messages.
- `functions/paystack-init`, `paystack-verify`, `paystack-webhook`: card checkout through Paystack.

Required function secrets: `RESEND_API_KEY`, `PAYSTACK_SECRET_KEY`. `EMAIL_FROM` is optional and needs a verified Resend domain before customers get emails.

```bash
npx supabase link --project-ref <ref>
npx supabase db push
npx supabase secrets set RESEND_API_KEY=... PAYSTACK_SECRET_KEY=...
npx supabase functions deploy notify paystack-init paystack-verify
npx supabase functions deploy paystack-webhook --no-verify-jwt
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for the website. When both are set, demo mode turns off automatically. The owner dashboard is at `/admin`.

## Mobile app (Expo)

`mobile/` is an Expo Router app for iOS and Android. It uses the same Supabase backend and service catalogue.

```bash
cd mobile && npm install
cp .env.example .env.local      # EXPO_PUBLIC_SUPABASE_URL / _ANON_KEY
npx expo start                  # scan the QR code with Expo Go
npx eas-cli build -p android --profile preview   # shareable APK
```

After editing `src/data/services.ts`, run `node scripts/export-mobile-data.mjs` so the app picks up the changes.
