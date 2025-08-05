"use client";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface DashboardSidebarStateProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}
const DashboardSidebarContext = createContext<DashboardSidebarStateProps>({
  isCollapsed: false,
  setIsCollapsed: () => {},
});

export const DashboardSidebarProvivder = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const setCollapsedCb = useCallback((collapsed: boolean) => {
    setIsCollapsed(collapsed);
  }, []);
  return (
    <DashboardSidebarContext.Provider
      value={{ isCollapsed, setIsCollapsed: setCollapsedCb }}
    >
      {children}
    </DashboardSidebarContext.Provider>
  );
};

export const useSidebarContext = () => {
  const context = useContext(DashboardSidebarContext);

  if (!context)
    throw new Error("useSidebarContext can only be used in dashboard");

  return context;
};
