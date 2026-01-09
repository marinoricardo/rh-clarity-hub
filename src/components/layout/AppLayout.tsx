import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AppLayout = ({ children, title, subtitle }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar />
      
      {/* Main Content - with margin for sidebar */}
      <div className="flex-1 ml-64 transition-all duration-300">
        <AppHeader title={title} subtitle={subtitle} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
