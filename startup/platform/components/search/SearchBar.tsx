'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

type SearchBarTone = 'light' | 'parchment' | 'disco'

export function SearchBar({ tone = 'light' }: { tone?: SearchBarTone }) {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('home')

  const getLocale = () => {
    const segments = pathname.split('/')
    return segments[1] || 'en'
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const locale = getLocale()
    router.push(`/${locale}/search?q=${encodeURIComponent(query)}`)
  }

  const shell =
    tone === 'disco'
      ? 'border border-cyan-500/35 bg-club-950/80 shadow-neon-cyan backdrop-blur-sm'
      : tone === 'parchment'
        ? 'border border-fuchsia-500/25 bg-club-900/70 shadow-hub backdrop-blur-sm'
        : 'border border-zinc-700 bg-club-900/90 shadow-club'

  const inputClass =
    tone === 'light'
      ? 'text-zinc-100 placeholder:text-zinc-500'
      : 'text-zinc-100 placeholder:text-zinc-500'

  return (
    <form onSubmit={handleSearch} className="mx-auto w-full max-w-2xl">
      <div className={`flex items-center gap-1 rounded-sm p-1.5 ${shell}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className={`min-w-0 flex-1 bg-transparent px-3 py-2.5 font-sans outline-none ${inputClass}`}
        />
        <button
          type="submit"
          className="rounded-sm bg-gradient-to-br from-fuchsia-600 to-cyan-500 px-4 py-2.5 text-white shadow-neon-fuchsia transition hover:from-fuchsia-500 hover:to-cyan-400"
          aria-label={t('searchAction')}
        >
          <Search size={20} strokeWidth={1.75} />
        </button>
      </div>
    </form>
  )
}
