"use client";
import {
  ConvexProvider as BaseConvexProvider,
  ConvexReactClient,
} from "convex/react";
import { type ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
  verbose: process.env.NODE_ENV === "development",
});
export const ConvexProvider = ({ children }: { children: ReactNode }) => {
  return <BaseConvexProvider client={convex}>{children}</BaseConvexProvider>;
};
