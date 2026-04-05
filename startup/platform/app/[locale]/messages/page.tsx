import type { Prisma } from '@prisma/client'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { locales } from '@/i18n/config'

type ThreadListRow = Prisma.ChatThreadGetPayload<{
  include: {
    messages: { orderBy: { createdAt: 'desc' }; take: 1 }
    userA: { select: { fullName: true; email: true } }
    userB: { select: { fullName: true; email: true } }
  }
}>

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const dynamic = 'force-dynamic'

function peerDisplay(thread: ThreadListRow, me: string) {
  const peer = thread.userAId === me ? thread.userB : thread.userA
  return peer.fullName || peer.email || 'Member'
}

export default async function MessagesPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = await getTranslations('messages')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let threads: ThreadListRow[] = []

  if (user?.id && process.env.DATABASE_URL) {
    try {
      threads = await prisma.chatThread.findMany({
        where: {
          OR: [{ userAId: user.id }, { userBId: user.id }],
        },
        orderBy: { createdAt: 'desc' },
        include: {
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
          userA: { select: { fullName: true, email: true } },
          userB: { select: { fullName: true, email: true } },
        },
      })
    } catch (e) {
      console.error('messages list', e)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold text-neon-gold">{t('title')}</h1>
      <p className="mt-2 text-sm text-zinc-400">{t('subtitle')}</p>

      {!user && (
        <p className="mt-6 rounded border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-sm text-amber-200">
          {t('signInHint')}
        </p>
      )}

      {!process.env.DATABASE_URL && (
        <p className="mt-4 text-zinc-500">{t('needsDb')}</p>
      )}

      {user && process.env.DATABASE_URL && (
        <ul className="mt-8 space-y-3">
          {threads.map((th) => {
            const name = peerDisplay(th, user.id)
            const preview = th.messages[0]?.body
            return (
              <li key={th.id}>
                <Link
                  href={`/${locale}/messages/${th.id}`}
                  className="block rounded-lg border border-zinc-800 bg-club-900/50 p-4 shadow-club transition hover:border-fuchsia-500/40"
                >
                  <p className="font-club text-xs font-bold uppercase tracking-widest text-fuchsia-300">
                    {t('threadWith', { name })}
                  </p>
                  {preview && (
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{preview}</p>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      {user && process.env.DATABASE_URL && threads.length === 0 && (
        <p className="mt-8 text-zinc-500">{t('empty')}</p>
      )}
    </div>
  )
}
