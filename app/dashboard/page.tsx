"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, Send, Plus, Eye, MousePointer } from "lucide-react"

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

const campaignData = [
  { name: "Jan", sent: 4000, opened: 2400, clicked: 800 },
  { name: "Feb", sent: 3000, opened: 1398, clicked: 600 },
  { name: "Mar", sent: 2000, opened: 1800, clicked: 700 },
  { name: "Apr", sent: 2780, opened: 1908, clicked: 850 },
  { name: "May", sent: 1890, opened: 1200, clicked: 400 },
  { name: "Jun", sent: 2390, opened: 1600, clicked: 650 },
]

const deviceData = [
  { name: "Desktop", value: 45, color: "#6757D9" },
  { name: "Mobile", value: 35, color: "#3FBDF1" },
  { name: "Tablet", value: 20, color: "#10B981" },
]

export default function DashboardPage() {
  return (
    <motion.div className="space-y-8" initial="initial" animate="animate" variants={staggerContainer}>
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your campaigns.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" variants={staggerContainer}>
        {[
          {
            title: "Total Contacts",
            value: "12,543",
            change: "+12%",
            icon: Users,
            color: "text-blue-600",
          },
          {
            title: "Campaigns Sent",
            value: "89",
            change: "+8%",
            icon: Send,
            color: "text-green-600",
          },
          {
            title: "Open Rate",
            value: "24.5%",
            change: "+2.1%",
            icon: Eye,
            color: "text-purple-600",
          },
          {
            title: "Click Rate",
            value: "3.2%",
            change: "+0.5%",
            icon: MousePointer,
            color: "text-orange-600",
          },
        ].map((stat, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card className="glassmorphism">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={fadeInUp}>
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Email metrics over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={campaignData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sent" fill="#6757D9" name="Sent" />
                  <Bar dataKey="opened" fill="#3FBDF1" name="Opened" />
                  <Bar dataKey="clicked" fill="#10B981" name="Clicked" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>How your audience opens emails</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-4">
                {deviceData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={fadeInUp}>
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Your latest email campaigns and their performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Welcome Series - Part 1",
                  status: "Sent",
                  sent: "2,543",
                  opened: "1,234",
                  clicked: "156",
                  date: "2 hours ago",
                },
                {
                  name: "Product Update Newsletter",
                  status: "Scheduled",
                  sent: "0",
                  opened: "0",
                  clicked: "0",
                  date: "Tomorrow at 9:00 AM",
                },
                {
                  name: "Black Friday Sale",
                  status: "Draft",
                  sent: "0",
                  opened: "0",
                  clicked: "0",
                  date: "Last edited 1 day ago",
                },
              ].map((campaign, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{campaign.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <Badge
                        variant={
                          campaign.status === "Sent"
                            ? "default"
                            : campaign.status === "Scheduled"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {campaign.status}
                      </Badge>
                      <span>{campaign.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="font-medium">{campaign.sent}</p>
                      <p className="text-muted-foreground">Sent</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{campaign.opened}</p>
                      <p className="text-muted-foreground">Opened</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{campaign.clicked}</p>
                      <p className="text-muted-foreground">Clicked</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
