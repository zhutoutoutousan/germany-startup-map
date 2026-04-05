/**
 * Optional Resend integration for “mail” notifications on new chat messages.
 * Set RESEND_API_KEY + RESEND_FROM_EMAIL in server env to enable.
 */
export async function notifyNewChatMessage(params: {
  toEmail: string
  subject: string
  text: string
}) {
  const key = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!key || !from) return

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [params.toEmail],
      subject: params.subject,
      text: params.text,
    }),
  })
}
