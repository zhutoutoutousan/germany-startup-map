import type { Prisma } from '@prisma/client'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/components/ui/Link'
import { prisma } from '@/lib/prisma'
import { locales } from '@/i18n/config'

type CommunityPostRow = Prisma.CommunityPostGetPayload<{
  include: { author: { select: { fullName: true; email: true } } }
}>

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const dynamic = 'force-dynamic'

export default async function CommunityPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = await getTranslations('community')

  let posts: CommunityPostRow[] = []

  if (process.env.DATABASE_URL) {
    try {
      posts = await prisma.communityPost.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { author: { select: { fullName: true, email: true } } },
      })
    } catch (e) {
      console.error('community list', e)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold text-neon-gold">{t('title')}</h1>
        <Link
          href="/community/new"
          className="rounded-sm bg-gradient-to-r from-fuchsia-600 to-cyan-600 px-4 py-2 font-club text-xs font-bold uppercase tracking-wide text-white"
        >
          {t('newPost')}
        </Link>
      </div>
      {!process.env.DATABASE_URL && (
        <p className="text-zinc-400">{t('needsDb')}</p>
      )}
      <ul className="space-y-4">
        {posts.map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-zinc-800 bg-club-900/50 p-4 shadow-club"
          >
            <h2 className="font-display text-lg text-zinc-100">{p.title}</h2>
            <p className="mt-1 text-xs text-zinc-500">
              {p.author.fullName || p.author.email || 'Member'} ·{' '}
              {p.createdAt.toLocaleDateString(locale)}
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-300">{p.body}</p>
          </li>
        ))}
      </ul>
      {process.env.DATABASE_URL && posts.length === 0 && (
        <p className="text-zinc-500">{t('empty')}</p>
      )}
    </div>
  )
}
