"use client";

import type React from "react";

import { ConvexProvider as BaseConvexProvider } from "convex/react";
import { convex } from "@/lib/convex-client";

export function ConvexProvider({ children }: { children: React.ReactNode }) {
  return <BaseConvexProvider client={convex}>{children}</BaseConvexProvider>;
}
