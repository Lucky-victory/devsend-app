"use client";
import { type ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { ConvexBetterAuthClientProvider } from "./auth";
import { ConvexProvider } from "./convex-provider";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ConvexProvider>
      <ConvexBetterAuthClientProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </ConvexBetterAuthClientProvider>
    </ConvexProvider>
  );
};
