'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { notifyNewChatMessage } from '@/lib/email/notify'

export async function sendChatMessage(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Sign in required')
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not configured')

  const threadId = String(formData.get('threadId') || '')
  const body = String(formData.get('body') || '').trim().slice(0, 10000)
  const locale = String(formData.get('locale') || 'en')
  if (!threadId || !body) throw new Error('Missing fields')

  const thread = await prisma.chatThread.findUnique({ where: { id: threadId } })
  if (!thread || (thread.userAId !== user.id && thread.userBId !== user.id)) {
    throw new Error('Not in this thread')
  }

  await prisma.chatMessage.create({
    data: {
      threadId,
      senderId: user.id,
      body,
    },
  })

  const peerId = thread.userAId === user.id ? thread.userBId : thread.userAId
  const peer = await prisma.userProfile.findUnique({ where: { id: peerId } })
  if (peer?.email) {
    await notifyNewChatMessage({
      toEmail: peer.email,
      subject: 'New message on Germany Startup Map',
      text: body.slice(0, 500),
    })
  }

  revalidatePath(`/${locale}/messages`)
  revalidatePath(`/${locale}/messages/${threadId}`)
}
