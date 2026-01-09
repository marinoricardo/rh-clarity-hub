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
import { Search, Star, Download, Upload, FileText, Eye } from "lucide-react";

const evaluationsData = [
  { id: 1, worker: "Maria Santos", periodo: "2023 - 2º Semestre", nota: "4.5", status: "Concluída" },
  { id: 2, worker: "João Ferreira", periodo: "2023 - 2º Semestre", nota: "4.2", status: "Concluída" },
  { id: 3, worker: "Ana Costa", periodo: "2023 - 2º Semestre", nota: "-", status: "Pendente" },
  { id: 4, worker: "Pedro Lima", periodo: "2023 - 2º Semestre", nota: "-", status: "Em Avaliação" },
  { id: 5, worker: "Carla Mendes", periodo: "2023 - 2º Semestre", nota: "3.8", status: "Concluída" },
  { id: 6, worker: "Lucas Oliveira", periodo: "2023 - 2º Semestre", nota: "-", status: "Pendente" },
];

const Evaluations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Concluída":
        return <span className="badge-success">Concluída</span>;
      case "Pendente":
        return <span className="badge-warning">Pendente</span>;
      case "Em Avaliação":
        return <span className="badge-info">Em Avaliação</span>;
      default:
        return <span className="badge-error">{status}</span>;
    }
  };

  const getNotaDisplay = (nota: string) => {
    if (nota === "-") return <span className="text-muted-foreground">-</span>;
    const numNota = parseFloat(nota);
    let color = "text-success";
    if (numNota < 3) color = "text-destructive";
    else if (numNota < 4) color = "text-warning";
    return (
      <div className="flex items-center gap-1">
        <Star className={`w-4 h-4 ${color} fill-current`} />
        <span className={`font-semibold ${color}`}>{nota}/5.0</span>
      </div>
    );
  };

  const filteredData = evaluationsData.filter((item) => {
    const matchesSearch = item.worker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: evaluationsData.length,
    concluidas: evaluationsData.filter(e => e.status === "Concluída").length,
    pendentes: evaluationsData.filter(e => e.status === "Pendente").length,
    emAvaliacao: evaluationsData.filter(e => e.status === "Em Avaliação").length,
  };

  return (
    <AppLayout title="Avaliação de Desempenho" subtitle="Gerencie avaliações dos trabalhadores">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Concluídas</p>
            <p className="text-2xl font-bold text-success">{stats.concluidas}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Pendentes</p>
            <p className="text-2xl font-bold text-warning">{stats.pendentes}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Em Avaliação</p>
            <p className="text-2xl font-bold text-info">{stats.emAvaliacao}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar trabalhador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Concluída">Concluída</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Em Avaliação">Em Avaliação</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Baixar Formulário
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Trabalhador</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead>Status</TableHead>
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
                          {item.worker.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <span className="font-medium">{item.worker}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.periodo}</TableCell>
                  <TableCell>{getNotaDisplay(item.nota)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.status === "Pendente" ? (
                        <Button variant="primaryLight" size="sm">
                          <Upload className="w-4 h-4 mr-1" />
                          Upload
                        </Button>
                      ) : item.status === "Concluída" ? (
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-1" />
                          Avaliar
                        </Button>
                      )}
                    </div>
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

export default Evaluations;
