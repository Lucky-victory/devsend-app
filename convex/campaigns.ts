import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const createCampaign = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
    subject: v.string(),
    templateId: v.id("templates"),
    contactSegment: v.string(),
    scheduledAt: v.optional(v.number()),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const status = args.scheduledAt ? "scheduled" : "draft"

    const campaignId = await ctx.db.insert("campaigns", {
      ...args,
      status,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // Initialize campaign stats
    await ctx.db.insert("campaignStats", {
      campaignId,
      totalSent: 0,
      totalDelivered: 0,
      totalOpened: 0,
      totalClicked: 0,
      totalBounced: 0,
      totalUnsubscribed: 0,
      openRate: 0,
      clickRate: 0,
      bounceRate: 0,
      updatedAt: Date.now(),
    })

    return campaignId
  },
})

export const getCampaigns = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect()

    // Get stats and template info for each campaign
    const campaignsWithDetails = await Promise.all(
      campaigns.map(async (campaign) => {
        const [stats, template] = await Promise.all([
          ctx.db
            .query("campaignStats")
            .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
            .first(),
          ctx.db.get(campaign.templateId),
        ])

        return {
          ...campaign,
          stats: stats || {
            totalSent: 0,
            totalDelivered: 0,
            totalOpened: 0,
            totalClicked: 0,
            totalBounced: 0,
            openRate: 0,
            clickRate: 0,
            bounceRate: 0,
          },
          template: template?.name || "Unknown Template",
        }
      }),
    )

    return campaignsWithDetails
  },
})

export const updateCampaignStatus = mutation({
  args: {
    campaignId: v.id("campaigns"),
    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("sending"),
      v.literal("sent"),
      v.literal("paused"),
    ),
    sentAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { campaignId, ...updates } = args
    return await ctx.db.patch(campaignId, {
      ...updates,
      updatedAt: Date.now(),
    })
  },
})

export const sendCampaign = mutation({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, args) => {
    const campaign = await ctx.db.get(args.campaignId)
    if (!campaign) throw new Error("Campaign not found")

    // Update campaign status to sending
    await ctx.db.patch(args.campaignId, {
      status: "sending",
      updatedAt: Date.now(),
    })

    // Get contacts based on segment
    const contacts = await ctx.db
      .query("contacts")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", campaign.workspaceId))
      .filter((q) => q.eq(q.field("status"), "subscribed"))
      .collect()

    // This would trigger the actual email sending process
    // For now, we'll simulate it by updating the campaign status
    setTimeout(async () => {
      await ctx.db.patch(args.campaignId, {
        status: "sent",
        sentAt: Date.now(),
        updatedAt: Date.now(),
      })

      // Update campaign stats
      const stats = await ctx.db
        .query("campaignStats")
        .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
        .first()

      if (stats) {
        await ctx.db.patch(stats._id, {
          totalSent: contacts.length,
          totalDelivered: Math.floor(contacts.length * 0.98), // 98% delivery rate
          updatedAt: Date.now(),
        })
      }
    }, 2000)

    return { success: true, contactCount: contacts.length }
  },
})
