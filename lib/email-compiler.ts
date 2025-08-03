export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export async function compileEmailTemplate(
  templateCode: string,
  templateData: Record<string, any> = {},
): Promise<EmailTemplate> {
  try {
    // This is a simplified version - in production you'd use a more robust compilation system
    // For now, we'll return a mock compiled template

    const mockHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Email Template</title>
  <style>
    body { font-family: Inter, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
    .header { text-align: center; padding: 40px 20px; }
    .logo { width: 120px; height: 40px; background: #6757d9; margin: 0 auto 20px; border-radius: 4px; }
    .title { font-size: 24px; font-weight: bold; margin: 0; color: #111827; }
    .content { padding: 0 40px 40px; }
    .text { font-size: 16px; line-height: 24px; color: #6b7280; margin: 20px 0; }
    .button { display: inline-block; background: #6757d9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; }
    .footer { text-align: center; padding: 20px; font-size: 14px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo"></div>
      <h1 class="title">Welcome to ${templateData.companyName || "DevSend"}, ${templateData.firstName || "there"}!</h1>
    </div>
    <div class="content">
      <p class="text">
        We're excited to have you on board. Get started by creating your first 
        email campaign and reaching your audience with beautiful, responsive emails.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://devsend.com/dashboard" class="button">Get Started</a>
      </div>
      <p class="text">
        If you have any questions, feel free to reach out to our support team.
      </p>
    </div>
    <div class="footer">
      <p>© 2024 ${templateData.companyName || "DevSend"}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`

    const mockText = `
Welcome to ${templateData.companyName || "DevSend"}, ${templateData.firstName || "there"}!

We're excited to have you on board. Get started by creating your first email campaign and reaching your audience with beautiful, responsive emails.

Get Started: https://devsend.com/dashboard

If you have any questions, feel free to reach out to our support team.

© 2024 ${templateData.companyName || "DevSend"}. All rights reserved.
`

    return {
      subject: `Welcome to ${templateData.companyName || "DevSend"}!`,
      html: mockHtml,
      text: mockText,
    }
  } catch (error) {
    throw new Error(`Failed to compile template: ${error}`)
  }
}

export function validateTemplateCode(code: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Basic validation
  if (!code.trim()) {
    errors.push("Template code cannot be empty")
  }

  if (!code.includes("export default")) {
    errors.push("Template must have a default export")
  }

  // Check for required imports (simplified)
  const requiredImports = ["Html", "Head", "Body"]
  requiredImports.forEach((imp) => {
    if (!code.includes(imp)) {
      errors.push(`Missing required import: ${imp}`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
  }
}
