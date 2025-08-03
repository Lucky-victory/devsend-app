"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Code,
  Mail,
  BarChart3,
  Zap,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Mail className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">DevSend</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Login
            </Link>
            <ThemeToggle />
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-24 md:py-32">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="secondary" className="mb-4">
              Built for Developers
            </Badge>
          </motion.div>
          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl"
            variants={fadeInUp}
          >
            Email Campaigns
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}
              Made Simple
            </span>
          </motion.h1>
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
            variants={fadeInUp}
          >
            Create, manage, and send beautiful email campaigns with code or
            visual editors. Built specifically for developers, indie hackers,
            and small teams who value simplicity and power.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
          >
            <Button size="lg" asChild className="text-base">
              <Link href="/signup">
                Start Building <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-base bg-transparent"
            >
              <Link href="#">View Demo</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="container px-4 py-24">
        <motion.div
          className="mx-auto max-w-6xl"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to succeed
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed with developers in mind
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Code,
                title: "Code-First Templates",
                description:
                  "Write email templates in React/TSX with full TypeScript support and live preview.",
              },
              {
                icon: Mail,
                title: "Visual Editor",
                description:
                  "Drag-and-drop email builder powered by Unlayer for non-technical team members.",
              },
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description:
                  "Track opens, clicks, bounces, and campaign performance with live dashboards.",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Built on modern tech stack for optimal performance and developer experience.",
              },
              {
                icon: Shield,
                title: "Reliable Delivery",
                description:
                  "Powered by Resend API for high deliverability and inbox placement.",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description:
                  "Invite team members, manage permissions, and collaborate on campaigns.",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full glassmorphism hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container px-4 py-24">
        <motion.div
          className="mx-auto max-w-4xl"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that fits your needs
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "$9",
                description: "Perfect for indie hackers and small projects",
                features: [
                  "Up to 1,000 contacts",
                  "5,000 emails/month",
                  "Basic analytics",
                  "Email support",
                ],
              },
              {
                name: "Pro",
                price: "$29",
                description: "For growing teams and businesses",
                features: [
                  "Up to 10,000 contacts",
                  "50,000 emails/month",
                  "Advanced analytics",
                  "Priority support",
                  "Team collaboration",
                ],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "$99",
                description: "For large teams and high-volume senders",
                features: [
                  "Unlimited contacts",
                  "500,000 emails/month",
                  "Custom integrations",
                  "Dedicated support",
                  "Advanced security",
                ],
              },
            ].map((plan, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card
                  className={`h-full ${plan.popular ? "ring-2 ring-primary" : ""} glassmorphism hover:shadow-xl transition-all duration-300`}
                >
                  <CardHeader>
                    {plan.popular && (
                      <Badge className="w-fit mb-2">Most Popular</Badge>
                    )}
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <ArrowRight className="h-4 w-4 text-primary mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-24">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Card className="glassmorphism p-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ready to transform your email campaigns?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of developers who trust DevSend for their email
              marketing needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur-md">
        <div className="container px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Mail className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">DevSend</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Email campaigns made simple for developers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Status
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
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
  );
}
