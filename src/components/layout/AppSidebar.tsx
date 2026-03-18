import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  FileText,
  Star,
  DollarSign,
  UserX,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCog,
  Hourglass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { AuthService } from "@/data/services/auth.service";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Trabalhadores", path: "/workers" },
    {
    icon: Clock,
    label: "Trabalhadores Pendentes",
    path: "/pending-workers",
    hiddenFor: ["normal", "rh"],
  },
  {
    icon: Hourglass,
    label: "Aguardando aprovação",
    path: "/approve-pending",
    hiddenFor: ["normal", "rh"],
  },

  { icon: Calendar, label: "Presenças", path: "/attendance" },
  { icon: FileText, label: "Contratos", path: "/contracts" },
  { icon: Star, label: "Desempenho", path: "/evaluations" },

  {
    icon: DollarSign,
    label: "Gestão Financeira",
    path: "/financial",
    hiddenFor: ["normal"],
  },

  { icon: UserX, label: "Trabalhadores Removidos", path: "/removed-workers" },

  {
    icon: UserCog,
    label: "Utilizadores",
    path: "/users",
    hiddenFor: ["normal"],
  },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { collapsed, toggleCollapsed } = useSidebarContext();
  const authService = new AuthService();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe();
  }, []);

  const getMe = async () => {
    try {
      const response = await authService.me();
      setUser(response);
    } catch (error) {
      console.error("Erro ao buscar utilizador:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Sair da Sessão?",
      text: "Tem a certeza que deseja terminar a sessão?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sair",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      authService.logout();
      Swal.fire({
        title: "Até Logo!",
        text: "Sessão encerrada com sucesso.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => navigate("/"));
    }
  };

  if (loading) return null; // evita piscar menu

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
            <div>
              <h1 className="text-lg font-bold text-sidebar-accent-foreground">
                GueziRH
              </h1>
              <p className="text-xs text-sidebar-muted">
                Gestão de Recursos Humanos
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse button */}
      <button
        onClick={toggleCollapsed}
        className="absolute -right-3 top-24 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Menu */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        {!collapsed && (
          <p className="text-xs font-semibold text-sidebar-muted uppercase mb-3 px-3">
            Menu Principal
          </p>
        )}

        <ul className="space-y-1">
          {menuItems
            .filter((item) => {
              if (!item.hiddenFor) return true;
              return !item.hiddenFor.includes(user.role);
            })
            .map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/dashboard" &&
                  location.pathname.startsWith(item.path));

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
                    <item.icon className="w-5 h-5" />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="sidebar-item text-red-500 w-full"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Terminar Sessão</span>}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
