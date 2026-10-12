import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5" aria-hidden="true" />}
            {item.to ? (
              <Link to={item.to} className="rounded transition-colors hover:text-brand-900">{item.label}</Link>
            ) : (
              <span aria-current="page" className="font-medium text-brand-900">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
