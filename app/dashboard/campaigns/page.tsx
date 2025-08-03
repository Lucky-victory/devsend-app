"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Filter, Calendar, Users, Send, MoreHorizontal, Play, Pause, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    subject: "",
    templateId: "",
    segment: "all",
    schedule: "now",
  })

  const { currentWorkspace, user } = useAuth()

  const campaigns = useQuery(
    api.campaigns.getCampaigns,
    currentWorkspace ? { workspaceId: currentWorkspace._id } : "skip",
  )

  const templates = useQuery(
    api.templates.getTemplates,
    currentWorkspace ? { workspaceId: currentWorkspace._id } : "skip",
  )

  const createCampaign = useMutation(api.campaigns.createCampaign)
  const sendCampaign = useMutation(api.campaigns.sendCampaign)

  const handleCreateCampaign = async () => {
    if (!currentWorkspace || !user) return

    try {
      const scheduledAt = newCampaign.schedule === "schedule" ? Date.now() + 3600000 : undefined // 1 hour from now

      await createCampaign({
        workspaceId: currentWorkspace._id,
        name: newCampaign.name,
        subject: newCampaign.subject,
        templateId: newCampaign.templateId as any,
        contactSegment: JSON.stringify({ segment: newCampaign.segment }),
        scheduledAt,
        createdBy: user._id,
      })

      toast.success("Campaign created successfully!")
      setIsCreateDialogOpen(false)
      setNewCampaign({ name: "", subject: "", templateId: "", segment: "all", schedule: "now" })
    } catch (error) {
      toast.error("Failed to create campaign")
    }
  }

  const handleSendCampaign = async (campaignId: string) => {
    try {
      await sendCampaign({ campaignId: campaignId as any })
      toast.success("Campaign is being sent!")
    } catch (error) {
      toast.error("Failed to send campaign")
    }
  }

  if (!currentWorkspace) {
    return <div>Please select a workspace</div>
  }

  if (!campaigns || !templates) {
    return <div>Loading campaigns...</div>
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || campaign.status === activeTab
    return matchesSearch && matchesTab
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "default"
      case "scheduled":
        return "secondary"
      case "sending":
        return "default"
      case "draft":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <motion.div className="space-y-8" initial="initial" animate="animate" variants={staggerContainer}>
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
            <p className="text-muted-foreground">Create and manage your email campaigns</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
                <DialogDescription>Set up your email campaign with a template and audience segment.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input
                    id="campaignName"
                    placeholder="Enter campaign name"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Enter email subject"
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template">Email Template</Label>
                  <Select
                    value={newCampaign.templateId}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, templateId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template._id} value={template._id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="segment">Audience Segment</Label>
                  <Select
                    value={newCampaign.segment}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, segment: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subscribers</SelectItem>
                      <SelectItem value="new">New Users</SelectItem>
                      <SelectItem value="active">Active Users</SelectItem>
                      <SelectItem value="inactive">Inactive Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule">Schedule</Label>
                  <Select
                    value={newCampaign.schedule}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, schedule: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="When to send" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Send Now</SelectItem>
                      <SelectItem value="schedule">Schedule for Later</SelectItem>
                      <SelectItem value="draft">Save as Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateCampaign}
                  disabled={!newCampaign.name || !newCampaign.subject || !newCampaign.templateId}
                >
                  Create Campaign
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Rest of the component remains the same but uses real data */}
      {/* Filters */}
      <motion.div variants={fadeInUp}>
        <Card className="glassmorphism">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative max-w-sm flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="sent">Sent</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                    <TabsTrigger value="draft">Drafts</TabsTrigger>
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

      {/* Campaigns List */}
      <motion.div className="space-y-4" variants={staggerContainer}>
        {filteredCampaigns.map((campaign) => (
          <motion.div key={campaign._id} variants={fadeInUp}>
            <Card className="glassmorphism hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">{campaign.name}</h3>
                      <Badge variant={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                      {campaign.status === "sending" && (
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span>Sending...</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Send className="h-4 w-4" />
                        <span>{campaign.template}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>All Subscribers</span>
                      </div>
                      {campaign.scheduledAt && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(campaign.scheduledAt).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-8">
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-6 text-center">
                      <div>
                        <p className="text-2xl font-bold">{campaign.stats.totalSent.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Sent</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{campaign.stats.totalOpened.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Opened</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{campaign.stats.totalClicked.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Clicked</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{campaign.stats.openRate.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">Open Rate</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {campaign.status === "draft" && (
                        <Button size="sm" onClick={() => handleSendCampaign(campaign._id)}>
                          <Play className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                      )}
                      {campaign.status === "scheduled" && (
                        <Button size="sm" variant="outline">
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>View Report</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredCampaigns.length === 0 && (
        <motion.div variants={fadeInUp}>
          <Card className="glassmorphism">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-center space-y-4">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Send className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No campaigns found</h3>
                  <p className="text-muted-foreground">Create your first email campaign to get started</p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>Create Campaign</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
