"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Monitor, Smartphone, Tablet, Send, Copy, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"
import { useAuth } from "@/app/providers/auth"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { compileEmailTemplate } from "@/lib/email-compiler"
import { toast } from "sonner"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

interface PreviewPageProps {
  params: {
    templateId: string
  }
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const [currentDevice, setCurrentDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [compiledHtml, setCompiledHtml] = useState<string>("")
  const [testEmail, setTestEmail] = useState("")
  const [previewData, setPreviewData] = useState('{"firstName": "John", "companyName": "DevSend"}')
  const { currentWorkspace } = useAuth()

  const template = useQuery(api.templates.getTemplate, { templateId: params.templateId as any })

  useEffect(() => {
    if (template && template.content) {
      compileTemplate()
    }
  }, [template, previewData])

  const compileTemplate = async () => {
    if (!template) return

    try {
      let parsedData = {}
      try {
        parsedData = JSON.parse(previewData)
      } catch (e) {
        parsedData = {}
      }

      if (template.type === "code") {
        const compiled = await compileEmailTemplate(template.content, parsedData)
        setCompiledHtml(compiled.html)
      } else {
        // For visual templates, the content is already HTML or design JSON
        setCompiledHtml(template.content)
      }
    } catch (error) {
      console.error("Failed to compile template:", error)
      toast.error("Failed to compile template")
    }
  }

  const handleSendTest = async () => {
    if (!testEmail) {
      toast.error("Please enter a test email address")
      return
    }

    try {
      // In a real app, you'd call your email sending API
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success(`Test email sent to ${testEmail}!`)
    } catch (error) {
      toast.error("Failed to send test email")
    }
  }

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(compiledHtml)
    toast.success("HTML copied to clipboard!")
  }

  const handleDownloadHtml = () => {
    const blob = new Blob([compiledHtml], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${template?.name || "template"}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("HTML file downloaded!")
  }

  const getDeviceWidth = () => {
    switch (currentDevice) {
      case "tablet":
        return "768px"
      case "mobile":
        return "375px"
      default:
        return "100%"
    }
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading template...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6"
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/email-templates">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{template.name}</h1>
              <p className="text-muted-foreground">Preview your email template</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={template.type === "code" ? "default" : "secondary"}>
              {template.type === "code" ? "Code" : "Visual"}
            </Badge>
            <Badge variant={template.status === "published" ? "default" : "outline"}>{template.status}</Badge>
            <Button variant="outline" asChild>
              <Link href={`/dashboard/email-templates/${params.templateId}/edit`}>Edit Template</Link>
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Controls Panel */}
        <motion.div className="lg:col-span-1 space-y-6" variants={fadeInUp}>
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Device Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Button
                  variant={currentDevice === "desktop" ? "default" : "outline"}
                  onClick={() => setCurrentDevice("desktop")}
                  className="justify-start"
                >
                  <Monitor className="mr-2 h-4 w-4" />
                  Desktop
                </Button>
                <Button
                  variant={currentDevice === "tablet" ? "default" : "outline"}
                  onClick={() => setCurrentDevice("tablet")}
                  className="justify-start"
                >
                  <Tablet className="mr-2 h-4 w-4" />
                  Tablet
                </Button>
                <Button
                  variant={currentDevice === "mobile" ? "default" : "outline"}
                  onClick={() => setCurrentDevice("mobile")}
                  className="justify-start"
                >
                  <Smartphone className="mr-2 h-4 w-4" />
                  Mobile
                </Button>
              </div>
            </CardContent>
          </Card>

          {template.type === "code" && (
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Preview Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="previewData">JSON Data</Label>
                  <textarea
                    id="previewData"
                    value={previewData}
                    onChange={(e) => setPreviewData(e.target.value)}
                    className="w-full h-32 p-2 text-sm border rounded-md resize-none font-mono"
                    placeholder="Enter JSON data for preview"
                  />
                </div>
                <Button onClick={compileTemplate} className="w-full">
                  Update Preview
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Send Test Email
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Test Email</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="testEmail">Email Address</Label>
                      <Input
                        id="testEmail"
                        type="email"
                        placeholder="test@example.com"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleSendTest} className="w-full">
                      Send Test Email
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={handleCopyHtml} className="w-full bg-transparent">
                <Copy className="mr-2 h-4 w-4" />
                Copy HTML
              </Button>

              <Button variant="outline" onClick={handleDownloadHtml} className="w-full bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Download HTML
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview Panel */}
        <motion.div className="lg:col-span-3" variants={fadeInUp}>
          <Card className="glassmorphism">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Email Preview</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {currentDevice === "desktop" && "Desktop View"}
                  {currentDevice === "tablet" && "Tablet View (768px)"}
                  {currentDevice === "mobile" && "Mobile View (375px)"}
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <div className="bg-gray-50 dark:bg-gray-900 min-h-[800px] p-4 flex justify-center">
                <div
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300"
                  style={{
                    width: getDeviceWidth(),
                    maxWidth: currentDevice === "desktop" ? "800px" : getDeviceWidth(),
                  }}
                >
                  {compiledHtml ? (
                    <iframe
                      srcDoc={compiledHtml}
                      className="w-full h-[700px] border-0"
                      title="Email Preview"
                      sandbox="allow-same-origin"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[700px]">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Compiling template...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
