/**
 * Central, configurable site settings.
 * Values marked as placeholders must be replaced with verified details before launch.
 * App-store URLs can be provided through environment variables (see .env.example).
 */

const env = import.meta.env

export interface StoreLink {
  label: string
  url: string | null
  /** True until a real, published store listing URL is configured. */
  isPlaceholder: boolean
}

const appStoreUrl = env.VITE_APP_STORE_URL?.trim() || null
const playStoreUrl = env.VITE_PLAY_STORE_URL?.trim() || null

export const siteConfig = {
  name: 'Omegs',
  tagline: 'A Cleaner Space. A Better Day.',
  description:
    'Omegs offers professional residential and commercial cleaning services, with simple booking and service management through the Omegs mobile app.',
  contact: {
    phone: '+254 701 254 244',
    phoneHref: 'tel:+254701254244',
    email: 'bramkirimi@gmail.com',
    supportEmail: 'bramkirimi@gmail.com',
    // Placeholder — replace once a business address is confirmed.
    address: 'Business address to be confirmed',
    hours: 'Open 24 hours, 7 days a week',
  },
  social: [
    // Set `url` to a real profile link to activate each icon.
    { platform: 'instagram', label: 'Instagram', url: null as string | null },
    { platform: 'facebook', label: 'Facebook', url: null as string | null },
    { platform: 'x', label: 'X (Twitter)', url: null as string | null },
    { platform: 'linkedin', label: 'LinkedIn', url: null as string | null },
  ],
  appStores: {
    ios: { label: 'App Store', url: appStoreUrl, isPlaceholder: !appStoreUrl } satisfies StoreLink,
    android: { label: 'Google Play', url: playStoreUrl, isPlaceholder: !playStoreUrl } satisfies StoreLink,
  },
  /** Shows the "demo mode" notices on auth, booking, and contact flows. */
  demoMode: env.VITE_DEMO_MODE !== 'false',
} as const

export type SocialPlatform = (typeof siteConfig.social)[number]['platform']
