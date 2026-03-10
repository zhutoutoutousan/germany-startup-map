'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface LinkProps {
  href: string
  children: ReactNode
  className?: string
}

export function Link({ href, children, className = '' }: LinkProps) {
  const pathname = usePathname()
  const getLocale = () => {
    const segments = pathname.split('/')
    return segments[1] || 'en'
  }

  const locale = getLocale()
  const localizedHref = href.startsWith('/') ? `/${locale}${href}` : href

  return (
    <NextLink href={localizedHref} className={className}>
      {children}
    </NextLink>
  )
}
