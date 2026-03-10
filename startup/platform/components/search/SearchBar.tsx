'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  const getLocale = () => {
    const segments = pathname.split('/')
    return segments[1] || 'en'
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const locale = getLocale()
    router.push(`/${locale}/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
      <div className="flex items-center bg-white rounded-lg shadow-lg p-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search businesses, services, properties..."
          className="flex-1 px-4 py-2 outline-none"
        />
        <button
          type="submit"
          className="p-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  )
}
