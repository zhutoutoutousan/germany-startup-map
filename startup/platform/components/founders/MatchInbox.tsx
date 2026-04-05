'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { respondToMatch } from '@/lib/server/founders'

type Req = {
  id: string
  introMessage: string | null
  fromUser: { fullName: string | null; email: string | null }
}

export function MatchInbox({ requests, locale }: { requests: Req[]; locale: string }) {
  const t = useTranslations('founders')
  const [busy, setBusy] = useState<string | null>(null)

  async function respond(id: string, accept: boolean) {
    setBusy(id)
    const fd = new FormData()
    fd.set('locale', locale)
    fd.set('requestId', id)
    fd.set('accept', accept ? 'true' : 'false')
    try {
      await respondToMatch(fd)
    } finally {
      setBusy(null)
    }
  }

  return (
    <section className="mt-8 rounded-lg border border-fuchsia-500/30 bg-fuchsia-950/10 p-4">
      <h2 className="font-club text-xs font-bold uppercase tracking-widest text-fuchsia-300">
        {t('inbox')}
      </h2>
      <ul className="mt-3 space-y-3">
        {requests.map((r) => (
          <li key={r.id} className="rounded border border-zinc-800 bg-club-950/60 p-3 text-sm">
            <p className="text-zinc-200">
              {r.fromUser.fullName || r.fromUser.email || 'Founder'}
            </p>
            {r.introMessage && <p className="mt-1 text-zinc-400">{r.introMessage}</p>}
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                disabled={busy === r.id}
                onClick={() => respond(r.id, true)}
                className="rounded bg-emerald-700 px-2 py-1 text-xs text-white"
              >
                {t('accept')}
              </button>
              <button
                type="button"
                disabled={busy === r.id}
                onClick={() => respond(r.id, false)}
                className="rounded bg-zinc-700 px-2 py-1 text-xs text-white"
              >
                {t('decline')}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
