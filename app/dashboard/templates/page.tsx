"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Code,
  Palette,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useAuth } from "@/app/providers/auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { currentWorkspace } = useAuth();

  const templates = useQuery(
    api.templates.getTemplates,
    currentWorkspace ? { workspaceId: currentWorkspace._id } : "skip"
  );

  const deleteTemplate = useMutation(api.templates.deleteTemplate);

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteTemplate({ templateId: templateId as any });
      toast.success("Template deleted successfully");
    } catch (error) {
      toast.error("Failed to delete template");
    }
  };

  if (!currentWorkspace) {
    return <div>Please select a workspace</div>;
  }

  if (!templates) {
    return <div>Loading templates...</div>;
  }

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || template.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <motion.div
      className="space-y-8"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
            <p className="text-muted-foreground">
              Create and manage your email templates
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/templates/visual">
                <Palette className="mr-2 h-4 w-4" />
                Visual Editor
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/templates/code">
                <Code className="mr-2 h-4 w-4" />
                Code Editor
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeInUp}>
        <Card className="glassmorphism">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative max-w-sm flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="visual">Visual</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Templates Grid */}
      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
      >
        {filteredTemplates.map((template) => (
          <motion.div key={template._id} variants={fadeInUp}>
            <Card className="glassmorphism hover:shadow-xl transition-all duration-300 group">
              <div className="relative">
                <img
                  src={
                    template.thumbnail ||
                    "/placeholder.svg?height=200&width=300"
                  }
                  alt={template.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center space-x-2">
                  <Button size="sm" variant="secondary" asChild>
                    <Link href={`/dashboard/templates/${template._id}/preview`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Link>
                  </Button>
                  <Button size="sm" variant="secondary" asChild>
                    <Link href={`/dashboard/templates/${template._id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Plus className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteTemplate(template._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={template.type === "code" ? "default" : "secondary"}
                  >
                    {template.type === "code" ? (
                      <>
                        <Code className="mr-1 h-3 w-3" />
                        Code
                      </>
                    ) : (
                      <>
                        <Palette className="mr-1 h-3 w-3" />
                        Visual
                      </>
                    )}
                  </Badge>
                  <Badge
                    variant={
                      template.status === "published" ? "default" : "outline"
                    }
                  >
                    {template.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Opens</span>
                    <span className="font-medium">
                      {template.opens?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Clicks</span>
                    <span className="font-medium">
                      {template.clicks?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Modified</span>
                    <span className="font-medium">
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <motion.div variants={fadeInUp}>
          <Card className="glassmorphism">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-center space-y-4">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No templates found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or create a new template
                  </p>
                </div>
                <Button asChild>
                  <Link href="/dashboard/templates/code">Create Template</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
