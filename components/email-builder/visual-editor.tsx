"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Tablet, Eye, Save } from "lucide-react";
import { EmailEditor } from "react-email-editor";

interface VisualEditorProps {
  templateId?: string;
  onSave?: (design: any) => void;
  onPreview?: (html: string) => void;
}

export function VisualEditor({
  templateId,
  onSave,
  onPreview,
}: VisualEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [unlayerInstance, setUnlayerInstance] = useState<any>(null);

  useEffect(() => {
    // Load Unlayer script
    const script = document.createElement("script");
    script.src = "https://editor.unlayer.com/embed.js";
    script.async = true;
    script.onload = initializeUnlayer;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeUnlayer = () => {
    if (!editorRef.current || !window.unlayer) return;

    const unlayer = window.unlayer;

    unlayer.init({
      id: "editor",
      projectId: process.env.NEXT_PUBLIC_UNLAYER_PROJECT_ID || 1234,
      displayMode: "email",
      appearance: {
        theme: "dark",
        panels: {
          tools: {
            dock: "left",
          },
        },
      },
      features: {
        preview: true,
        export: true,
        undo: true,
        redo: true,
      },
      tools: {
        form: {
          enabled: true,
        },
        image: {
          enabled: true,
        },
        button: {
          enabled: true,
        },
        text: {
          enabled: true,
        },
        divider: {
          enabled: true,
        },
        html: {
          enabled: true,
        },
        social: {
          enabled: true,
        },
      },
      blocks: [],
      editor: {
        minRows: 1,
        maxRows: 20,
      },
    });

    // Load existing template if provided
    if (templateId) {
      // In a real app, you'd load the template design from your database
      // unlayer.loadDesign(savedDesign)
    }

    setUnlayerInstance(unlayer);
    setIsLoaded(true);
  };

  const handleSave = () => {
    if (!unlayerInstance) return;

    unlayerInstance.saveDesign((design: any) => {
      onSave?.(design);
    });
  };

  const handleExportHtml = () => {
    if (!unlayerInstance) return;

    unlayerInstance.exportHtml((data: any) => {
      const { design, html } = data;
      onPreview?.(html);
    });
  };

  const handleDeviceChange = (device: "desktop" | "tablet" | "mobile") => {
    setCurrentDevice(device);
    if (!unlayerInstance) return;

    const widths = {
      desktop: "100%",
      tablet: "768px",
      mobile: "375px",
    };

    // This would change the preview width in Unlayer
    // unlayerInstance.setDisplayMode(device)
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <Card className="glassmorphism mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Visual Editor</Badge>
              <div className="flex items-center space-x-2">
                <Button
                  variant={currentDevice === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDeviceChange("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={currentDevice === "tablet" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDeviceChange("tablet")}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={currentDevice === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDeviceChange("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleExportHtml}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor Container */}
      <Card className="glassmorphism flex-1">
        <CardContent className="p-0 h-full">
          <div
            id="editor"
            ref={editorRef}
            className="h-full min-h-[600px]"
            style={{
              width:
                currentDevice === "desktop"
                  ? "100%"
                  : currentDevice === "tablet"
                    ? "768px"
                    : "375px",
              margin: currentDevice !== "desktop" ? "0 auto" : undefined,
            }}
          />
          {!isLoaded && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">
                  Loading visual editor...
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Extend window type for Unlayer
declare global {
  interface Window {
    unlayer: any;
  }
}
