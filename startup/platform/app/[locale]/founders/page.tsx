import type { Prisma } from '@prisma/client'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { locales } from '@/i18n/config'

type FounderRow = Prisma.FounderProfileGetPayload<{
  include: { user: { select: { fullName: true; email: true } } }
}>
type IncomingMatchRow = Prisma.FounderMatchRequestGetPayload<{
  include: { fromUser: { select: { fullName: true; email: true } } }
}>
import { FounderConnectForm } from '@/components/founders/FounderConnectForm'
import { MatchInbox } from '@/components/founders/MatchInbox'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const dynamic = 'force-dynamic'

export default async function FoundersPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = await getTranslations('founders')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profiles: FounderRow[] = []
  let incoming: IncomingMatchRow[] = []

  if (process.env.DATABASE_URL) {
    try {
      profiles = await prisma.founderProfile.findMany({
        where: {
          visible: true,
          ...(user?.id ? { userId: { not: user.id } } : {}),
        },
        include: { user: { select: { fullName: true, email: true } } },
        take: 40,
      })

      if (user?.id) {
        incoming = await prisma.founderMatchRequest.findMany({
          where: { toUserId: user.id, status: 'pending' },
          include: { fromUser: { select: { fullName: true, email: true } } },
        })
      }
    } catch (e) {
      console.error('founders', e)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
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

      {user && incoming.length > 0 && (
        <MatchInbox requests={incoming} locale={locale} />
      )}

      <ul className="mt-10 space-y-6">
        {profiles.map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-zinc-800 bg-club-900/50 p-5 shadow-club"
          >
            <h2 className="font-display text-xl text-zinc-100">{p.headline}</h2>
            <p className="text-xs text-zinc-500">
              {p.user.fullName || p.user.email || 'Founder'} · {p.city}
            </p>
            {p.bio && <p className="mt-2 text-sm text-zinc-300">{p.bio}</p>}
            {p.skills.length > 0 && (
              <p className="mt-2 text-xs text-cyan-400">
                Skills: {p.skills.join(', ')}
              </p>
            )}
            {p.seeking.length > 0 && (
              <p className="mt-1 text-xs text-fuchsia-400">
                Seeking: {p.seeking.join(', ')}
              </p>
            )}
            {user && user.id !== p.userId && (
              <FounderConnectForm toUserId={p.userId} />
            )}
          </li>
        ))}
      </ul>
      {process.env.DATABASE_URL && profiles.length === 0 && (
        <p className="mt-8 text-zinc-500">{t('empty')}</p>
      )}
    </div>
  )
}
