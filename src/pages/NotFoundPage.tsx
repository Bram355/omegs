import { ArrowLeft, Home, LayoutGrid } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LogoMark } from '../components/brand/Logo'
import { Button, ButtonLink } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { useSeo } from '../hooks/useSeo'

export default function NotFoundPage() {
  useSeo('Page not found')
  const navigate = useNavigate()
  return (
    <section className="bg-surface">
      <Container className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <LogoMark className="size-14" />
        <p className="mt-8 text-sm font-semibold tracking-wide text-mint-700 uppercase">Error 404</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">This page has been swept away</h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
          We couldn’t find the page you were looking for. It may have moved, or the link may be incorrect.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/" size="lg"><Home className="size-5" aria-hidden="true" /> Back to home</ButtonLink>
          <ButtonLink to="/services" variant="secondary" size="lg"><LayoutGrid className="size-5" aria-hidden="true" /> Browse services</ButtonLink>
          <Button variant="ghost" size="lg" onClick={() => navigate(-1)}><ArrowLeft className="size-5" aria-hidden="true" /> Go back</Button>
        </div>
      </Container>
    </section>
  )
}
