import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const createContact = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Check if contact already exists
    const existingContact = await ctx.db
      .query("contacts")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .first()

    if (existingContact) {
      throw new Error("Contact already exists")
    }

    return await ctx.db.insert("contacts", {
      workspaceId: args.workspaceId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      status: "subscribed",
      tags: args.tags || [],
      subscribedAt: Date.now(),
    })
  },
})

export const getContacts = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contacts")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect()
  },
})

export const getContactStats = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const contacts = await ctx.db
      .query("contacts")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect()

    const total = contacts.length
    const subscribed = contacts.filter((c) => c.status === "subscribed").length
    const unsubscribed = contacts.filter((c) => c.status === "unsubscribed").length
    const bounced = contacts.filter((c) => c.status === "bounced").length

    // Get unique tags
    const allTags = contacts.flatMap((c) => c.tags)
    const uniqueTags = [...new Set(allTags)]

    return {
      total,
      subscribed,
      unsubscribed,
      bounced,
      segments: uniqueTags.length,
    }
  },
})

export const updateContact = mutation({
  args: {
    contactId: v.id("contacts"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    status: v.optional(v.union(v.literal("subscribed"), v.literal("unsubscribed"), v.literal("bounced"))),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { contactId, ...updates } = args
    return await ctx.db.patch(contactId, updates)
  },
})

export const deleteContact = mutation({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.contactId)
  },
})

export const importContacts = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    contacts: v.array(
      v.object({
        email: v.string(),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const results = {
      imported: 0,
      skipped: 0,
      errors: [] as string[],
    }

    for (const contact of args.contacts) {
      try {
        // Check if contact already exists
        const existing = await ctx.db
          .query("contacts")
          .withIndex("by_email", (q) => q.eq("email", contact.email))
          .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
          .first()

        if (existing) {
          results.skipped++
          continue
        }

        await ctx.db.insert("contacts", {
          workspaceId: args.workspaceId,
          email: contact.email,
          firstName: contact.firstName,
          lastName: contact.lastName,
          status: "subscribed",
          tags: contact.tags || [],
          subscribedAt: Date.now(),
        })

        results.imported++
      } catch (error) {
        results.errors.push(`Failed to import ${contact.email}: ${error}`)
      }
    }

    return results
  },
})
