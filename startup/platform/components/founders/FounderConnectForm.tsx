'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { sendFounderIntro } from '@/lib/server/founders'

export function FounderConnectForm({ toUserId }: { toUserId: string }) {
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'
  const t = useTranslations('founders')
  const [intro, setIntro] = useState('')
  const [msg, setMsg] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')
    setPending(true)
    const fd = new FormData()
    fd.set('locale', locale)
    fd.set('toUserId', toUserId)
    fd.set('intro', intro)
    try {
      await sendFounderIntro(fd)
      setMsg(t('sent'))
      setIntro('')
    } catch (er) {
      setMsg(er instanceof Error ? er.message : 'Error')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-2 border-t border-zinc-800 pt-4">
      <label className="block text-xs text-zinc-500">{t('introLabel')}</label>
      <textarea
        value={intro}
        onChange={(e) => setIntro(e.target.value)}
        rows={2}
        className="w-full rounded border border-zinc-700 bg-club-950 px-2 py-1 text-sm text-zinc-200"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm bg-fuchsia-700 px-3 py-1.5 font-club text-[10px] font-bold uppercase text-white disabled:opacity-50"
      >
        {t('connect')}
      </button>
      {msg && <p className="text-xs text-cyan-400">{msg}</p>}
    </form>
  )
}
