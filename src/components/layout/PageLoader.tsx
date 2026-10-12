import { Loader2 } from 'lucide-react'

export function PageLoader() {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status">
      <Loader2 className="size-8 animate-spin text-brand-700" aria-hidden="true" />
      <span className="sr-only">Loading page…</span>
    </div>
  )
}
