import AppLayout from "@/components/layout/AppLayout";
import {
  Users,
  Clock,
  AlertTriangle,
  FileText,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  CalendarCheck,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const statsCards = [
  {
    title: "Total de Trabalhadores",
    value: "248",
    change: "+12",
    changeType: "positive",
    icon: Users,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Trabalhadores Pendentes",
    value: "8",
    change: "-3",
    changeType: "positive",
    icon: Clock,
    color: "bg-warning-light text-warning",
  },
  {
    title: "Faltas do Mês",
    value: "23",
    change: "+5",
    changeType: "negative",
    icon: AlertTriangle,
    color: "bg-destructive-light text-destructive",
  },
  {
    title: "Contratos a Expirar",
    value: "5",
    change: "30 dias",
    changeType: "neutral",
    icon: FileText,
    color: "bg-info-light text-info",
  },
];

const attendanceData = [
  { month: "Jan", presentes: 95, faltas: 5 },
  { month: "Fev", presentes: 92, faltas: 8 },
  { month: "Mar", presentes: 97, faltas: 3 },
  { month: "Abr", presentes: 94, faltas: 6 },
  { month: "Mai", presentes: 96, faltas: 4 },
  { month: "Jun", presentes: 93, faltas: 7 },
];

const departmentData = [
  { name: "Administrativo", value: 45 },
  { name: "Operações", value: 85 },
  { name: "Vendas", value: 38 },
  { name: "TI", value: 22 },
  { name: "Marketing", value: 18 },
];

const COLORS = [
  "hsl(29, 98%, 47%)",
  "hsl(199, 89%, 48%)",
  "hsl(142, 72%, 42%)",
  "hsl(280, 65%, 60%)",
  "hsl(38, 92%, 50%)",
];

const recentActivities = [
  { type: "add", text: "Maria Santos adicionada ao departamento de Vendas", time: "2 min atrás" },
  { type: "contract", text: "Contrato de Pedro Lima renovado", time: "1 hora atrás" },
  { type: "evaluation", text: "Avaliação de desempenho de Ana Costa concluída", time: "3 horas atrás" },
  { type: "absence", text: "João Ferreira registrou falta justificada", time: "5 horas atrás" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <AppLayout title="Dashboard" subtitle="Visão geral do sistema">
      <div className="space-y-6 animate-fade-in">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div
              key={stat.title}
              className="stats-card animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.changeType === "positive" && (
                      <TrendingUp className="w-4 h-4 text-success" />
                    )}
                    {stat.changeType === "negative" && (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === "positive"
                          ? "text-success"
                          : stat.changeType === "negative"
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`stats-card-icon ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="primaryLight"
            size="lg"
            className="justify-start gap-3 h-auto py-4"
            onClick={() => navigate("/workers/add")}
          >
            <UserPlus className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Adicionar Trabalhador</p>
              <p className="text-xs opacity-80">Registrar novo colaborador</p>
            </div>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="justify-start gap-3 h-auto py-4"
            onClick={() => navigate("/attendance")}
          >
            <CalendarCheck className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Registrar Presença</p>
              <p className="text-xs text-muted-foreground">Gestão de presenças</p>
            </div>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="justify-start gap-3 h-auto py-4"
            onClick={() => navigate("/contracts")}
          >
            <FileText className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Ver Contratos</p>
              <p className="text-xs text-muted-foreground">Gestão de contratos</p>
            </div>
          </Button>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Chart */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Taxa de Presença</h3>
                <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
              </div>
              <Button variant="ghost" size="sm">
                Ver detalhes
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="colorPresentes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(29, 98%, 47%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(29, 98%, 47%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 90%)" />
                  <XAxis dataKey="month" stroke="hsl(220, 10%, 50%)" fontSize={12} />
                  <YAxis stroke="hsl(220, 10%, 50%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(220, 14%, 90%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="presentes"
                    stroke="hsl(29, 98%, 47%)"
                    fillOpacity={1}
                    fill="url(#colorPresentes)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Distribution */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">Por Departamento</h3>
              <p className="text-sm text-muted-foreground">Distribuição atual</p>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {departmentData.map((dept, index) => (
                <div key={dept.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-muted-foreground">{dept.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{dept.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Atividades Recentes</h3>
              <p className="text-sm text-muted-foreground">Últimas atualizações do sistema</p>
            </div>
            <Button variant="ghost" size="sm">
              Ver todas
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
