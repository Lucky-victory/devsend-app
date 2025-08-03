import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const createUser = mutation({
  args: {
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()

    if (existingUser) {
      throw new Error("User already exists")
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      emailVerified: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // Create default workspace
    const workspaceId = await ctx.db.insert("workspaces", {
      name: `${args.firstName}'s Workspace`,
      slug: `${args.firstName.toLowerCase()}-workspace-${Date.now()}`,
      ownerId: userId,
      fromName: `${args.firstName} ${args.lastName}`,
      fromEmail: args.email,
      replyToEmail: args.email,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // Add user as owner of workspace
    await ctx.db.insert("workspaceMembers", {
      workspaceId,
      userId,
      role: "owner",
      invitedAt: Date.now(),
      joinedAt: Date.now(),
    })

    return { userId, workspaceId }
  },
})

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()
  },
})

export const getUserWorkspaces = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()

    const workspaces = await Promise.all(
      memberships.map(async (membership) => {
        const workspace = await ctx.db.get(membership.workspaceId)
        return {
          ...workspace,
          role: membership.role,
        }
      }),
    )

    return workspaces.filter(Boolean)
  },
})
