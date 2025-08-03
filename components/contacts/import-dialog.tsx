"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Download, XCircle, AlertCircle } from "lucide-react"
import { processContactsCSV, generateSampleCSV, type ContactImportResult } from "@/lib/csv-processor"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
}

export function ImportDialog({ open, onOpenChange, workspaceId }: ImportDialogProps) {
  const [csvContent, setCsvContent] = useState("")
  const [importResult, setImportResult] = useState<ContactImportResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [validContacts, setValidContacts] = useState<any[]>([])

  const importContacts = useMutation(api.contacts.importContacts)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setCsvContent(content)
    }
    reader.readAsText(file)
  }

  const handleProcessCSV = async () => {
    if (!csvContent.trim()) {
      toast.error("Please upload a CSV file or paste CSV content")
      return
    }

    setIsProcessing(true)
    try {
      const result = await processContactsCSV(csvContent)
      setImportResult(result)

      // Extract valid contacts for import
      const lines = csvContent.split("\n")
      const headers = lines[0].split(",").map((h) => h.trim())
      const validContactsData = lines
        .slice(1)
        .filter((line, index) => {
          const hasError = result.errorDetails.some((error) => error.row === index + 2)
          return !hasError && line.trim()
        })
        .map((line) => {
          const values = line.split(",").map((v) => v.trim())
          const contact: any = {}
          headers.forEach((header, index) => {
            if (values[index]) {
              contact[header] = values[index]
            }
          })
          return contact
        })

      setValidContacts(validContactsData)
    } catch (error) {
      toast.error("Failed to process CSV file")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImport = async () => {
    if (!validContacts.length) return

    setIsImporting(true)
    try {
      const contactsToImport = validContacts.map((contact) => ({
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        tags: contact.tags ? contact.tags.split(",").map((t: string) => t.trim()) : undefined,
      }))

      const result = await importContacts({
        workspaceId: workspaceId as any,
        contacts: contactsToImport,
      })

      toast.success(`Successfully imported ${result.imported} contacts!`)
      onOpenChange(false)

      // Reset state
      setCsvContent("")
      setImportResult(null)
      setValidContacts([])
    } catch (error) {
      toast.error("Failed to import contacts")
    } finally {
      setIsImporting(false)
    }
  }

  const downloadSample = () => {
    const sampleCSV = generateSampleCSV()
    const blob = new Blob([sampleCSV], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sample-contacts.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Upload CSV File</Label>
              <Button variant="outline" size="sm" onClick={downloadSample}>
                <Download className="mr-2 h-4 w-4" />
                Download Sample
              </Button>
            </div>

            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <div className="mt-4">
                  <Label htmlFor="csv-upload" className="cursor-pointer">
                    <span className="text-primary hover:underline">Click to upload</span> or drag and drop
                  </Label>
                  <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                </div>
                <p className="text-sm text-muted-foreground mt-2">CSV files only</p>
              </div>
            </div>

            {/* CSV Content */}
            <div className="space-y-2">
              <Label htmlFor="csv-content">Or paste CSV content</Label>
              <Textarea
                id="csv-content"
                placeholder="email,firstName,lastName,tags&#10;john@example.com,John,Doe,developer&#10;jane@example.com,Jane,Smith,designer"
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                rows={6}
                className="font-mono text-sm"
              />
            </div>

            <Button onClick={handleProcessCSV} disabled={!csvContent.trim() || isProcessing} className="w-full">
              {isProcessing ? "Processing..." : "Process CSV"}
            </Button>
          </div>

          {/* Import Results */}
          {importResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{importResult.success}</div>
                  <div className="text-sm text-muted-foreground">Valid</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{importResult.errors}</div>
                  <div className="text-sm text-muted-foreground">Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{importResult.duplicates}</div>
                  <div className="text-sm text-muted-foreground">Duplicates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{importResult.total}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>

              {importResult.errorDetails.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">Issues found:</p>
                      <div className="max-h-32 overflow-auto space-y-1">
                        {importResult.errorDetails.slice(0, 10).map((error, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <XCircle className="h-3 w-3 text-red-500" />
                            <span>
                              Row {error.row}: {error.email} - {error.error}
                            </span>
                          </div>
                        ))}
                        {importResult.errorDetails.length > 10 && (
                          <p className="text-sm text-muted-foreground">
                            ... and {importResult.errorDetails.length - 10} more errors
                          </p>
                        )}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {importResult.success > 0 && (
                <Button onClick={handleImport} disabled={isImporting} className="w-full">
                  {isImporting ? "Importing..." : `Import ${importResult.success} Valid Contacts`}
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
