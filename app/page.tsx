"use client"

import { motion } from "framer-motion"
import { ArrowRight, Code2, Mail, BarChart3, Zap, Users, CheckCircle, Play, Star, Palette, Target } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/shared/theme-toggle"

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
}

const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
}

const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleOnHover = {
  whileHover: { scale: 1.02 },
  transition: { duration: 0.2 },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/3">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Mail className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              DevSend
            </span>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Features
            </Link>
            <Link
              href="#use-cases"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Use Cases
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Pricing
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Sign In
              </Link>
              <Button asChild size="sm" className="shadow-lg">
                <Link href="/sign-up">Get Started</Link>
              </Button>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <motion.div
          className="mx-auto max-w-5xl text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium shadow-sm">
              <Star className="w-3 h-3 mr-2" />
              Built for Technical Teams
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl mb-8"
            variants={fadeInUp}
          >
            Email campaigns
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
              for developers
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto max-w-3xl text-lg md:text-xl text-muted-foreground leading-relaxed mb-10"
            variants={fadeInUp}
          >
            The email platform that bridges developers and marketers. Code-first where it matters, visual where it
            helps. Build with React components or drag-and-drop — your choice.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center" variants={fadeInUp}>
            <Button size="lg" asChild className="text-base px-8 py-6 shadow-xl">
              <Link href="/sign-up">
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-base px-8 py-6 bg-background/50 backdrop-blur-sm"
            >
              <Link href="#demo">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Link>
            </Button>
          </motion.div>

          <motion.div className="mt-16 text-sm text-muted-foreground" variants={fadeInUp}>
            <p>Trusted by technical teams at startups and growing companies</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Problem/Solution Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          className="mx-auto max-w-6xl"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Most email tools choose sides</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              They either frustrate developers or exclude marketers. DevSend brings both together.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div variants={fadeInLeft}>
              <Card className="h-full border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <Target className="h-8 w-8 text-destructive mb-2" />
                  <CardTitle className="text-destructive">Marketing-First Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Great for marketers but frustrate developers with limited customization, poor APIs, and inflexible
                    templates.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full border-primary/20 bg-primary/5 ring-2 ring-primary/10">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Code2 className="h-8 w-8 text-primary" />
                    <Palette className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-primary">DevSend</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Code-first for developers, visual for marketers. Real-time collaboration with the flexibility both
                    teams need.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInRight}>
              <Card className="h-full border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <Code2 className="h-8 w-8 text-destructive mb-2" />
                  <CardTitle className="text-destructive">Developer-Only Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Perfect for sending emails but exclude marketers with no visual editor, analytics, or campaign
                    management.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <motion.div
          className="mx-auto max-w-6xl"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for both teams</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything developers need to build and everything marketers need to succeed
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <motion.div variants={fadeInLeft}>
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Code2 className="h-6 w-6 text-primary" />
                  <h3 className="text-2xl font-bold">Built for Developers</h3>
                </div>
                <div className="space-y-4">
                  {[
                    "Write emails as React components with full TypeScript support",
                    "Live preview and test rendering in development",
                    "Trigger emails via REST API or webhooks",
                    "Version control your email templates like code",
                    "Real-time data with Convex backend integration",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInRight}>
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Palette className="h-6 w-6 text-primary" />
                  <h3 className="text-2xl font-bold">Loved by Marketers</h3>
                </div>
                <div className="space-y-4">
                  {[
                    "Drag-and-drop visual editor for quick template creation",
                    "Real-time analytics: opens, clicks, bounces, and engagement",
                    "Advanced contact segmentation and list management",
                    "A/B testing with statistical significance tracking",
                    "Automated workflows and drip campaign sequences",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Modern architecture built for speed and reliability with real-time updates.",
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Track every metric that matters with real-time dashboards and insights.",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Seamless workflow between developers and marketers with role-based access.",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp} {...scaleOnHover}>
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="container mx-auto px-4 py-20 bg-muted/30">
        <motion.div
          className="mx-auto max-w-6xl"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Perfect for every email need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From transactional alerts to complex marketing campaigns
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Product Launch Sequences",
                description: "Coordinate launches with timed email sequences and real-time performance tracking.",
                icon: "🚀",
              },
              {
                title: "User Onboarding Flows",
                description: "Guide new users with personalized drip campaigns and behavioral triggers.",
                icon: "👋",
              },
              {
                title: "Transactional Alerts",
                description: "Send order confirmations, password resets, and system notifications reliably.",
                icon: "⚡",
              },
              {
                title: "Newsletter Campaigns",
                description: "Engage your audience with beautiful newsletters and detailed analytics.",
                icon: "📰",
              },
              {
                title: "API-Driven Campaigns",
                description: "Trigger emails programmatically from your application with full control.",
                icon: "🔌",
              },
              {
                title: "A/B Testing",
                description: "Optimize your campaigns with statistical testing and performance insights.",
                icon: "🧪",
              },
            ].map((useCase, index) => (
              <motion.div key={index} variants={fadeInUp} {...scaleOnHover}>
                <Card className="h-full bg-background/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="text-3xl mb-3">{useCase.icon}</div>
                    <CardTitle className="text-lg">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-relaxed">{useCase.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Who It's For Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Who DevSend is for</h2>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {[
                {
                  title: "Early-stage Startups",
                  description:
                    "Teams that need both technical flexibility and marketing capabilities without the complexity.",
                },
                {
                  title: "Technical SaaS Teams",
                  description: "Product teams where developers and marketers need to collaborate on email campaigns.",
                },
                {
                  title: "Indie Developers",
                  description:
                    "Solo developers or small teams building products who need professional email capabilities.",
                },
                {
                  title: "Growth Teams",
                  description: "Marketing teams working closely with product and engineering on user engagement.",
                },
              ].map((audience, index) => (
                <motion.div key={index} variants={fadeInUp} {...scaleOnHover}>
                  <Card className="text-left h-full bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">{audience.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="leading-relaxed">{audience.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20 bg-muted/30">
        <motion.div
          className="mx-auto max-w-5xl"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-muted-foreground">Start free, scale as you grow</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for trying out DevSend",
                features: [
                  "Up to 1,000 contacts",
                  "2,000 emails/month",
                  "Basic templates",
                  "Email support",
                  "React Email components",
                ],
                cta: "Start Free",
                popular: false,
              },
              {
                name: "Pro",
                price: "$29",
                description: "For growing teams and businesses",
                features: [
                  "Up to 10,000 contacts",
                  "50,000 emails/month",
                  "Advanced analytics",
                  "A/B testing",
                  "Priority support",
                  "Team collaboration",
                  "Custom domains",
                ],
                cta: "Start Pro Trial",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "$99",
                description: "For high-volume senders",
                features: [
                  "Unlimited contacts",
                  "500,000 emails/month",
                  "Custom integrations",
                  "Dedicated support",
                  "Advanced security",
                  "SLA guarantee",
                  "Custom onboarding",
                ],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div key={index} variants={fadeInUp} {...scaleOnHover}>
                <Card
                  className={`h-full relative ${
                    plan.popular ? "ring-2 ring-primary shadow-xl bg-background" : "bg-background/80 backdrop-blur-sm"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="px-4 py-1">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== "Free" && <span className="text-muted-foreground">/month</span>}
                    </div>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"} size="lg">
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <Card className="bg-gradient-to-br from-primary/5 via-background to-primary/5 border-primary/20 p-12">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to bridge your teams?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Whether you send one email or a thousand, DevSend helps you do it with clarity, control, and speed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" asChild className="px-8 py-6 text-base shadow-xl">
                  <Link href="/sign-up">
                    Start Building Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="px-8 py-6 text-base bg-transparent">
                  <Link href="#demo">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Demo
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">No credit card required • Free forever plan available</p>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Mail className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">DevSend</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                The email platform that bridges developers and marketers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    API Docs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Templates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Status
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 DevSend. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
