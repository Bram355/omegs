import { Bell, CalendarDays, ChevronRight, Clock, Home, MapPin, Sparkles, Sofa, Building2, User, ListChecks } from 'lucide-react'
import { cn } from '../../lib/cn'
import { LogoMark } from '../brand/Logo'

/** Illustrative Omegs app interface built in markup (not a screenshot of a live app). */
export function PhoneMockup({ className }: { className?: string }) {
  return (
    <div className={cn('relative mx-auto w-[280px] sm:w-[300px]', className)} role="img" aria-label="Preview of the Omegs mobile app home screen showing an upcoming booking and service shortcuts">
      <div className="relative rounded-[3rem] bg-brand-950 p-3 shadow-[0_40px_80px_-20px_rgb(6_28_33/0.55)] ring-1 ring-white/10">
        <div className="absolute top-3 left-1/2 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-brand-950" aria-hidden="true" />
        <div className="relative overflow-hidden rounded-[2.4rem] bg-surface" aria-hidden="true">
          {/* status bar */}
          <div className="flex items-center justify-between px-7 pt-3.5 pb-2 text-[10px] font-semibold text-brand-950">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-3.5 rounded-sm bg-brand-950" />
            </span>
          </div>

          {/* header */}
          <div className="bg-brand-900 px-5 pt-3 pb-14 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LogoMark tone="light" className="size-7" />
                <span className="text-sm font-bold tracking-tight">omegs</span>
              </div>
              <span className="grid size-8 place-items-center rounded-full bg-white/10">
                <Bell className="size-4" />
              </span>
            </div>
            <p className="mt-5 text-xs text-brand-200">Welcome back</p>
            <p className="text-lg leading-snug font-bold">Ready for a fresh space?</p>
          </div>

          {/* upcoming booking */}
          <div className="-mt-10 px-4">
            <div className="rounded-2xl bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">Upcoming</span>
                <span className="rounded-full bg-mint-100 px-2 py-0.5 text-[10px] font-semibold text-mint-700">Scheduled</span>
              </div>
              <div className="mt-2.5 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-800">
                  <Sparkles className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-950">Deep Cleaning</p>
                  <p className="flex items-center gap-1 text-[11px] text-slate-500">
                    <CalendarDays className="size-3" /> Sat · <Clock className="size-3" /> Morning
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
                <MapPin className="size-3" /> Home · Apartment
                <span className="ml-auto flex items-center font-semibold text-brand-800">
                  Manage <ChevronRight className="size-3" />
                </span>
              </div>
            </div>
          </div>

          {/* services */}
          <div className="px-4 pt-5">
            <p className="text-xs font-semibold text-brand-950">Book a service</p>
            <div className="mt-2.5 grid grid-cols-4 gap-2">
              {[
                { icon: Home, label: 'Home' },
                { icon: Sparkles, label: 'Deep' },
                { icon: Building2, label: 'Office' },
                { icon: Sofa, label: 'Sofa' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl bg-white py-2.5 shadow-xs">
                  <Icon className="size-4 text-brand-800" />
                  <span className="text-[10px] font-medium text-slate-600">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex h-10 items-center justify-center rounded-full bg-mint-300 text-xs font-semibold text-brand-950">
              Book a Cleaning
            </div>
          </div>

          {/* tab bar */}
          <div className="mt-5 flex items-center justify-around border-t border-slate-200 bg-white px-4 pt-2.5 pb-5 text-[9px] font-medium text-slate-400">
            <span className="flex flex-col items-center gap-1 text-brand-900">
              <Home className="size-4" />
              Home
            </span>
            <span className="flex flex-col items-center gap-1">
              <ListChecks className="size-4" />
              Bookings
            </span>
            <span className="flex flex-col items-center gap-1">
              <User className="size-4" />
              Account
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
