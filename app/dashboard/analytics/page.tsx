"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, TrendingDown, Mail, Eye, MousePointer, Users, Calendar, Download } from "lucide-react"

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

const campaignPerformance = [
  { name: "Jan", sent: 4000, opened: 2400, clicked: 800, bounced: 120 },
  { name: "Feb", sent: 3000, opened: 1398, clicked: 600, bounced: 90 },
  { name: "Mar", sent: 2000, opened: 1800, clicked: 700, bounced: 60 },
  { name: "Apr", sent: 2780, opened: 1908, clicked: 850, bounced: 85 },
  { name: "May", sent: 1890, opened: 1200, clicked: 400, bounced: 55 },
  { name: "Jun", sent: 2390, opened: 1600, clicked: 650, bounced: 70 },
]

const deviceData = [
  { name: "Desktop", value: 45, color: "#6757D9" },
  { name: "Mobile", value: 35, color: "#3FBDF1" },
  { name: "Tablet", value: 20, color: "#10B981" },
]

const topCampaigns = [
  { name: "Welcome Series", opens: 3421, clicks: 445, rate: 13.0, trend: "up" },
  { name: "Newsletter #12", opens: 2567, clicks: 234, rate: 9.1, trend: "up" },
  { name: "Product Update", opens: 1234, clicks: 156, rate: 12.6, trend: "down" },
  { name: "Black Friday", opens: 4532, clicks: 678, rate: 15.0, trend: "up" },
]

const engagementData = [
  { time: "00:00", opens: 120, clicks: 15 },
  { time: "04:00", opens: 80, clicks: 8 },
  { time: "08:00", opens: 450, clicks: 65 },
  { time: "12:00", opens: 380, clicks: 45 },
  { time: "16:00", opens: 320, clicks: 38 },
  { time: "20:00", opens: 280, clicks: 32 },
]

export default function AnalyticsPage() {
  return (
    <motion.div className="space-y-8" initial="initial" animate="animate" variants={staggerContainer}>
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Track your email campaign performance and engagement</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 Days
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" variants={staggerContainer}>
        {[
          {
            title: "Total Sent",
            value: "45,231",
            change: "+12.5%",
            trend: "up",
            icon: Mail,
            color: "text-blue-600",
          },
          {
            title: "Open Rate",
            value: "24.8%",
            change: "+2.1%",
            trend: "up",
            icon: Eye,
            color: "text-green-600",
          },
          {
            title: "Click Rate",
            value: "3.4%",
            change: "-0.3%",
            trend: "down",
            icon: MousePointer,
            color: "text-orange-600",
          },
          {
            title: "Subscribers",
            value: "12,543",
            change: "+8.2%",
            trend: "up",
            icon: Users,
            color: "text-purple-600",
          },
        ].map((metric, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card className="glassmorphism">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center text-xs">
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>{metric.change}</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div variants={fadeInUp}>
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                  <CardDescription>Email metrics over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={campaignPerformance}>
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
                        <span className="text-sm">
                          {item.name} ({item.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <motion.div variants={fadeInUp}>
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Top Performing Campaigns</CardTitle>
                <CardDescription>Your best campaigns by engagement rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCampaigns.map((campaign, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{campaign.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{campaign.opens.toLocaleString()} opens</span>
                          <span>{campaign.clicks.toLocaleString()} clicks</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{campaign.rate}% CTR</Badge>
                        {campaign.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <motion.div variants={fadeInUp}>
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Engagement by Time</CardTitle>
                <CardDescription>When your audience is most active</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="opens"
                      stackId="1"
                      stroke="#6757D9"
                      fill="#6757D9"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      stackId="2"
                      stroke="#3FBDF1"
                      fill="#3FBDF1"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div variants={fadeInUp}>
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Subscriber Growth</CardTitle>
                  <CardDescription>New subscribers over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={campaignPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="sent" stroke="#6757D9" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Audience Segments</CardTitle>
                  <CardDescription>Breakdown of your subscriber base</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Active Users", count: 8234, percentage: 65.6 },
                    { name: "New Subscribers", count: 2341, percentage: 18.7 },
                    { name: "Inactive Users", count: 1456, percentage: 11.6 },
                    { name: "VIP Members", count: 512, percentage: 4.1 },
                  ].map((segment, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{segment.name}</p>
                        <p className="text-sm text-muted-foreground">{segment.count.toLocaleString()} contacts</p>
                      </div>
                      <Badge variant="outline">{segment.percentage}%</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
