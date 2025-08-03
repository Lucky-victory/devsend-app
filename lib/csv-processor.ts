import Papa from "papaparse"

export interface ContactImportResult {
  success: number
  errors: number
  duplicates: number
  total: number
  errorDetails: Array<{
    row: number
    email: string
    error: string
  }>
}

export interface ContactData {
  email: string
  firstName?: string
  lastName?: string
  tags?: string[]
  customFields?: Record<string, any>
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function processContactsCSV(csvContent: string): Promise<ContactImportResult> {
  return new Promise((resolve) => {
    const result: ContactImportResult = {
      success: 0,
      errors: 0,
      duplicates: 0,
      total: 0,
      errorDetails: [],
    }

    const validContacts: ContactData[] = []
    const seenEmails = new Set<string>()

    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (parseResult) => {
        result.total = parseResult.data.length

        parseResult.data.forEach((row: any, index: number) => {
          const email = row.email?.trim().toLowerCase()

          if (!email) {
            result.errors++
            result.errorDetails.push({
              row: index + 1,
              email: row.email || "",
              error: "Email is required",
            })
            return
          }

          if (!validateEmail(email)) {
            result.errors++
            result.errorDetails.push({
              row: index + 1,
              email,
              error: "Invalid email format",
            })
            return
          }

          if (seenEmails.has(email)) {
            result.duplicates++
            result.errorDetails.push({
              row: index + 1,
              email,
              error: "Duplicate email in file",
            })
            return
          }

          seenEmails.add(email)

          // Process tags
          let tags: string[] = []
          if (row.tags) {
            tags = row.tags
              .split(",")
              .map((tag: string) => tag.trim())
              .filter(Boolean)
          }

          // Process custom fields
          const customFields: Record<string, any> = {}
          Object.keys(row).forEach((key) => {
            if (!["email", "firstName", "lastName", "tags"].includes(key) && row[key]) {
              customFields[key] = row[key]
            }
          })

          validContacts.push({
            email,
            firstName: row.firstName?.trim() || undefined,
            lastName: row.lastName?.trim() || undefined,
            tags: tags.length > 0 ? tags : undefined,
            customFields: Object.keys(customFields).length > 0 ? customFields : undefined,
          })

          result.success++
        })

        resolve(result)
      },
      error: () => {
        result.errors = result.total
        resolve(result)
      },
    })
  })
}

export function exportContactsToCSV(contacts: any[]): string {
  const csvData = contacts.map((contact) => ({
    email: contact.email,
    firstName: contact.firstName || "",
    lastName: contact.lastName || "",
    status: contact.status,
    tags: contact.tags?.join(", ") || "",
    subscribedAt: new Date(contact.subscribedAt).toISOString(),
    lastActivityAt: contact.lastActivityAt ? new Date(contact.lastActivityAt).toISOString() : "",
    ...contact.customFields,
  }))

  return Papa.unparse(csvData)
}

export function generateSampleCSV(): string {
  const sampleData = [
    {
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
      tags: "developer, premium",
      company: "Acme Inc",
      location: "New York",
    },
    {
      email: "jane@example.com",
      firstName: "Jane",
      lastName: "Smith",
      tags: "designer, new",
      company: "Design Co",
      location: "San Francisco",
    },
  ]

  return Papa.unparse(sampleData)
}
