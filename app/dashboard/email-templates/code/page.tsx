"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Save, Eye, Settings, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  compileEmailTemplate,
  validateTemplateCode,
} from "@/lib/email-compiler";
import { toast } from "sonner";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const defaultTemplate = `import { Html, Head, Body, Container, Text, Button, Img } from '@react-email/components'

interface WelcomeEmailProps {
  firstName?: string
  companyName?: string
}

export default function WelcomeEmail({ 
  firstName = 'there',
  companyName = 'DevSend'
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f9fafb' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Img
            src="https://devsend.com/logo.png"
            width="120"
            height="40"
            alt={companyName}
            style={{ margin: '0 auto 20px' }}
          />
          
          <Text style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>
            Welcome to {companyName}, {firstName}!
          </Text>
          
          <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#6b7280' }}>
            We're excited to have you on board. Get started by creating your first 
            email campaign and reaching your audience with beautiful, responsive emails.
          </Text>
          
          <Button
            href="https://devsend.com/dashboard"
            style={{
              backgroundColor: '#6757d9',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-block',
              margin: '20px auto',
            }}
          >
            Get Started
          </Button>
          
          <Text style={{ fontSize: '14px', color: '#9ca3af', textAlign: 'center' }}>
            If you have any questions, feel free to reach out to our support team.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}`;

export default function CodeEditorPage() {
  const [templateName, setTemplateName] = useState("Welcome Email");
  const [templateCode, setTemplateCode] = useState(defaultTemplate);
  const [previewData, setPreviewData] = useState(
    '{"firstName": "John", "companyName": "DevSend"}'
  );
  const [compiledTemplate, setCompiledTemplate] = useState<any>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { currentWorkspace, user } = useAuth();
  const convex = useConvex();

  // Compile template when code or preview data changes
  useEffect(() => {
    const compileTemplate = async () => {
      setIsCompiling(true);
      try {
        const validation = validateTemplateCode(templateCode);
        setValidationErrors(validation.errors);

        if (validation.isValid) {
          const parsedData = JSON.parse(previewData || "{}");
          const compiled = await compileEmailTemplate(templateCode, parsedData);
          setCompiledTemplate(compiled);
        }
      } catch (error) {
        console.error("Compilation error:", error);
        setValidationErrors(["Failed to compile template"]);
      } finally {
        setIsCompiling(false);
      }
    };

    const debounceTimer = setTimeout(compileTemplate, 500);
    return () => clearTimeout(debounceTimer);
  }, [templateCode, previewData]);

  const handleSave = async () => {
    if (!currentWorkspace || !user) {
      toast.error("Please log in to save templates");
      return;
    }

    if (validationErrors.length > 0) {
      toast.error("Please fix validation errors before saving");
      return;
    }

    setIsSaving(true);
    try {
      await convex.mutation(api.templates.createTemplate, {
        workspaceId: currentWorkspace._id,
        name: templateName,
        type: "code",
        content: templateCode,
        previewData,
        createdBy: user.userId,
      });

      toast.success("Template saved successfully!");
    } catch (error) {
      toast.error("Failed to save template");
    } finally {
      setIsSaving(false);
    }
  };

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
              <h1 className="text-3xl font-bold tracking-tight">Code Editor</h1>
              <p className="text-muted-foreground">
                Create email templates with React/TSX
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                isCompiling
                  ? "secondary"
                  : validationErrors.length > 0
                    ? "destructive"
                    : "default"
              }
            >
              {isCompiling ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Compiling
                </>
              ) : validationErrors.length > 0 ? (
                "Errors"
              ) : (
                <>
                  <Play className="mr-1 h-3 w-3" />
                  Live Preview
                </>
              )}
            </Badge>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || validationErrors.length > 0}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Template
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor Panel */}
        <motion.div className="space-y-6" variants={fadeInUp}>
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter template name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="previewData">Preview Data (JSON)</Label>
                <Textarea
                  id="previewData"
                  value={previewData}
                  onChange={(e) => setPreviewData(e.target.value)}
                  placeholder="Enter JSON data for preview"
                  rows={3}
                />
              </div>

              {validationErrors.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-destructive">Validation Errors</Label>
                  <div className="space-y-1">
                    {validationErrors.map((error, index) => (
                      <p key={index} className="text-sm text-destructive">
                        {error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>React Email Template</CardTitle>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Format Code
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Textarea
                  value={templateCode}
                  onChange={(e) => setTemplateCode(e.target.value)}
                  className="font-mono text-sm min-h-[500px] resize-none"
                  placeholder="Write your React email template here..."
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview Panel */}
        <motion.div variants={fadeInUp}>
          <Card className="glassmorphism sticky top-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Live Preview</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Desktop
                  </Button>
                  <Button variant="ghost" size="sm">
                    Mobile
                  </Button>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <div className="bg-gray-50 dark:bg-gray-900 min-h-[600px] p-4">
                {isCompiling ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : compiledTemplate ? (
                  <div
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm max-w-[600px] mx-auto"
                    dangerouslySetInnerHTML={{ __html: compiledTemplate.html }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Fix validation errors to see preview
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
