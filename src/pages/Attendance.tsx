import { useEffect, useRef, useState } from "react";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Calendar, Check, X, AlertTriangle, Upload, Plus, FileText, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AttendanceService } from "@/data/services/attendance.service";
import { WorkerService } from "@/data/services/worker.service";
import Swal from "sweetalert2";


// const attendanceData = [
//   { id: 1, codigo: "TRB001", name: "Maria Santos", dataInicio: "09/01/2024", dataFim: "09/01/2024", absentismo: "Não", observacoes: "-", anexo: null },
//   { id: 2, codigo: "TRB002", name: "João Ferreira", dataInicio: "09/01/2024", dataFim: "09/01/2024", absentismo: "Não", observacoes: "-", anexo: null },
//   { id: 3, codigo: "TRB003", name: "Ana Costa", dataInicio: "09/01/2024", dataFim: "09/01/2024", absentismo: "Sim", observacoes: "Consulta médica", anexo: "atestado.pdf" },
//   { id: 4, codigo: "TRB004", name: "Pedro Lima", dataInicio: "09/01/2024", dataFim: "09/01/2024", absentismo: "Parcial", observacoes: "Saída antecipada", anexo: null },
//   { id: 5, codigo: "TRB005", name: "Carla Mendes", dataInicio: "09/01/2024", dataFim: "09/01/2024", absentismo: "Não", observacoes: "-", anexo: null },
//   { id: 6, codigo: "TRB006", name: "Lucas Oliveira", dataInicio: "09/01/2024", dataFim: "09/01/2024", absentismo: "Não", observacoes: "-", anexo: null },
// ];

const Attendance = () => {
  const attendanceService = new AttendanceService();
  const workerService = new WorkerService();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("2024-01-09");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    worker_id: "",
    start_date: "",
    end_date: "",
    status: "",
    reason: "",
    attachment: null as File | null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [workersData, setWorkersData] = useState<any[]>([]); // agora dinâmico
  const fileInputRef = useRef<HTMLInputElement>(null);



  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.index(); // chama a API
      const res = await workerService.index();
      setWorkersData(res); // atualiza estado
      setAttendanceData(data); // atualiza estado
    } catch (err: any) {
      setError(err.message || "Falha ao carregar trabalhadores");
    } finally {
      setLoading(false);
    }
  };

  const getAbsentismoBadge = (absentismo: string) => {
    switch (absentismo) {
      case "Ausente":
        return <span className="badge-success">Ausente</span>;
      case "Dispensa":
        return <span className="badge-error">Dispensa</span>;
      case "Presente":
        return <span className="badge-warning">Presente</span>;
      default:
        return <span className="badge-info">{absentismo}</span>;
    }
  };

  const handleOpenForm = () => {
    setFormData({
      worker_id: "",
      start_date: "",
      end_date: "",
      status: "",
      reason: "",
      attachment: null,
    });
    setDialogOpen(true);
  };

  const handleSaveAttendance = async () => {
    try {
      const data = new FormData();

      data.append("worker_id", formData.worker_id);
      data.append("start_date", formData.start_date);
      data.append("end_date", formData.end_date);
      data.append("status", formData.status);
      data.append("reason", formData.reason);

      if (formData.attachment) {
        data.append("attachment", formData.attachment);
      }

      await attendanceService.store(data);
      setDialogOpen(false);

      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Presença registrada com sucesso.",
        confirmButtonText: "OK",
      });

      fetchAllData();
    } catch (error: any) {
      console.error("Erro ao salvar presença:", error);
      setDialogOpen(false);

      Swal.fire({
        icon: "error",
        title: "Erro",
        text: error?.message || "Erro ao salvar presença.",
        confirmButtonText: "Fechar",
      });
    }
  };



  const filteredData = attendanceData.filter((item) => {
    const matchesSearch = item.worker.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "Presente" && item.status === "Presente") ||
      (filterStatus === "Ausente" && item.status === "Ausente") ||
      (filterStatus === "Dispensa" && item.status === "Dispensa");
    return matchesSearch && matchesStatus;
  });
  // const filteredData = attendanceData;

  // const stats = {
  //   total: attendanceData.length,
  //   presentes: attendanceData.filter(a => a.absentismo === "Não").length,
  //   absentismo: attendanceData.filter(a => a.absentismo === "Sim").length,
  //   parcial: attendanceData.filter(a => a.absentismo === "Parcial").length,
  // };

  return (
    <AppLayout title="Gestão de Presenças" subtitle="Controle de presenças e faltas">
      <div className="space-y-6 animate-fade-in">
        {/* Filters & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome..."
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
                <SelectItem value="Ausente">Ausente</SelectItem>
                <SelectItem value="Dispensa">Dispensa</SelectItem>
                <SelectItem value="Presente">Presente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleOpenForm}>
            <Plus className="w-4 h-4 mr-2" />
            Registrar Presença
          </Button>
        </div>

        {/* Workers Summary Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-foreground">Resumo de Trabalhadores por Departamento</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Nome Completo</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Tipo de Contrato</TableHead>
                <TableHead>Salário</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workersData
                .filter((w) => w.full_name?.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((worker) => (
                  <TableRow key={worker.id} className="table-row">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {worker.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                          </span>
                        </div>
                        <span className="font-medium">{worker.full_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{worker.work_email || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{worker.employment_data?.organic_unit || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{worker.job_function || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{worker.employment_data?.contract_type || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {worker.employment_data?.salary ? `${Number(worker.employment_data.salary).toLocaleString("pt-MZ")} MT` : "-"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Attendance Records Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-foreground">Registros de Presença</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Nome do Trabalhador</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Data Fim</TableHead>
                <TableHead>Absentismo</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead>Anexo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="table-row">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {item.worker.full_name.split(" ").map((n: string) => n[0]).join("")}
                        </span>
                      </div>
                      <span className="font-medium">{item.worker.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.start_date}</TableCell>
                  <TableCell className="text-muted-foreground">{item.end_date || "-"}</TableCell>
                  <TableCell>{getAbsentismoBadge(item.status)}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {item.reason || "-"}
                  </TableCell>
                  <TableCell>
                    {item.attachment ? (
                      <Button variant="ghost" size="sm" onClick={() => window.open(item.attachment, "_blank")}>
                        <Download className="w-4 h-4 mr-1" />
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Dialog Form */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Registrar Presença</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Trabalhador</Label>
                <Select
                  value={formData.worker_id}
                  onValueChange={(value) => setFormData({ ...formData, worker_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o trabalhador" />
                  </SelectTrigger>
                  <SelectContent>
                    {workersData.map(w => (
                      <SelectItem key={w.id} value={w.id.toString()}>
                        {w.id} - {w.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Absentismo</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ausente">Ausente</SelectItem>
                    <SelectItem value="Dispensa">Dispensa</SelectItem>
                    <SelectItem value="Presente">Presente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  placeholder="Descreva observações adicionais..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Anexar documento (opcional)
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />

                  {formData.attachment ? (
                    <p className="text-sm font-medium text-foreground">
                      📎 {formData.attachment.name}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Clique para anexar (atestado, justificativa, etc.)
                    </p>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;

                    setFormData((prev) => ({
                      ...prev,
                      attachment: file,
                    }));
                  }}
                />
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
      </div>
    </AppLayout>
  );
};

export default Attendance;
