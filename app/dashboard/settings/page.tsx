"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { User, Key, Users, Globe, Bell, Trash2, Plus } from "lucide-react"
import { ThemeToggle } from "@/components/shared/theme-toggle"

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

const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Owner",
    avatar: "/placeholder.svg?height=32&width=32",
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Admin",
    avatar: "/placeholder.svg?height=32&width=32",
    lastActive: "1 day ago",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Editor",
    avatar: "/placeholder.svg?height=32&width=32",
    lastActive: "3 days ago",
  },
]

export default function SettingsPage() {
  return (
    <motion.div className="space-y-8" initial="initial" animate="animate" variants={staggerContainer}>
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account and workspace preferences</p>
        </div>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <motion.div variants={fadeInUp}>
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline">Change Avatar</Button>
                    <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    defaultValue="Full-stack developer passionate about building great email experiences."
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Theme Preference</Label>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                    </div>
                    <ThemeToggle />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="workspace" className="space-y-6">
          <motion.div variants={fadeInUp}>
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Workspace Settings</span>
                </CardTitle>
                <CardDescription>Configure your workspace and domain settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="workspaceName">Workspace Name</Label>
                  <Input id="workspaceName" defaultValue="DevSend Workspace" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workspaceUrl">Workspace URL</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      devsend.com/
                    </span>
                    <Input id="workspaceUrl" defaultValue="my-workspace" className="rounded-l-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromName">Default From Name</Label>
                  <Input id="fromName" defaultValue="DevSend Team" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromEmail">Default From Email</Label>
                  <Input id="fromEmail" type="email" defaultValue="hello@devsend.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="replyTo">Reply-To Email</Label>
                  <Input id="replyTo" type="email" defaultValue="support@devsend.com" />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Domain Verification</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">devsend.com</p>
                        <p className="text-sm text-muted-foreground">Primary sending domain</p>
                      </div>
                      <Badge>Verified</Badge>
                    </div>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Domain
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <motion.div variants={fadeInUp}>
            <Card className="glassmorphism">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Team Members</span>
                    </CardTitle>
                    <CardDescription>Manage your team members and their permissions</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Invite Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                          <p className="text-xs text-muted-foreground">Last active {member.lastActive}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select defaultValue={member.role.toLowerCase()}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        {member.role !== "Owner" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove team member</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove {member.name} from your team? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive text-destructive-foreground">
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <motion.div variants={fadeInUp}>
            <Card className="glassmorphism">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Key className="h-5 w-5" />
                      <span>API Keys</span>
                    </CardTitle>
                    <CardDescription>Manage your API keys for integrations and automation</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create API Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Production API Key</p>
                      <p className="text-sm text-muted-foreground font-mono">ds_live_••••••••••••••••</p>
                      <p className="text-xs text-muted-foreground">Created on Jan 15, 2024</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge>Active</Badge>
                      <Button variant="outline" size="sm">
                        Copy
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Development API Key</p>
                      <p className="text-sm text-muted-foreground font-mono">ds_test_••••••••••••••••</p>
                      <p className="text-xs text-muted-foreground">Created on Jan 10, 2024</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Test</Badge>
                      <Button variant="outline" size="sm">
                        Copy
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Webhook Settings</h3>
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input id="webhookUrl" placeholder="https://your-app.com/webhooks/devsend" />
                  </div>
                  <div className="space-y-2">
                    <Label>Events</Label>
                    <div className="space-y-2">
                      {[
                        "email.sent",
                        "email.delivered",
                        "email.opened",
                        "email.clicked",
                        "email.bounced",
                        "email.complained",
                      ].map((event) => (
                        <div key={event} className="flex items-center space-x-2">
                          <Switch id={event} />
                          <Label htmlFor={event} className="font-mono text-sm">
                            {event}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline">Test Webhook</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <motion.div variants={fadeInUp}>
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Campaign Reports",
                        description: "Get notified when your campaigns are sent and their performance reports",
                        defaultChecked: true,
                      },
                      {
                        title: "Bounce Notifications",
                        description: "Receive alerts when emails bounce or fail to deliver",
                        defaultChecked: true,
                      },
                      {
                        title: "Weekly Summary",
                        description: "Get a weekly summary of your email campaign performance",
                        defaultChecked: false,
                      },
                      {
                        title: "Team Activity",
                        description: "Notifications about team member actions and changes",
                        defaultChecked: true,
                      },
                    ].map((notification, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                        <Switch defaultChecked={notification.defaultChecked} />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Push Notifications</h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Browser Notifications",
                        description: "Show notifications in your browser when important events occur",
                        defaultChecked: false,
                      },
                      {
                        title: "Mobile Push",
                        description: "Send push notifications to your mobile device",
                        defaultChecked: false,
                      },
                    ].map((notification, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                        <Switch defaultChecked={notification.defaultChecked} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
