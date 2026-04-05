'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
export function ContactForm() {
  const t = useTranslations()
  const [supabase] = useState(() => createClient())

  const [formData, setFormData] = useState({
    inquiry_type: 'general',
    subject: '',
    message: '',
    contact_email: '',
    contact_phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error: insertError } = await supabase.from('inquiries').insert({
      ...formData,
      user_id: user?.id || null,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setFormData({
        inquiry_type: 'general',
        subject: '',
        message: '',
        contact_email: '',
        contact_phone: '',
      })
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">{t('inquiry.title')}</h1>

      <div className="mx-auto max-w-2xl">
        {success && (
          <div className="mb-6 rounded border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            Your inquiry has been sent successfully!
          </div>
        )}

        {error && (
          <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="inquiry_type"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Inquiry Type
            </label>
            <select
              id="inquiry_type"
              value={formData.inquiry_type}
              onChange={(e) =>
                setFormData({ ...formData, inquiry_type: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              required
            >
              <option value="general">General Inquiry</option>
              <option value="business">Business Related</option>
              <option value="service">Service Related</option>
              <option value="real_estate">Real Estate</option>
              <option value="resource">Resource Related</option>
            </select>
          </div>

          <div>
            <label htmlFor="subject" className="mb-1 block text-sm font-medium text-gray-700">
              {t('inquiry.subject')}
            </label>
            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-700">
              {t('inquiry.message')}
            </label>
            <textarea
              id="message"
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="contact_email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {t('inquiry.yourEmail')}
            </label>
            <input
              type="email"
              id="contact_email"
              value={formData.contact_email}
              onChange={(e) =>
                setFormData({ ...formData, contact_email: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="contact_phone"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {t('inquiry.yourPhone')}
            </label>
            <input
              type="tel"
              id="contact_phone"
              value={formData.contact_phone}
              onChange={(e) =>
                setFormData({ ...formData, contact_phone: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('inquiry.sendInquiry')}
          </button>
        </form>
      </div>
    </div>
  )
}
