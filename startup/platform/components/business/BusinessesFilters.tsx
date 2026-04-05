'use client'

import { useTranslations } from 'next-intl'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'

const TYPES = [
  { value: '', labelKey: 'allTypes' as const },
  { value: 'restaurant', labelKey: 'typeRestaurant' as const },
  { value: 'retail', labelKey: 'typeRetail' as const },
  { value: 'ecommerce', labelKey: 'typeEcommerce' as const },
  { value: 'service', labelKey: 'typeService' as const },
]

export function BusinessesFilters() {
  const t = useTranslations('business')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [type, setType] = useState(searchParams.get('type') ?? '')
  const [city, setCity] = useState(searchParams.get('city') ?? '')

  useEffect(() => {
    setType(searchParams.get('type') ?? '')
    setCity(searchParams.get('city') ?? '')
  }, [searchParams])

  const apply = (e?: FormEvent) => {
    e?.preventDefault()
    const next = new URLSearchParams()
    const q = searchParams.get('q')
    if (q) next.set('q', q)
    if (type) next.set('type', type)
    if (city.trim()) next.set('city', city.trim())
    const qs = next.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  const field =
    'rounded-sm border border-zinc-700 bg-club-950/80 px-3 py-2.5 font-sans text-zinc-100 shadow-sm outline-none transition placeholder:text-zinc-500 focus:border-cyan-500/50 focus:ring-2 focus:ring-fuchsia-500/20'

  return (
    <form
      onSubmit={apply}
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <label className="flex min-w-[160px] flex-1 flex-col gap-1.5">
        <span className="font-club text-[10px] font-bold uppercase tracking-[0.3em] text-fuchsia-400/90">
          {t('type')}
        </span>
        <select value={type} onChange={(e) => setType(e.target.value)} className={field}>
          {TYPES.map((opt) => (
            <option key={opt.value || 'all'} value={opt.value} className="bg-club-900">
              {t(opt.labelKey)}
            </option>
          ))}
        </select>
      </label>
      <label className="flex min-w-[180px] flex-1 flex-col gap-1.5">
        <span className="font-club text-[10px] font-bold uppercase tracking-[0.3em] text-fuchsia-400/90">
          {t('city')}
        </span>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t('cityFilterPlaceholder')}
          className={field}
        />
      </label>
      <button
        type="submit"
        className="rounded-sm bg-gradient-to-r from-fuchsia-600 to-cyan-600 px-5 py-2.5 font-club text-xs font-bold uppercase tracking-wider text-white shadow-neon-fuchsia transition hover:from-fuchsia-500 hover:to-cyan-500"
      >
        {t('applyFilters')}
      </button>
    </form>
  )
}
