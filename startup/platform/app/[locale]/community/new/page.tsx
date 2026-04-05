'use client'

import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createCommunityPost } from '@/lib/server/communityPost'

export default function NewCommunityPostPage() {
  const t = useTranslations('community')
  const pathname = usePathname()
  const router = useRouter()
  const locale = pathname.split('/')[1] || 'en'
  const [err, setErr] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErr('')
    setPending(true)
    const fd = new FormData(e.currentTarget)
    fd.set('locale', locale)
    try {
      await createCommunityPost(fd)
      router.push(`/${locale}/community`)
    } catch (er) {
      setErr(er instanceof Error ? er.message : 'Failed')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-display text-2xl font-semibold text-neon-gold">{t('newTitle')}</h1>
      {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input type="hidden" name="locale" value={locale} />
        <div>
          <label className="block text-sm text-zinc-400">{t('fieldTitle')}</label>
          <input
            name="title"
            required
            className="mt-1 w-full rounded border border-zinc-700 bg-club-950 px-3 py-2 text-zinc-100"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">{t('fieldBody')}</label>
          <textarea
            name="body"
            required
            rows={8}
            className="mt-1 w-full rounded border border-zinc-700 bg-club-950 px-3 py-2 text-zinc-100"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-cyan-600 px-4 py-2 font-club text-xs font-bold uppercase text-white disabled:opacity-50"
        >
          {pending ? '…' : t('publish')}
        </button>
      </form>
    </div>
  )
}
