import {
  twoFactorClient,
  magicLinkClient,
  emailOTPClient,
  genericOAuthClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import {
  convexClient,
  crossDomainClient,
} from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    magicLinkClient(),
    emailOTPClient(),
    twoFactorClient(),
    genericOAuthClient(),
    convexClient(),
    // crossDomainClient(),
  ],
});
