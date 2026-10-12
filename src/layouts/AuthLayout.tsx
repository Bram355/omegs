import { ArrowLeft, CalendarCheck, ShieldCheck, Smartphone } from 'lucide-react'
import { Suspense } from 'react'
import { Link, Outlet, ScrollRestoration } from 'react-router-dom'
import { images } from '../assets/images'
import { Logo } from '../components/brand/Logo'
import { PageLoader } from '../components/layout/PageLoader'
import { RouteFocus } from '../components/layout/RouteFocus'
import { ResponsiveImage } from '../components/ui/ResponsiveImage'
import { CURRENT_YEAR } from '../lib/date'
import { SkipLink } from './MainLayout'

const highlights = [
  { icon: CalendarCheck, text: 'Request cleanings at a time that suits you' },
  { icon: Smartphone, text: 'Manage your bookings in one place' },
  { icon: ShieldCheck, text: 'Clear service details before you book' },
]

export function AuthLayout() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <SkipLink />
      <div className="flex flex-col px-5 py-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Logo />
          <Link to="/" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-brand-900">
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to site
          </Link>
        </div>
        <main id="main-content" tabIndex={-1} className="flex flex-1 items-center justify-center py-10 outline-none">
          <div className="w-full max-w-md">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
        <p className="text-center text-xs text-slate-500">© {CURRENT_YEAR} Omegs. <Link to="/privacy" className="underline-offset-2 hover:underline">Privacy</Link> · <Link to="/terms" className="underline-offset-2 hover:underline">Terms</Link></p>
      </div>

      <aside className="relative hidden overflow-hidden bg-brand-950 lg:block" aria-label="About Omegs">
        <ResponsiveImage image={images.authLiving} alt="" sizes="50vw" className="absolute inset-0 size-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/60 to-brand-950/10" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-end p-14 xl:p-20">
          <p className="text-sm font-semibold tracking-wide text-mint-300 uppercase">Omegs</p>
          <p className="mt-3 max-w-md text-4xl leading-tight font-bold tracking-tight text-white">A Cleaner Space. A Better Day.</p>
          <ul className="mt-8 space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-brand-100">
                <span className="grid size-9 place-items-center rounded-full bg-white/10 text-mint-300 ring-1 ring-white/15">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <ScrollRestoration />
      <RouteFocus />
    </div>
  )
}
