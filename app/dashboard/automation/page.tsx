"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Play, Pause, BarChart3, Users, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WorkflowBuilder } from "@/components/automation/workflow-builder";
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

export default function AutomationPage() {
  const [isWorkflowDialogOpen, setIsWorkflowDialogOpen] = useState(false);
  const { currentWorkspace, user } = useAuth();
  const workflows = useQuery(
    api.automation.getWorkflows,
    currentWorkspace ? { workspaceId: currentWorkspace?._id } : "skip"
  );

  const abTests = useQuery(
    api.automation.getAbTests,
    currentWorkspace ? { workspaceId: currentWorkspace?._id } : "skip"
  );

  const createWorkflow = useMutation(api.automation.createWorkflow);

  const handleCreateWorkflow = async (workflowData: any) => {
    if (!currentWorkspace || !user) return;

    try {
      await createWorkflow({
        workspaceId: currentWorkspace?._id,
        ...workflowData,
        createdBy: user._id,
      });
      toast.success("Workflow created successfully!");
      setIsWorkflowDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create workflow");
    }
  };

  if (!currentWorkspace) {
    return <div>Please select a workspace</div>;
  }

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
            <h1 className="text-3xl font-bold tracking-tight">Automation</h1>
            <p className="text-muted-foreground">
              Create automated email workflows and A/B tests
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog
              open={isWorkflowDialogOpen}
              onOpenChange={setIsWorkflowDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Workflow
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Create Automation Workflow</DialogTitle>
                </DialogHeader>
                <WorkflowBuilder onSave={handleCreateWorkflow} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid gap-4 md:grid-cols-4"
        variants={staggerContainer}
      >
        {[
          {
            title: "Active Workflows",
            value: workflows?.filter((w) => w.isActive).length || 0,
            icon: Play,
          },
          { title: "Total Subscribers", value: "12,543", icon: Users },
          { title: "Emails Sent", value: "45,231", icon: Mail },
          { title: "Avg. Open Rate", value: "24.8%", icon: BarChart3 },
        ].map((stat, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card className="glassmorphism">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="ab-tests">A/B Tests</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-6">
          <motion.div className="grid gap-6" variants={staggerContainer}>
            {workflows?.map((workflow) => (
              <motion.div key={workflow._id} variants={fadeInUp}>
                <Card className="glassmorphism">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{workflow.name}</span>
                          <Badge
                            variant={
                              workflow.isActive ? "default" : "secondary"
                            }
                          >
                            {workflow.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {workflow.type} workflow • {workflow.steps.length}{" "}
                          steps
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Analytics
                        </Button>
                        <Button
                          size="sm"
                          variant={workflow.isActive ? "secondary" : "default"}
                        >
                          {workflow.isActive ? (
                            <>
                              <Pause className="mr-2 h-4 w-4" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>0 subscribers</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>0 emails sent</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          Created{" "}
                          {new Date(workflow.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {(!workflows || workflows.length === 0) && (
              <motion.div variants={fadeInUp}>
                <Card className="glassmorphism">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="text-center space-y-4">
                      <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <Play className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          No workflows yet
                        </h3>
                        <p className="text-muted-foreground">
                          Create your first automation workflow to get started
                        </p>
                      </div>
                      <Button onClick={() => setIsWorkflowDialogOpen(true)}>
                        Create Workflow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="ab-tests" className="space-y-6">
          <motion.div variants={fadeInUp}>
            <Card className="glassmorphism">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      A/B Testing Coming Soon
                    </h3>
                    <p className="text-muted-foreground">
                      Test different versions of your emails to optimize
                      performance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <motion.div variants={fadeInUp}>
            <Card className="glassmorphism">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Advanced Segmentation
                    </h3>
                    <p className="text-muted-foreground">
                      Create targeted segments based on behavior and
                      demographics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
