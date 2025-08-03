export interface DeliverabilityIssue {
  type: string
  severity: "low" | "medium" | "high"
  message: string
  suggestion: string
}

export interface DeliverabilityReport {
  score: number
  issues: DeliverabilityIssue[]
  recommendations: string[]
}

export function analyzeEmailContent(html: string, subject: string): DeliverabilityReport {
  const issues: DeliverabilityIssue[] = []
  let score = 100

  // Subject line analysis
  if (subject.length > 50) {
    issues.push({
      type: "subject_length",
      severity: "medium",
      message: "Subject line is too long",
      suggestion: "Keep subject lines under 50 characters for better mobile display",
    })
    score -= 10
  }

  if (subject.includes("FREE") || subject.includes("!!!")) {
    issues.push({
      type: "spam_words",
      severity: "high",
      message: "Subject contains spam trigger words",
      suggestion: "Avoid words like 'FREE', excessive punctuation, and ALL CAPS",
    })
    score -= 20
  }

  // Content analysis
  const textContent = html.replace(/<[^>]*>/g, "")
  const wordCount = textContent.split(/\s+/).length
  const imageCount = (html.match(/<img/g) || []).length
  const linkCount = (html.match(/<a/g) || []).length

  if (wordCount < 50) {
    issues.push({
      type: "content_length",
      severity: "medium",
      message: "Email content is too short",
      suggestion: "Add more valuable content to improve engagement",
    })
    score -= 15
  }

  if (imageCount > wordCount / 10) {
    issues.push({
      type: "image_ratio",
      severity: "high",
      message: "Too many images relative to text",
      suggestion: "Maintain a good text-to-image ratio to avoid spam filters",
    })
    score -= 25
  }

  if (linkCount > 10) {
    issues.push({
      type: "link_count",
      severity: "medium",
      message: "Too many links in email",
      suggestion: "Limit links to essential ones to improve deliverability",
    })
    score -= 15
  }

  // Check for missing elements
  if (!html.includes("unsubscribe")) {
    issues.push({
      type: "missing_unsubscribe",
      severity: "high",
      message: "Missing unsubscribe link",
      suggestion: "Always include an unsubscribe link to comply with regulations",
    })
    score -= 30
  }

  if (!html.includes("alt=")) {
    issues.push({
      type: "missing_alt_text",
      severity: "low",
      message: "Images missing alt text",
      suggestion: "Add alt text to all images for better accessibility",
    })
    score -= 5
  }

  const recommendations = [
    "Use a consistent sender name and email address",
    "Maintain a clean subscriber list",
    "Monitor your sender reputation",
    "Test emails across different clients",
    "Include both HTML and plain text versions",
  ]

  return {
    score: Math.max(0, score),
    issues,
    recommendations,
  }
}

export function generateDeliverabilityTips(): string[] {
  return [
    "Authenticate your domain with SPF, DKIM, and DMARC records",
    "Maintain a consistent sending schedule",
    "Monitor bounce rates and remove invalid addresses",
    "Use double opt-in for new subscribers",
    "Segment your audience for better engagement",
    "Avoid spam trigger words in subject lines",
    "Include a clear unsubscribe link",
    "Test your emails before sending",
    "Monitor your sender reputation regularly",
    "Keep your subscriber list clean and engaged",
  ]
}
