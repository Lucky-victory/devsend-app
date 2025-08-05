"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  LayoutTemplateIcon as Template,
  Send,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebarContext } from "@/app/dashboard/state";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Templates", href: "/dashboard/email-templates", icon: Template },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Send },
  { name: "Contacts", href: "/dashboard/contacts", icon: Users },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  // const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { isCollapsed: collapsed, setIsCollapsed: setCollapsed } =
    useSidebarContext();
  return (
    <TooltipProvider>
      <motion.div
        className={cn(
          "flex h-screen flex-col z-10 border-r bg-card/50 backdrop-blur-md transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
        animate={{ width: collapsed ? 64 : 256 }}
      >
        {/* Header */}

        <div className="flex h-16 items-center justify-between px-4 border-b">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Mail className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">DevSend</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 space-y-1", collapsed ? "p-2" : "p-4")}>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const NavItem = (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center"
                )}
              >
                <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>{NavItem}</TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return NavItem;
          })}
        </nav>
      </motion.div>
    </TooltipProvider>
  );
}
