import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const createTemplate = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
    type: v.union(v.literal("code"), v.literal("visual")),
    content: v.string(),
    previewData: v.optional(v.string()),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("templates", {
      ...args,
      status: "draft",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  },
})

export const getTemplates = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const templates = await ctx.db
      .query("templates")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect()

    // Get stats for each template
    const templatesWithStats = await Promise.all(
      templates.map(async (template) => {
        const campaigns = await ctx.db
          .query("campaigns")
          .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
          .filter((q) => q.eq(q.field("templateId"), template._id))
          .collect()

        let totalOpens = 0
        let totalClicks = 0

        for (const campaign of campaigns) {
          const stats = await ctx.db
            .query("campaignStats")
            .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
            .first()

          if (stats) {
            totalOpens += stats.totalOpened
            totalClicks += stats.totalClicked
          }
        }

        return {
          ...template,
          opens: totalOpens,
          clicks: totalClicks,
        }
      }),
    )

    return templatesWithStats
  },
})

export const getTemplate = query({
  args: { templateId: v.id("templates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.templateId)
  },
})

export const updateTemplate = mutation({
  args: {
    templateId: v.id("templates"),
    name: v.optional(v.string()),
    content: v.optional(v.string()),
    previewData: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    const { templateId, ...updates } = args
    return await ctx.db.patch(templateId, {
      ...updates,
      updatedAt: Date.now(),
    })
  },
})

export const deleteTemplate = mutation({
  args: { templateId: v.id("templates") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.templateId)
  },
})
