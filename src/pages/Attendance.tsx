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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Calendar, Check, X, AlertTriangle, Upload, Plus, FileText, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const attendanceData = [
  { id: 1, codigo: "TRB001", name: "Maria Santos", dataInicio: "09/01/2024", dataFim: "09/01/2024", absentismo: "Não", observacoes: "-", anexo: null },
  { id: 2, codigo: "TRB002", name: "João Ferreira", dataInicio: "09/01/2024", dataFim: "09/01/2024", absentismo: "Não", observacoes: "-", anexo: null },
  { id: 3, codigo: "TRB003", name: "Ana Costa", dataInicio: "09/01/2024", dataFim: "09/01/2024", absentismo: "Sim", observacoes: "Consulta médica", anexo: "atestado.pdf" },
  { id: 4, codigo: "TRB004", name: "Pedro Lima", dataInicio: "09/01/2024", dataFim: "09/01/2024", absentismo: "Parcial", observacoes: "Saída antecipada", anexo: null },
  { id: 5, codigo: "TRB005", name: "Carla Mendes", dataInicio: "09/01/2024", dataFim: "09/01/2024", absentismo: "Não", observacoes: "-", anexo: null },
  { id: 6, codigo: "TRB006", name: "Lucas Oliveira", dataInicio: "09/01/2024", dataFim: "09/01/2024", absentismo: "Não", observacoes: "-", anexo: null },
];

const Attendance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("2024-01-09");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    workerId: "",
    dataInicio: "",
    dataFim: "",
    absentismo: "Não",
    observacoes: "",
    anexo: null as File | null,
  });

  const getAbsentismoBadge = (absentismo: string) => {
    switch (absentismo) {
      case "Não":
        return <span className="badge-success">Não</span>;
      case "Sim":
        return <span className="badge-error">Sim</span>;
      case "Parcial":
        return <span className="badge-warning">Parcial</span>;
      default:
        return <span className="badge-info">{absentismo}</span>;
    }
  };

  const handleOpenForm = () => {
    setFormData({
      workerId: "",
      dataInicio: "",
      dataFim: "",
      absentismo: "Não",
      observacoes: "",
      anexo: null,
    });
    setDialogOpen(true);
  };

  const handleSaveAttendance = () => {
    toast({
      title: "Presença registrada!",
      description: "O registo de presença foi salvo com sucesso.",
    });
    setDialogOpen(false);
  };

  const filteredData = attendanceData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "presente" && item.absentismo === "Não") ||
      (filterStatus === "absentismo" && item.absentismo !== "Não");
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: attendanceData.length,
    presentes: attendanceData.filter(a => a.absentismo === "Não").length,
    absentismo: attendanceData.filter(a => a.absentismo === "Sim").length,
    parcial: attendanceData.filter(a => a.absentismo === "Parcial").length,
  };

  return (
    <AppLayout title="Gestão de Presenças" subtitle="Controle de presenças e faltas">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
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
              <p className="text-sm text-muted-foreground">Absentismo</p>
            </div>
            <p className="text-2xl font-bold text-destructive">{stats.absentismo}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <p className="text-sm text-muted-foreground">Parcial</p>
            </div>
            <p className="text-2xl font-bold text-warning">{stats.parcial}</p>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por código ou nome..."
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
                <SelectItem value="presente">Presentes</SelectItem>
                <SelectItem value="absentismo">Absentismo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleOpenForm}>
            <Plus className="w-4 h-4 mr-2" />
            Registrar Presença
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Código</TableHead>
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
                  <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
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
                  <TableCell className="text-muted-foreground">{item.dataInicio}</TableCell>
                  <TableCell className="text-muted-foreground">{item.dataFim}</TableCell>
                  <TableCell>{getAbsentismoBadge(item.absentismo)}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {item.observacoes}
                  </TableCell>
                  <TableCell>
                    {item.anexo ? (
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        {item.anexo}
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
                  value={formData.workerId} 
                  onValueChange={(value) => setFormData({...formData, workerId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o trabalhador" />
                  </SelectTrigger>
                  <SelectContent>
                    {attendanceData.map(w => (
                      <SelectItem key={w.id} value={w.id.toString()}>
                        {w.codigo} - {w.name}
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
                    value={formData.dataInicio}
                    onChange={(e) => setFormData({...formData, dataInicio: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  <Input 
                    type="date" 
                    value={formData.dataFim}
                    onChange={(e) => setFormData({...formData, dataFim: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Absentismo</Label>
                <Select 
                  value={formData.absentismo} 
                  onValueChange={(value) => setFormData({...formData, absentismo: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Não">Não</SelectItem>
                    <SelectItem value="Sim">Sim</SelectItem>
                    <SelectItem value="Parcial">Parcial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea 
                  placeholder="Descreva observações adicionais..."
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Anexar documento (opcional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Clique para anexar (atestado, justificativa, etc.)</p>
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
      </div>
    </AppLayout>
  );
};

export default Attendance;
