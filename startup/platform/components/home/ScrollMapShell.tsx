'use client'

import { useTranslations } from 'next-intl'
import { Map } from '@/components/map/Map'
import { SearchBar } from '@/components/search/SearchBar'
import { Link } from '@/components/ui/Link'
import { Building2, Briefcase, Home, BookOpen } from 'lucide-react'

export interface ScrollMarker {
  id: string
  lat: number
  lng: number
  title: string
  description?: string
}

interface ScrollMapShellProps {
  markers: ScrollMarker[]
  mapMinHeight?: string
  showEmptyHint?: boolean
}

export function ScrollMapShell({
  markers,
  mapMinHeight = 'min(78vh, 820px)',
  showEmptyHint = true,
}: ScrollMapShellProps) {
  const t = useTranslations('home')

  return (
    <section className="relative w-full">
      <div
        className="relative w-full min-h-[360px]"
        style={{ minHeight: mapMinHeight }}
      >
        <div className="absolute inset-0 z-0">
          <Map
            markers={markers}
            height="100%"
            className="h-full rounded-none border-2 border-fuchsia-500/35 bg-club-950 !shadow-[inset_0_0_80px_rgba(0,0,0,0.5)]"
          />
          <div
            className="neon-border-soft absolute inset-2 z-10 rounded-sm md:inset-3"
            aria-hidden
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-b from-black/85 via-club-950/70 to-club-950/20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-fuchsia-950/50 via-transparent to-transparent mix-blend-screen animate-disco-sheen"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-10 pt-8 md:pt-12">
          <header className="pointer-events-none text-center">
            <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-club-950/80 px-5 py-6 shadow-[0_8px_48px_rgba(0,0,0,0.75)] backdrop-blur-md md:px-8 md:py-7">
              <p className="font-club text-[10px] font-bold uppercase tracking-[0.55em] text-fuchsia-200 text-shadow-map-sm">
                {t('hubKicker')}
              </p>
              <div className="mx-auto mt-4 max-w-2xl border-y border-neon-gold/40 py-3">
                <span className="inline-block [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.95))_drop-shadow(0_4px_20px_rgba(0,0,0,0.85))]">
                  <h1 className="font-display text-balance bg-gradient-to-r from-amber-200 via-fuchsia-200 to-cyan-300 bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl lg:text-5xl">
                    {t('hubTitle')}
                  </h1>
                </span>
              </div>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-base font-medium leading-relaxed text-zinc-100 text-shadow-map md:text-lg">
                {t('hubSubtitle')}
              </p>
            </div>
          </header>

          <div className="pointer-events-auto mx-auto w-full max-w-2xl rounded-xl border border-white/10 bg-black/40 px-3 py-2 shadow-[0_6px_32px_rgba(0,0,0,0.55)] backdrop-blur-md sm:px-4 sm:py-3">
            <SearchBar tone="disco" />
          </div>

          <div className="pointer-events-auto relative mx-auto w-full max-w-5xl china-corners rounded-sm border border-amber-400/25 bg-club-900/75 shadow-hub backdrop-blur-md">
            <div className="relative border-b border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-950/40 via-club-900/80 to-cyan-950/40 px-5 py-3">
              <p className="text-center font-display text-sm font-medium tracking-wide text-amber-200 text-shadow-map-sm">
                ◆ {t('infoCenter')} ◆
              </p>
            </div>
            <nav
              className="relative grid grid-cols-2 gap-2 p-3 sm:grid-cols-4 sm:gap-3 sm:p-4"
              aria-label={t('infoCenter')}
            >
              <ExplorerTile href="/businesses" icon={Building2} labelKey="tileBusinesses" />
              <ExplorerTile href="/services" icon={Briefcase} labelKey="tileServices" />
              <ExplorerTile href="/real-estate" icon={Home} labelKey="tileRealEstate" />
              <ExplorerTile href="/resources" icon={BookOpen} labelKey="tileResources" />
            </nav>
          </div>

          {showEmptyHint && markers.length === 0 && (
            <p className="pointer-events-auto mx-auto max-w-xl rounded-lg bg-black/45 px-4 py-2 text-center text-sm font-medium text-zinc-200 text-shadow-map-sm backdrop-blur-sm">
              {t('emptyMapHint')}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

function ExplorerTile({
  href,
  icon: Icon,
  labelKey,
}: {
  href: string
  icon: typeof Building2
  labelKey: 'tileBusinesses' | 'tileServices' | 'tileRealEstate' | 'tileResources'
}) {
  const t = useTranslations('home')

  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-2 rounded-sm border border-zinc-800 bg-club-950/60 px-2 py-4 text-center transition hover:border-cyan-400/50 hover:bg-fuchsia-950/30 hover:shadow-neon-cyan sm:px-3"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-fuchsia-500/40 bg-club-900 text-fuchsia-300 shadow-neon-fuchsia transition group-hover:border-cyan-400/60 group-hover:text-cyan-300">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <span className="font-display text-sm font-medium text-zinc-200 text-shadow-map-sm group-hover:text-zinc-50">
        {t(labelKey)}
      </span>
    </Link>
  )
}
