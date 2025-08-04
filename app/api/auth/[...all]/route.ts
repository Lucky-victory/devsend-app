import { nextJsHandler } from "@convex-dev/better-auth/nextjs";

export const { GET, POST } = nextJsHandler({
  convexSiteUrl: process.env.CONVEX_SITE_URL || "http://localhost:3201",
});
