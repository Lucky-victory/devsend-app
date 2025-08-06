"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useAuth } from "@/app/providers/auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  compileEmailTemplate,
  validateTemplateCode,
} from "@/lib/email-compiler";
import { toast } from "sonner";
import MonacoEditor from "@monaco-editor/react";
import { VisualEditor } from "@/components/email-builder/visual-editor";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

interface EditPageProps {
  params: {
    templateId: Id<"templates">;
  };
}

export default function EditPage({ params: _params }: EditPageProps) {
  const router = useRouter();
  const params = use(_params as any) as EditPageProps["params"];
  const [templateName, setTemplateName] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [templateStatus, setTemplateStatus] = useState<"draft" | "published">(
    "draft"
  );
  const [previewData, setPreviewData] = useState(
    '{"firstName": "John", "companyName": "DevSend"}'
  );
  const [compiledTemplate, setCompiledTemplate] = useState<any>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { currentWorkspace } = useAuth();

  const template = useQuery(api.templates.getTemplate, {
    templateId: params.templateId as any,
  });

  const updateTemplate = useMutation(api.templates.updateTemplate);

  // Load template data when it's available
  useEffect(() => {
    if (template) {
      setTemplateName(template.name);
      setTemplateContent(template.content);
      setTemplateStatus(template.status as "draft" | "published");
      if (template.previewData) {
        setPreviewData(template.previewData);
      }
    }
  }, [template]);

  // Compile template when code or preview data changes (only for code templates)
  useEffect(() => {
    if (!template || template.type !== "code") return;

    const compileTemplate = async () => {
      setIsCompiling(true);
      try {
        const validation = validateTemplateCode(templateContent);
        setValidationErrors(validation.errors);

        if (validation.isValid) {
          const parsedData = JSON.parse(previewData || "{}");
          const compiled = await compileEmailTemplate(
            templateContent,
            parsedData
          );
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
  }, [templateContent, previewData, template]);

  const handleSave = async () => {
    if (!template) return;

    if (template.type === "code" && validationErrors.length > 0) {
      toast.error("Please fix validation errors before saving");
      return;
    }

    setIsSaving(true);
    try {
      await updateTemplate({
        templateId: params.templateId as any,
        name: templateName,
        content: templateContent,
        previewData: template.type === "code" ? previewData : undefined,
        status: templateStatus,
      });

      toast.success("Template updated successfully!");
    } catch (error) {
      toast.error("Failed to update template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleVisualSave = async (design: any) => {
    if (!template) return;

    setIsSaving(true);
    try {
      await updateTemplate({
        templateId: params.templateId as any,
        name: templateName,
        content: JSON.stringify(design),
        status: templateStatus,
      });

      setTemplateContent(JSON.stringify(design));
      toast.success("Template updated successfully!");
    } catch (error) {
      toast.error("Failed to update template");
    } finally {
      setIsSaving(false);
    }
  };

  if (!template) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading template...</p>
        </div>
      </div>
    );
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
              <h1 className="text-3xl font-bold tracking-tight">
                Edit Template
              </h1>
              <p className="text-muted-foreground">
                Modify your {template.type} email template
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={template.type === "code" ? "default" : "secondary"}>
              {template.type === "code" ? "Code" : "Visual"}
            </Badge>
            <Button variant="outline" asChild>
              <Link
                href={`/dashboard/email-templates/${params.templateId}/preview`}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Link>
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Template Settings */}
      <motion.div variants={fadeInUp}>
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Template Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
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
              <Label htmlFor="templateStatus">Status</Label>
              <Select
                value={templateStatus}
                onValueChange={(value: "draft" | "published") =>
                  setTemplateStatus(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Last Modified</Label>
              <div className="text-sm text-muted-foreground pt-2">
                {new Date(template.updatedAt).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Editor Content */}
      {template.type === "code" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Code Editor Panel */}
          <motion.div className="space-y-6" variants={fadeInUp}>
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Preview Data (JSON)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={previewData}
                  onChange={(e) => setPreviewData(e.target.value)}
                  placeholder="Enter JSON data for preview"
                  rows={4}
                  className="font-mono text-sm"
                />
                {validationErrors.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label className="text-destructive">
                      Validation Errors
                    </Label>
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
                <CardTitle>React Email Template</CardTitle>
              </CardHeader>
              <CardContent>
                <MonacoEditor
                  language="typescript"
                  theme="vs-dark"
                  value={templateContent}
                  height="500px"
                  onChange={(value) => setTemplateContent(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    wordWrap: "on",
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview Panel */}
          <motion.div variants={fadeInUp}>
            <Card className="glassmorphism sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Live Preview</CardTitle>
                  <Badge
                    variant={
                      isCompiling
                        ? "secondary"
                        : validationErrors.length > 0
                          ? "destructive"
                          : "default"
                    }
                  >
                    {isCompiling
                      ? "Compiling..."
                      : validationErrors.length > 0
                        ? "Errors"
                        : "Ready"}
                  </Badge>
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
                      dangerouslySetInnerHTML={{
                        __html: compiledTemplate.html,
                      }}
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
      ) : (
        // Visual Editor
        <motion.div variants={fadeInUp} className="h-[800px]">
          <VisualEditor
            templateId={params.templateId}
            onSave={handleVisualSave}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
