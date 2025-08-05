"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { VisualEditor } from "@/components/email-builder/visual-editor";
import { useAuth } from "@/app/providers/auth";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function VisualEditorPage() {
  const [templateName, setTemplateName] = useState("Visual Email Template");
  const [templateDesign, setTemplateDesign] = useState<any>(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const { currentWorkspace, user } = useAuth();
  const createTemplate = useMutation(api.templates.createTemplate);

  const handleSave = async (design: any) => {
    if (!currentWorkspace || !user) {
      toast.error("Please log in to save templates");
      return;
    }

    setIsSaving(true);
    try {
      await createTemplate({
        workspaceId: currentWorkspace._id,
        name: templateName,
        type: "visual",
        content: JSON.stringify(design),
        createdBy: user._id,
      });

      setTemplateDesign(design);
      toast.success("Template saved successfully!");
    } catch (error) {
      toast.error("Failed to save template");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = (html: string) => {
    setPreviewHtml(html);
    setIsPreviewOpen(true);
  };

  const handleSendTest = async () => {
    if (!testEmail || !previewHtml) {
      toast.error("Please enter a test email and generate preview first");
      return;
    }

    setIsSendingTest(true);
    try {
      // In a real app, you'd call your email sending API
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      toast.success(`Test email sent to ${testEmail}!`);
    } catch (error) {
      toast.error("Failed to send test email");
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <motion.div
      className="h-screen flex flex-col"
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/email-templates">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Visual Email Builder
              </h1>
              <p className="text-muted-foreground">
                Create beautiful emails with drag-and-drop
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-64"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Send className="mr-2 h-4 w-4" />
                  Test Email
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Test Email</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="testEmail">Test Email Address</Label>
                    <Input
                      id="testEmail"
                      type="email"
                      placeholder="test@example.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleSendTest}
                    disabled={isSendingTest}
                    className="w-full"
                  >
                    {isSendingTest ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Send Test Email
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      {/* Editor */}
      <motion.div variants={fadeInUp} className="flex-1 p-6">
        <VisualEditor onSave={handleSave} onPreview={handlePreview} />
      </motion.div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <iframe
              srcDoc={previewHtml}
              className="w-full h-[600px] border rounded-lg"
              title="Email Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
