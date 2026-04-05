import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { ChatComposer } from '@/components/messages/ChatComposer'

export const dynamic = 'force-dynamic'

function peerDisplay(
  thread: {
    userAId: string
    userA: { fullName: string | null; email: string | null }
    userB: { fullName: string | null; email: string | null }
  },
  me: string
) {
  const peer = thread.userAId === me ? thread.userB : thread.userA
  return peer.fullName || peer.email || 'Member'
}

export default async function MessageThreadPage({
  params: { locale, threadId },
}: {
  params: { locale: string; threadId: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations('messages')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-amber-200">{t('signInHint')}</p>
      </div>
    )
  }

  if (!process.env.DATABASE_URL) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-zinc-500">{t('needsDb')}</p>
      </div>
    )
  }

  const thread = await prisma.chatThread.findUnique({
    where: { id: threadId },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
      userA: { select: { fullName: true, email: true } },
      userB: { select: { fullName: true, email: true } },
    },
  })

  if (!thread || (thread.userAId !== user.id && thread.userBId !== user.id)) {
    notFound()
  }

  const peerName = peerDisplay(thread, user.id)

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col px-4 py-10">
      <Link
        href={`/${locale}/messages`}
        className="mb-4 text-sm text-cyan-400 hover:text-cyan-300"
      >
        ← {t('back')}
      </Link>
      <h1 className="font-display text-2xl font-semibold text-neon-gold">
        {t('threadWith', { name: peerName })}
      </h1>

      <ul className="mt-6 flex-1 space-y-4 overflow-y-auto pb-4">
        {thread.messages.map((m) => {
          const mine = m.senderId === user.id
          return (
            <li
              key={m.id}
              className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg border px-3 py-2 text-sm ${
                  mine
                    ? 'border-fuchsia-500/40 bg-fuchsia-950/30 text-zinc-100'
                    : 'border-zinc-700 bg-club-900/80 text-zinc-200'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.body}</p>
                <p className="mt-1 text-[10px] text-zinc-500">
                  {m.createdAt.toLocaleString(locale)}
                </p>
              </div>
            </li>
          )
        })}
      </ul>

      <ChatComposer threadId={thread.id} locale={locale} />
    </div>
  )
}
