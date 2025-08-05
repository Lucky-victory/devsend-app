"use client";

import { ReactNode } from "react";
import { useConvex } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";

export function ConvexBetterAuthClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const convex = useConvex();
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";

export const useAuth = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.auth.getCurrentUser);

  // Move the useQuery call to the top level and conditionally pass parameters
  const currentWorkspace = useQuery(
    api.auth.getCurrentWorkspace,
    user ? { userId: user.userId } : "skip"
  );

  console.log({
    user,
    isAuthenticated,
    isLoading,
    currentWorkspace,
  });

  return {
    isAuthenticated,
    isLoading,
    user,
    currentWorkspace: currentWorkspace || null,
  };
};
