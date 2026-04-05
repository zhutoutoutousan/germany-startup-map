import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { BusinessRow } from '@/lib/ingest/overpassGermany'

export type IngestBusinessInput = {
  name: string
  description: string
  businessType: 'restaurant' | 'retail' | 'ecommerce' | 'service' | 'other'
  city: string
  address?: string | null
  latitude: number
  longitude: number
  status?: 'active'
  featured?: boolean
  externalSource: string
  externalId: string
  country?: string
}

export async function upsertIngestBusinesses(rows: IngestBusinessInput[]) {
  let count = 0
  for (const row of rows) {
    const data: Prisma.BusinessCreateInput = {
      name: row.name,
      description: row.description,
      businessType: row.businessType,
      city: row.city,
      address: row.address ?? null,
      latitude: row.latitude,
      longitude: row.longitude,
      status: row.status ?? 'active',
      featured: row.featured ?? false,
      externalSource: row.externalSource,
      externalId: row.externalId,
      country: row.country ?? 'Germany',
    }

    const existing = await prisma.business.findFirst({
      where: {
        externalSource: row.externalSource,
        externalId: row.externalId,
      },
    })

    if (existing) {
      await prisma.business.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          description: data.description,
          businessType: data.businessType,
          city: data.city,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          featured: data.featured,
          status: data.status,
        },
      })
    } else {
      await prisma.business.create({ data })
    }
    count += 1
  }
  return count
}

export function fromOsmRow(row: BusinessRow, featured: boolean): IngestBusinessInput {
  return {
    name: row.name,
    description: row.description,
    businessType: row.business_type,
    city: row.city,
    address: row.address,
    latitude: row.latitude,
    longitude: row.longitude,
    status: 'active',
    featured,
    externalSource: row.external_source,
    externalId: row.external_id,
    country: row.country,
  }
}
