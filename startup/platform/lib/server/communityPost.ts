'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function createCommunityPost(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Sign in required')

  const title = String(formData.get('title') || '').trim()
  const body = String(formData.get('body') || '').trim()
  const locale = String(formData.get('locale') || 'en')
  if (!title || !body) throw new Error('Title and body required')

  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not configured')

  const profile = await prisma.userProfile.findUnique({ where: { id: user.id } })
  if (!profile) throw new Error('Complete your profile first (sign up flow).')

  await prisma.communityPost.create({
    data: {
      authorId: user.id,
      title: title.slice(0, 200),
      body: body.slice(0, 20000),
      locale: locale.slice(0, 8),
    },
  })

  revalidatePath(`/${locale}/community`)
}
