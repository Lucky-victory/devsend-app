"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, Clock, GitBranch, Trash2, Play, Pause } from "lucide-react"

interface WorkflowStep {
  id: string
  type: "email" | "wait" | "condition"
  templateId?: string
  delay?: number
  conditions?: any
}

interface WorkflowBuilderProps {
  onSave?: (workflow: any) => void
}

export function WorkflowBuilder({ onSave }: WorkflowBuilderProps) {
  const [workflowName, setWorkflowName] = useState("")
  const [triggerType, setTriggerType] = useState<string>("")
  const [steps, setSteps] = useState<WorkflowStep[]>([])

  const addStep = (type: "email" | "wait" | "condition") => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      type,
      ...(type === "wait" && { delay: 24 }),
    }
    setSteps([...steps, newStep])
  }

  const removeStep = (stepId: string) => {
    setSteps(steps.filter((step) => step.id !== stepId))
  }

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    setSteps(steps.map((step) => (step.id === stepId ? { ...step, ...updates } : step)))
  }

  const handleSave = () => {
    const workflow = {
      name: workflowName,
      type: "drip",
      trigger: {
        type: triggerType,
        conditions: {},
      },
      steps: steps.map((step) => ({
        type: step.type,
        templateId: step.templateId,
        delay: step.delay,
        conditions: step.conditions,
      })),
      isActive: false,
    }
    onSave?.(workflow)
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "wait":
        return <Clock className="h-4 w-4" />
      case "condition":
        return <GitBranch className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Workflow Settings */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Workflow Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workflowName">Workflow Name</Label>
              <Input
                id="workflowName"
                placeholder="Welcome Series"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trigger">Trigger</Label>
              <Select value={triggerType} onValueChange={setTriggerType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="signup">User Signup</SelectItem>
                  <SelectItem value="tag_added">Tag Added</SelectItem>
                  <SelectItem value="date">Specific Date</SelectItem>
                  <SelectItem value="behavior">User Behavior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <Card className="glassmorphism">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Workflow Steps</CardTitle>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={() => addStep("email")}>
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Button size="sm" variant="outline" onClick={() => addStep("wait")}>
                <Clock className="mr-2 h-4 w-4" />
                Wait
              </Button>
              <Button size="sm" variant="outline" onClick={() => addStep("condition")}>
                <GitBranch className="mr-2 h-4 w-4" />
                Condition
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {steps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No steps added yet. Click the buttons above to add workflow steps.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="relative">
                  <Card className="border-2 border-dashed">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getStepIcon(step.type)}
                          <Badge variant="outline">
                            Step {index + 1}: {step.type}
                          </Badge>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => removeStep(step.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {step.type === "email" && (
                        <div className="space-y-2">
                          <Label>Email Template</Label>
                          <Select
                            value={step.templateId || ""}
                            onValueChange={(value) => updateStep(step.id, { templateId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select template" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="welcome">Welcome Email</SelectItem>
                              <SelectItem value="onboarding">Onboarding Email</SelectItem>
                              <SelectItem value="newsletter">Newsletter</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {step.type === "wait" && (
                        <div className="space-y-2">
                          <Label>Wait Duration (hours)</Label>
                          <Input
                            type="number"
                            value={step.delay || 24}
                            onChange={(e) => updateStep(step.id, { delay: Number.parseInt(e.target.value) })}
                            min="1"
                            max="8760"
                          />
                        </div>
                      )}

                      {step.type === "condition" && (
                        <div className="space-y-2">
                          <Label>Condition</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="opened">Email Opened</SelectItem>
                              <SelectItem value="clicked">Email Clicked</SelectItem>
                              <SelectItem value="tag">Has Tag</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {index < steps.length - 1 && (
                    <div className="flex justify-center py-2">
                      <div className="w-px h-6 bg-border" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline">
          <Pause className="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
        <Button onClick={handleSave} disabled={!workflowName || steps.length === 0}>
          <Play className="mr-2 h-4 w-4" />
          Activate Workflow
        </Button>
      </div>
    </div>
  )
}
