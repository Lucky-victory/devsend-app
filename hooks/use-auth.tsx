import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";

export const useAuth = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.auth.getCurrentUser);
  console.log({
    user,
    isAuthenticated,
    isLoading,
  });
  let currentWorkspace: any = {};
  if (user) {
    currentWorkspace = useQuery(api.auth.getCurrentWorkspace, {
      userId: user._id,
    });
  }

  return { isAuthenticated, isLoading, user, currentWorkspace };
};
