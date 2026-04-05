'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { sortParticipantIds } from '@/lib/chat/sortParticipants'
import { notifyNewChatMessage } from '@/lib/email/notify'

export async function sendFounderIntro(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Sign in required')
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not configured')

  const locale = String(formData.get('locale') || 'en')
  const toUserId = String(formData.get('toUserId') || '')
  const intro = String(formData.get('intro') || '').trim().slice(0, 2000)
  if (!toUserId || toUserId === user.id) throw new Error('Invalid recipient')

  const existing = await prisma.founderMatchRequest.findFirst({
    where: { fromUserId: user.id, toUserId },
  })
  if (existing) {
    await prisma.founderMatchRequest.update({
      where: { id: existing.id },
      data: { introMessage: intro || null, status: 'pending' },
    })
  } else {
    await prisma.founderMatchRequest.create({
      data: {
        fromUserId: user.id,
        toUserId,
        status: 'pending',
        introMessage: intro || null,
      },
    })
  }

  const toProfile = await prisma.userProfile.findUnique({ where: { id: toUserId } })
  if (toProfile?.email) {
    await notifyNewChatMessage({
      toEmail: toProfile.email,
      subject: 'New founder connection request',
      text: `Someone wants to connect on Germany Startup Map.\n\n${intro || '(no message)'}`,
    })
  }

  revalidatePath(`/${locale}/founders`)
}

export async function respondToMatch(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Sign in required')
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not configured')

  const locale = String(formData.get('locale') || 'en')
  const requestId = String(formData.get('requestId') || '')
  const accept = String(formData.get('accept') || '') === 'true'
  if (!requestId) throw new Error('Missing request')

  const req = await prisma.founderMatchRequest.findUnique({ where: { id: requestId } })
  if (!req || req.toUserId !== user.id) throw new Error('Not allowed')

  await prisma.founderMatchRequest.update({
    where: { id: requestId },
    data: { status: accept ? 'accepted' : 'declined' },
  })

  if (accept) {
    const [a, b] = sortParticipantIds(req.fromUserId, req.toUserId)
    const thread = await prisma.chatThread.findFirst({
      where: { userAId: a, userBId: b },
    })
    if (!thread) {
      await prisma.chatThread.create({ data: { userAId: a, userBId: b } })
    }
  }

  revalidatePath(`/${locale}/founders`)
  revalidatePath(`/${locale}/messages`)
}
