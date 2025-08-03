import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const createWorkflow = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
    type: v.union(v.literal("drip"), v.literal("trigger"), v.literal("sequence")),
    trigger: v.object({
      type: v.union(v.literal("signup"), v.literal("tag_added"), v.literal("date"), v.literal("behavior")),
      conditions: v.object({}),
    }),
    steps: v.array(
      v.object({
        type: v.union(v.literal("email"), v.literal("wait"), v.literal("condition")),
        templateId: v.optional(v.id("templates")),
        delay: v.optional(v.number()), // in hours
        conditions: v.optional(v.object({})),
      }),
    ),
    isActive: v.boolean(),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("workflows", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  },
})

export const getWorkflows = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workflows")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect()
  },
})

export const createAbTest = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
    campaignId: v.id("campaigns"),
    testType: v.union(v.literal("subject"), v.literal("content"), v.literal("sender")),
    variants: v.array(
      v.object({
        name: v.string(),
        templateId: v.optional(v.id("templates")),
        subject: v.optional(v.string()),
        fromName: v.optional(v.string()),
        percentage: v.number(),
      }),
    ),
    testDuration: v.number(), // in hours
    winnerMetric: v.union(v.literal("open_rate"), v.literal("click_rate"), v.literal("conversion_rate")),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("abTests", {
      ...args,
      status: "running",
      startedAt: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  },
})

export const getAbTests = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("abTests")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect()
  },
})

export const createSegment = mutation({
  args: {
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
            v.literal("in_last_days"),
          ),
          value: v.any(),
        }),
      ),
      logic: v.union(v.literal("and"), v.literal("or")),
    }),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("segments", {
      ...args,
      contactCount: 0, // Will be calculated
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  },
})

export const getSegments = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("segments")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect()
  },
})

export const calculateSegmentSize = mutation({
  args: { segmentId: v.id("segments") },
  handler: async (ctx, args) => {
    const segment = await ctx.db.get(args.segmentId)
    if (!segment) throw new Error("Segment not found")

    // Get all contacts for the workspace
    const contacts = await ctx.db
      .query("contacts")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", segment.workspaceId))
      .collect()

    // Apply segment conditions (simplified logic)
    let filteredContacts = contacts

    for (const rule of segment.conditions.rules) {
      filteredContacts = filteredContacts.filter((contact) => {
        const fieldValue = (contact as any)[rule.field]

        switch (rule.operator) {
          case "equals":
            return fieldValue === rule.value
          case "not_equals":
            return fieldValue !== rule.value
          case "contains":
            return String(fieldValue).includes(String(rule.value))
          case "not_contains":
            return !String(fieldValue).includes(String(rule.value))
          case "greater_than":
            return Number(fieldValue) > Number(rule.value)
          case "less_than":
            return Number(fieldValue) < Number(rule.value)
          case "in_last_days":
            const daysAgo = Date.now() - Number(rule.value) * 24 * 60 * 60 * 1000
            return Number(fieldValue) > daysAgo
          default:
            return true
        }
      })
    }

    // Update segment with contact count
    await ctx.db.patch(args.segmentId, {
      contactCount: filteredContacts.length,
      updatedAt: Date.now(),
    })

    return filteredContacts.length
  },
})
