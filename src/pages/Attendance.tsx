import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Calendar, Check, X, AlertTriangle, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const attendanceData = [
  { id: 1, name: "Maria Santos", date: "09/01/2024", status: "Presente", horario: "08:00 - 17:00" },
  { id: 2, name: "João Ferreira", date: "09/01/2024", status: "Presente", horario: "08:15 - 17:30" },
  { id: 3, name: "Ana Costa", date: "09/01/2024", status: "Falta", horario: "-", motivo: "Consulta médica" },
  { id: 4, name: "Pedro Lima", date: "09/01/2024", status: "Absentismo", horario: "08:00 - 12:00", motivo: "Saída antecipada" },
  { id: 5, name: "Carla Mendes", date: "09/01/2024", status: "Presente", horario: "08:00 - 17:00" },
  { id: 6, name: "Lucas Oliveira", date: "09/01/2024", status: "Presente", horario: "07:55 - 17:15" },
];

const Attendance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("2024-01-09");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Presente":
        return <span className="badge-success">Presente</span>;
      case "Falta":
        return <span className="badge-error">Falta</span>;
      case "Absentismo":
        return <span className="badge-warning">Absentismo</span>;
      default:
        return <span className="badge-info">{status}</span>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Presente":
        return <Check className="w-4 h-4 text-success" />;
      case "Falta":
        return <X className="w-4 h-4 text-destructive" />;
      case "Absentismo":
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return null;
    }
  };

  const handleMarkAttendance = (worker: any) => {
    setSelectedWorker(worker);
    setDialogOpen(true);
  };

  const handleSaveAttendance = () => {
    toast({
      title: "Presença registrada!",
      description: `Presença de ${selectedWorker?.name} foi atualizada.`,
    });
    setDialogOpen(false);
  };

  const filteredData = attendanceData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    presentes: attendanceData.filter(a => a.status === "Presente").length,
    faltas: attendanceData.filter(a => a.status === "Falta").length,
    absentismo: attendanceData.filter(a => a.status === "Absentismo").length,
  };

  return (
    <AppLayout title="Gestão de Presenças" subtitle="Controle de presenças e faltas">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">{attendanceData.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <p className="text-sm text-muted-foreground">Presentes</p>
            </div>
            <p className="text-2xl font-bold text-success">{stats.presentes}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2">
              <X className="w-4 h-4 text-destructive" />
              <p className="text-sm text-muted-foreground">Faltas</p>
            </div>
            <p className="text-2xl font-bold text-destructive">{stats.faltas}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <p className="text-sm text-muted-foreground">Absentismo</p>
            </div>
            <p className="text-2xl font-bold text-warning">{stats.absentismo}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar trabalhador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-44"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Presente">Presentes</SelectItem>
              <SelectItem value="Falta">Faltas</SelectItem>
              <SelectItem value="Absentismo">Absentismo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Trabalhador</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="table-row">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {item.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      {getStatusBadge(item.status)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.horario}</TableCell>
                  <TableCell className="text-muted-foreground">{item.motivo || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Dialog open={dialogOpen && selectedWorker?.id === item.id} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleMarkAttendance(item)}>
                          Marcar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Registrar Presença - {item.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label>Status</Label>
                            <Select defaultValue={item.status}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Presente">Presente</SelectItem>
                                <SelectItem value="Falta">Falta</SelectItem>
                                <SelectItem value="Absentismo">Absentismo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Motivo (obrigatório para falta/absentismo)</Label>
                            <Textarea placeholder="Descreva o motivo..." />
                          </div>
                          <div className="space-y-2">
                            <Label>Anexar documento (opcional)</Label>
                            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors">
                              <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">Clique para anexar</p>
                            </div>
                          </div>
                          <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleSaveAttendance}>
                              Salvar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
};

export default Attendance;
