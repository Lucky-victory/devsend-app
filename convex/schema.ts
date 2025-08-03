import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    avatar: v.optional(v.string()),
    emailVerified: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  workspaces: defineTable({
    name: v.string(),
    slug: v.string(),
    ownerId: v.id("users"),
    fromName: v.string(),
    fromEmail: v.string(),
    replyToEmail: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_owner", ["ownerId"]),

  workspaceMembers: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("editor"),
      v.literal("viewer")
    ),
    invitedAt: v.number(),
    joinedAt: v.optional(v.number()),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_user", ["userId"]),

  templates: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    type: v.union(v.literal("code"), v.literal("visual")),
    status: v.union(v.literal("draft"), v.literal("published")),
    content: v.string(), // React/TSX code or Unlayer JSON
    previewData: v.optional(v.string()), // JSON string for preview
    thumbnail: v.optional(v.string()),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_type", ["type"]),

  contacts: defineTable({
    workspaceId: v.id("workspaces"),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    status: v.union(
      v.literal("subscribed"),
      v.literal("unsubscribed"),
      v.literal("bounced")
    ),
    tags: v.array(v.string()),
    customFields: v.optional(v.object({})),
    subscribedAt: v.number(),
    unsubscribedAt: v.optional(v.number()),
    lastActivityAt: v.optional(v.number()),
    source: v.optional(v.string()), // signup, import, api, etc.
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_email", ["email"])
    .index("by_status", ["status"]),

  campaigns: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    subject: v.string(),
    templateId: v.id("templates"),
    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("sending"),
      v.literal("sent"),
      v.literal("paused")
    ),
    scheduledAt: v.optional(v.number()),
    sentAt: v.optional(v.number()),
    contactSegment: v.string(), // JSON string for segment criteria
    abTestId: v.optional(v.id("abTests")),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_status", ["status"]),

  campaignStats: defineTable({
    campaignId: v.id("campaigns"),
    totalSent: v.number(),
    totalDelivered: v.number(),
    totalOpened: v.number(),
    totalClicked: v.number(),
    totalBounced: v.number(),
    totalUnsubscribed: v.number(),
    openRate: v.number(),
    clickRate: v.number(),
    bounceRate: v.number(),
    updatedAt: v.number(),
  }).index("by_campaign", ["campaignId"]),

  emailEvents: defineTable({
    campaignId: v.id("campaigns"),
    contactId: v.id("contacts"),
    eventType: v.union(
      v.literal("sent"),
      v.literal("delivered"),
      v.literal("opened"),
      v.literal("clicked"),
      v.literal("bounced"),
      v.literal("complained"),
      v.literal("unsubscribed")
    ),
    eventData: v.optional(v.object({})),
    timestamp: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  })
    .index("by_campaign", ["campaignId"])
    .index("by_contact", ["contactId"])
    .index("by_type", ["eventType"]),

  // New tables for advanced features
  workflows: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    type: v.union(
      v.literal("drip"),
      v.literal("trigger"),
      v.literal("sequence")
    ),
    trigger: v.object({
      type: v.union(
        v.literal("signup"),
        v.literal("tag_added"),
        v.literal("date"),
        v.literal("behavior")
      ),
      conditions: v.object({}),
    }),
    steps: v.array(
      v.object({
        type: v.union(
          v.literal("email"),
          v.literal("wait"),
          v.literal("condition")
        ),
        templateId: v.optional(v.id("templates")),
        delay: v.optional(v.number()), // in hours
        conditions: v.optional(v.object({})),
      })
    ),
    isActive: v.boolean(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  workflowRuns: defineTable({
    workflowId: v.id("workflows"),
    contactId: v.id("contacts"),
    currentStep: v.number(),
    status: v.union(
      v.literal("running"),
      v.literal("completed"),
      v.literal("paused"),
      v.literal("failed")
    ),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    nextRunAt: v.optional(v.number()),
  })
    .index("by_workflow", ["workflowId"])
    .index("by_contact", ["contactId"])
    .index("by_next_run", ["nextRunAt"]),

  abTests: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    campaignId: v.id("campaigns"),
    testType: v.union(
      v.literal("subject"),
      v.literal("content"),
      v.literal("sender")
    ),
    variants: v.array(
      v.object({
        name: v.string(),
        templateId: v.optional(v.id("templates")),
        subject: v.optional(v.string()),
        fromName: v.optional(v.string()),
        percentage: v.number(),
      })
    ),
    testDuration: v.number(), // in hours
    winnerMetric: v.union(
      v.literal("open_rate"),
      v.literal("click_rate"),
      v.literal("conversion_rate")
    ),
    status: v.union(
      v.literal("running"),
      v.literal("completed"),
      v.literal("paused")
    ),
    winnerId: v.optional(v.string()),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  abTestResults: defineTable({
    abTestId: v.id("abTests"),
    variantId: v.string(),
    sent: v.number(),
    opened: v.number(),
    clicked: v.number(),
    converted: v.number(),
    openRate: v.number(),
    clickRate: v.number(),
    conversionRate: v.number(),
    updatedAt: v.number(),
  }).index("by_test", ["abTestId"]),

  segments: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    description: v.optional(v.string()),
    conditions: v.object({
      rules: v.array(
        v.object({
          field: v.string(),
          operator: v.union(
            v.literal("equals"),
            v.literal("not_equals"),
            v.literal("contains"),
            v.literal("not_contains"),
            v.literal("greater_than"),
            v.literal("less_than"),
            v.literal("in_last_days")
          ),
          value: v.any(),
        })
      ),
      logic: v.union(v.literal("and"), v.literal("or")),
    }),
    contactCount: v.number(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  unsubscribePages: defineTable({
    workspaceId: v.id("workspaces"),
    slug: v.string(),
    title: v.string(),
    content: v.string(), // HTML content
    showFeedback: v.boolean(),
    redirectUrl: v.optional(v.string()),
    isDefault: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_slug", ["slug"]),

  deliverabilityReports: defineTable({
    workspaceId: v.id("workspaces"),
    campaignId: v.optional(v.id("campaigns")),
    reportType: v.union(
      v.literal("domain"),
      v.literal("ip"),
      v.literal("content")
    ),
    score: v.number(),
    issues: v.array(
      v.object({
        type: v.string(),
        severity: v.union(
          v.literal("low"),
          v.literal("medium"),
          v.literal("high")
        ),
        message: v.string(),
        suggestion: v.string(),
      })
    ),
    generatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_campaign", ["campaignId"]),
});
