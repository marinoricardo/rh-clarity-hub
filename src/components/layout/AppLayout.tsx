import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AppLayout = ({ children, title, subtitle }: AppLayoutProps) => {
  const { collapsed } = useSidebarContext();

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar />

      {/* Main Content - adjusts margin based on sidebar state */}
      <div
        className={cn(
          "flex-1 transition-all duration-300",
          collapsed ? "ml-20" : "ml-64"
        )}
      >
        <AppHeader title={title} subtitle={subtitle} />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
