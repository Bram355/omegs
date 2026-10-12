import { CalendarPlus, ChevronDown, LogOut, Menu, X, ListChecks, LayoutGrid } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { primaryNav, serviceNav } from '../../data/navigation'
import { useAuth } from '../../hooks/useAuth'
import { useDisclosure } from '../../hooks/useDisclosure'
import { cn } from '../../lib/cn'
import { Logo } from '../brand/Logo'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors',
    isActive ? 'bg-brand-50 text-brand-900' : 'text-slate-600 hover:bg-slate-100 hover:text-brand-900',
  )

function ServicesMenu() {
  const { pathname } = useLocation()
  const { isOpen, close, toggle, containerRef, triggerRef, panelRef, onTriggerKeyDown, onPanelKeyDown, onContainerBlur } = useDisclosure()
  const isActive = pathname.startsWith('/services')

  return (
    <div ref={containerRef} className="relative" onBlur={onContainerBlur}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="services-menu"
        onClick={toggle}
        onKeyDown={onTriggerKeyDown}
        className={cn(navLinkClass({ isActive: isActive || isOpen }), 'inline-flex items-center gap-1')}
      >
        Services
        <ChevronDown className={cn('size-4 transition-transform duration-200', isOpen && 'rotate-180')} aria-hidden="true" />
      </button>
      <div
        ref={panelRef}
        id="services-menu"
        onKeyDown={onPanelKeyDown}
        className={cn(
          'absolute top-full left-1/2 mt-3 w-[min(640px,90vw)] -translate-x-1/2 rounded-3xl border border-slate-200 bg-white p-3 shadow-lift transition-all duration-200',
          isOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0',
        )}
      >
        <ul className="grid gap-1 sm:grid-cols-2">
          {serviceNav.map(({ label, to, description, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                onClick={close}
                className="flex gap-3 rounded-2xl p-3 transition-colors hover:bg-surface focus-visible:bg-surface"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-mint-100 text-mint-700">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-brand-950">{label}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/services"
          onClick={close}
          className="mt-2 flex items-center justify-between rounded-2xl bg-brand-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
        >
          <span className="flex items-center gap-2">
            <LayoutGrid className="size-4" aria-hidden="true" /> View all services
          </span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  )
}

function UserMenu() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { isOpen, close, toggle, containerRef, triggerRef, panelRef, onTriggerKeyDown, onPanelKeyDown, onContainerBlur } = useDisclosure()
  if (!user) return null
  const initials = user.fullName.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div ref={containerRef} className="relative" onBlur={onContainerBlur}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="user-menu"
        onClick={toggle}
        onKeyDown={onTriggerKeyDown}
        className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors hover:bg-slate-100"
      >
        <span className="grid size-8 place-items-center rounded-full bg-mint-200 text-xs font-bold text-brand-900">{initials}</span>
        <span className="sr-only">Account menu for</span>
        <span className="max-w-28 truncate text-sm font-medium text-brand-950">{user.fullName.split(' ')[0]}</span>
        <ChevronDown className="size-4 text-slate-500" aria-hidden="true" />
      </button>
      <div
        ref={panelRef}
        id="user-menu"
        onKeyDown={onPanelKeyDown}
        className={cn(
          'absolute top-full right-0 mt-3 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-lift transition-all duration-200',
          isOpen ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <p className="truncate px-3 pt-2 pb-3 text-xs text-slate-500">
          Signed in (demo) as
          <span className="block truncate text-sm font-medium text-brand-950">{user.email}</span>
        </p>
        <Link to="/book" onClick={close} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-950 hover:bg-surface">
          <ListChecks className="size-4" aria-hidden="true" /> My bookings
        </Link>
        <button
          type="button"
          onClick={async () => {
            close()
            await signOut()
            navigate('/')
          }}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-brand-950 hover:bg-surface"
        >
          <LogOut className="size-4" aria-hidden="true" /> Log out
        </button>
      </div>
    </div>
  )
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [servicesOpen, setServicesOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const itemClass = 'flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-base font-semibold text-brand-950 hover:bg-surface'

  return (
    <div
      id="mobile-menu"
      className={cn(
        'fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto border-t border-slate-200 bg-white transition-all duration-300 lg:hidden',
        open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0',
      )}
      inert={!open}
    >
      <Container className="flex min-h-full flex-col py-6">
        <nav aria-label="Mobile" className="flex-1">
          <ul className="space-y-1">
            <li>
              <NavLink to="/" end onClick={onClose} className={itemClass}>Home</NavLink>
            </li>
            <li>
              <button type="button" className={itemClass} aria-expanded={servicesOpen} aria-controls="mobile-services" onClick={() => setServicesOpen((v) => !v)}>
                Services
                <ChevronDown className={cn('size-5 transition-transform', servicesOpen && 'rotate-180')} aria-hidden="true" />
              </button>
              <ul id="mobile-services" hidden={!servicesOpen} className="mt-1 mb-2 ml-4 space-y-1 border-l border-slate-200 pl-3">
                {serviceNav.map(({ label, to, icon: Icon }) => (
                  <li key={to}>
                    <Link to={to} onClick={onClose} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-slate-700 hover:bg-surface">
                      <Icon className="size-4 text-mint-700" aria-hidden="true" />
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/services" onClick={onClose} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold text-brand-800 hover:bg-surface">
                    <LayoutGrid className="size-4" aria-hidden="true" /> All services
                  </Link>
                </li>
              </ul>
            </li>
            {primaryNav.slice(1).map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} onClick={onClose} className={itemClass}>{item.label}</NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/download" onClick={onClose} className={itemClass}>Get the App</NavLink>
            </li>
          </ul>
        </nav>
        <div className="mt-6 space-y-3 border-t border-slate-200 pt-6">
          {user ? (
            <>
              <p className="px-1 text-sm text-slate-500">Signed in (demo) as <span className="font-medium text-brand-950">{user.email}</span></p>
              <ButtonLink to="/book" variant="secondary" size="lg" className="w-full" onClick={onClose}>My bookings</ButtonLink>
              <button
                type="button"
                className="w-full rounded-full py-3 text-sm font-semibold text-slate-600 hover:text-brand-900"
                onClick={async () => {
                  onClose()
                  await signOut()
                  navigate('/')
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <ButtonLink to="/login" variant="secondary" size="lg" className="w-full" onClick={onClose}>Log in</ButtonLink>
          )}
          <ButtonLink to="/book" size="lg" className="w-full" onClick={onClose}>
            <CalendarPlus className="size-5" aria-hidden="true" /> Book a Cleaning
          </ButtonLink>
        </div>
      </Container>
    </div>
  )
}

export function Navbar() {
  const { isAuthenticated } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => mq.matches && setMobileOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-300',
        // backdrop-filter would make the header the containing block of the fixed mobile menu
        mobileOpen
          ? 'border-slate-200 bg-white'
          : scrolled
            ? 'border-slate-200/80 bg-white/90 shadow-[0_1px_12px_rgb(10_43_50/0.06)] backdrop-blur-lg'
            : 'border-transparent bg-white',
      )}
    >
      <Container className="flex h-[72px] items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            <li><NavLink to="/" end className={navLinkClass}>Home</NavLink></li>
            <li><ServicesMenu /></li>
            {primaryNav.slice(1).map((item) => (
              <li key={item.to}><NavLink to={item.to} className={navLinkClass}>{item.label}</NavLink></li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            {isAuthenticated ? <UserMenu /> : <NavLink to="/login" className={navLinkClass}>Login</NavLink>}
          </div>
          <ButtonLink to="/book" size="md" className="hidden sm:inline-flex">
            <CalendarPlus className="size-4" aria-hidden="true" /> Book a Cleaning
          </ButtonLink>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-brand-950 transition-colors hover:bg-slate-100 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          </button>
        </div>
      </Container>
      <MobileMenu open={mobileOpen} onClose={closeMobile} />
    </header>
  )
}
