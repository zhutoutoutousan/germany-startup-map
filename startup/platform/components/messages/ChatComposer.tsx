'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { sendChatMessage } from '@/lib/server/chatMessage'

export function ChatComposer({ threadId, locale }: { threadId: string; locale: string }) {
  const t = useTranslations('messages')
  const [body, setBody] = useState('')
  const [pending, setPending] = useState(false)
  const [err, setErr] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    const trimmed = body.trim()
    if (!trimmed) return
    setPending(true)
    const fd = new FormData()
    fd.set('threadId', threadId)
    fd.set('locale', locale)
    fd.set('body', trimmed)
    try {
      await sendChatMessage(fd)
      setBody('')
    } catch (er) {
      setErr(er instanceof Error ? er.message : t('error'))
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={submit} className="border-t border-zinc-800 bg-club-950/90 p-4">
      {err && <p className="mb-2 text-xs text-red-400">{err}</p>}
      <label className="sr-only" htmlFor={`msg-${threadId}`}>
        {t('composeLabel')}
      </label>
      <textarea
        id={`msg-${threadId}`}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder={t('placeholder')}
        className="w-full rounded border border-zinc-700 bg-club-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600"
      />
      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-sm bg-gradient-to-r from-fuchsia-600 to-cyan-600 px-4 py-2 font-club text-xs font-bold uppercase text-white disabled:opacity-50"
      >
        {pending ? '…' : t('send')}
      </button>
    </form>
  )
}
