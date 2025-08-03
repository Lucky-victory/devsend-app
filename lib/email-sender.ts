import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendEmailOptions {
  to: string[]
  from: string
  subject: string
  html: string
  text?: string
  replyTo?: string
  tags?: { name: string; value: string }[]
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

export async function sendEmail(options: SendEmailOptions): Promise<EmailResult> {
  try {
    const result = await resend.emails.send({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      reply_to: options.replyTo,
      tags: options.tags,
    })

    if (result.error) {
      return {
        success: false,
        error: result.error.message,
      }
    }

    return {
      success: true,
      messageId: result.data?.id,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function sendBulkEmails(emails: SendEmailOptions[]): Promise<EmailResult[]> {
  const results: EmailResult[] = []

  // Send emails in batches to avoid rate limits
  const batchSize = 10
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize)
    const batchPromises = batch.map((email) => sendEmail(email))
    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)

    // Add delay between batches
    if (i + batchSize < emails.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  return results
}

export async function sendTestEmail(
  templateHtml: string,
  templateText: string,
  subject: string,
  fromEmail: string,
  testEmail: string,
): Promise<EmailResult> {
  return sendEmail({
    to: [testEmail],
    from: fromEmail,
    subject: `[TEST] ${subject}`,
    html: templateHtml,
    text: templateText,
    tags: [{ name: "type", value: "test" }],
  })
}
