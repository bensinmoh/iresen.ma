export type ContactMessage = {
  name: string
  email: string
  message: string
  locale: 'fr' | 'en' | 'ar'
}
export type DeliveryResult = { status: 'queued'; id: string } | { status: 'unavailable' }

export interface EmailAdapter {
  deliverContact(input: ContactMessage): Promise<DeliveryResult>
}

// No provider is configured yet. Never report a successful delivery before an actual queue accepts it.
export const emailAdapter: EmailAdapter = {
  async deliverContact() {
    return { status: 'unavailable' }
  },
}
