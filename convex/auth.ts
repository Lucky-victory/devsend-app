import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { BetterAuth, type AuthFunctions } from "@convex-dev/better-auth";
import { api, components, internal } from "./_generated/api";
import type { Id, DataModel } from "./_generated/dataModel";

// Typesafe way to pass Convex functions defined in this file
const authFunctions: AuthFunctions = internal.auth;

// Initialize the component
export const betterAuthComponent = new BetterAuth(components.betterAuth, {
  authFunctions,
});

// These are required named exports
export const { createUser, updateUser, deleteUser, createSession } =
  betterAuthComponent.createAuthFunctions<DataModel>({
    // Must create a user and return the user id
    onCreateUser: async (ctx, user) => {
      return ctx.db.insert("users", {});
    },

    // Delete the user when they are deleted from Better Auth
    onDeleteUser: async (ctx, userId) => {
      await ctx.db.delete(userId as Id<"users">);
    },
  });

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // Get user data from Better Auth - email, name, image, etc.
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) {
      return null;
    }
    // Get user data from your application's database
    // (skip this if you have no fields in your users table schema)
    const user = await ctx.db.get(userMetadata.userId as Id<"users">);
    return {
      ...user,
      ...userMetadata,
    };
  },
});
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
      .first();

    if (existingUser) {
      throw new Error("User already exists");
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      emailVerified: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

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
    });

    // Add user as owner of workspace
    await ctx.db.insert("workspaceMembers", {
      workspaceId,
      userId,
      role: "owner",
      invitedAt: Date.now(),
      joinedAt: Date.now(),
    });

    return { userId, workspaceId };
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const getUserWorkspaces = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const workspaces = await Promise.all(
      memberships.map(async (membership) => {
        const workspace = await ctx.db.get(membership.workspaceId);
        return {
          ...workspace,
          role: membership.role,
        };
      })
    );

    return workspaces.filter(Boolean);
  },
});
