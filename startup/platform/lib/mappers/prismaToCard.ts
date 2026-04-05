import type { Business, ServiceProvider } from '@prisma/client'

/** Map Prisma Business → shape expected by BusinessCard */
export function businessToCard(b: Business) {
  return {
    id: b.id,
    name: b.name,
    name_zh: b.nameZh ?? undefined,
    name_de: b.nameDe ?? undefined,
    description: b.description ?? undefined,
    description_zh: b.descriptionZh ?? undefined,
    description_de: b.descriptionDe ?? undefined,
    business_type: b.businessType,
    city: b.city,
    phone: b.phone ?? undefined,
    email: b.email ?? undefined,
    website: b.website ?? undefined,
  }
}

/** Map Prisma ServiceProvider → shape expected by ServiceCard */
export function serviceToCard(s: ServiceProvider) {
  return {
    id: s.id,
    company_name: s.companyName,
    company_name_zh: s.companyNameZh ?? undefined,
    company_name_de: s.companyNameDe ?? undefined,
    service_type: s.serviceType,
    description: s.description ?? undefined,
    description_zh: s.descriptionZh ?? undefined,
    description_de: s.descriptionDe ?? undefined,
    city: s.city,
    phone: s.phone ?? undefined,
    email: s.email ?? undefined,
    rating: Number(s.rating),
    review_count: s.reviewCount,
    verified: s.verified,
  }
}
