import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  FileText,
  Star,
  DollarSign,
  UserX,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Trabalhadores", path: "/workers" },
  { icon: Clock, label: "Trabalhadores Pendentes", path: "/pending-workers" },
  { icon: Calendar, label: "Presenças", path: "/attendance" },
  { icon: FileText, label: "Contratos", path: "/contracts" },
  { icon: Star, label: "Avaliações", path: "/evaluations" },
  { icon: DollarSign, label: "Gestão Financeira", path: "/financial" },
  { icon: UserX, label: "Trabalhadores Removidos", path: "/removed-workers" },
  { icon: Settings, label: "Configurações", path: "/settings" },
];

const AppSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "bg-sidebar h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-20 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img 
            src="/images/logo.png" 
            alt="GueziRH Logo" 
            className="w-10 h-10 rounded-lg object-contain flex-shrink-0"
          />
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-bold text-sidebar-accent-foreground">GueziRH</h1>
              <p className="text-xs text-sidebar-muted">Gestão de Recursos Humanos</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-24 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <p className={cn(
          "text-xs font-semibold text-sidebar-muted uppercase tracking-wider mb-3 px-3",
          collapsed && "hidden"
        )}>
          Menu Principal
        </p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    "sidebar-item group",
                    isActive && "sidebar-item-active"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={cn(
                    "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
                    isActive && "text-primary-foreground"
                  )} />
                  {!collapsed && (
                    <span className="truncate animate-fade-in">{item.label}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User & Logout */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        {!collapsed && (
          <div className="px-3 py-2 bg-sidebar-accent/30 rounded-lg mb-2">
            <p className="text-sm font-medium text-sidebar-accent-foreground">João Diretor</p>
            <p className="text-xs text-sidebar-muted">Gestor RH</p>
          </div>
        )}
        <NavLink
          to="/"
          className="sidebar-item text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="animate-fade-in">Sair</span>}
        </NavLink>
      </div>
    </aside>
  );
};

export default AppSidebar;
