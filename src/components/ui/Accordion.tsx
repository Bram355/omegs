import { Plus } from 'lucide-react'
import { useId, useState } from 'react'
import { cn } from '../../lib/cn'
import type { FaqItem } from '../../types'

export function Accordion({ items, className, defaultOpen = 0 }: { items: FaqItem[]; className?: string; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  const baseId = useId()

  return (
    <div className={cn('divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white', className)}>
      {items.map((item, index) => {
        const isOpen = open === index
        const buttonId = `${baseId}-btn-${index}`
        const panelId = `${baseId}-panel-${index}`
        return (
          <div key={item.question}>
            <h3 className="text-base">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-semibold text-brand-950 transition-colors hover:text-brand-700 focus-visible:-outline-offset-2"
              >
                {item.question}
                <span
                  className={cn(
                    'grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-300',
                    isOpen ? 'rotate-45 border-brand-900 bg-brand-900 text-white' : 'border-slate-200 text-brand-900',
                  )}
                  aria-hidden="true"
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn('grid transition-[grid-template-rows] duration-300 ease-out', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <p className="px-6 pb-6 leading-relaxed text-slate-600">{item.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
