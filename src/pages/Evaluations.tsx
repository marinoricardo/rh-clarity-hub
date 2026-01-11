import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Star, Download, Upload, FileText, Eye, Plus, ChevronRight, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { WorkerService } from "@/data/services/worker.service";
import Swal from "sweetalert2";
import { EvaluationService } from "@/data/services/evaluations.service";

// Dados de trabalhadores com suas avaliações
const workersWithEvaluations = [
  {
    id: 1,
    name: "Maria Santos",
    cargo: "Analista de RH",
    evaluations: [
      { id: 1, periodo: "2023 - 2º Semestre", nota: "4.5", status: "Concluída", data: "15/12/2023" },
      { id: 2, periodo: "2023 - 1º Semestre", nota: "4.2", status: "Concluída", data: "15/06/2023" },
      { id: 3, periodo: "2022 - 2º Semestre", nota: "3.9", status: "Concluída", data: "15/12/2022" },
    ]
  },
  {
    id: 2,
    name: "João Ferreira",
    cargo: "Desenvolvedor",
    evaluations: [
      { id: 1, periodo: "2023 - 2º Semestre", nota: "4.2", status: "Concluída", data: "14/12/2023" },
      { id: 2, periodo: "2023 - 1º Semestre", nota: "4.0", status: "Concluída", data: "14/06/2023" },
    ]
  },
  {
    id: 3,
    name: "Ana Costa",
    cargo: "Gerente de Vendas",
    evaluations: [
      { id: 1, periodo: "2023 - 2º Semestre", nota: "-", status: "Pendente", data: "-" },
    ]
  },
  {
    id: 4,
    name: "Pedro Lima",
    cargo: "Contador",
    evaluations: [
      { id: 1, periodo: "2023 - 2º Semestre", nota: "-", status: "Em Avaliação", data: "-" },
      { id: 2, periodo: "2023 - 1º Semestre", nota: "3.8", status: "Concluída", data: "10/06/2023" },
    ]
  },
  {
    id: 5,
    name: "Carla Mendes",
    cargo: "Designer",
    evaluations: [
      { id: 1, periodo: "2023 - 2º Semestre", nota: "3.8", status: "Concluída", data: "16/12/2023" },
    ]
  },
  {
    id: 6,
    name: "Lucas Oliveira",
    cargo: "Operador",
    evaluations: []
  },
];

const Evaluations = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [newEvaluationData, setNewEvaluationData] = useState({
    worker_id: "",
    status: "",
    attachment: null as File | null,
  });

  const workerService = new WorkerService();
  const evaluationService = new EvaluationService();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workersData, setWorkersData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const data = await workerService.index(); // chama a API
      setWorkersData(data); // atualiza estado
    } catch (err: any) {
      setError(err.message || "Falha ao carregar trabalhadores");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Muito Bom":
        return <span className="badge-success">Muito Bom</span>;
      case "Mau":
        return <span className="badge-warning">Mau</span>;
      case "Bom":
        return <span className="badge-info">Bom</span>;
      case "Suficiente":
        return <span className="badge-info">Suficiente</span>;
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

  // const filteredWorkers = workersWithEvaluations.filter((worker) => {
  //   const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     worker.cargo.toLowerCase().includes(searchTerm.toLowerCase());

  //   if (filterStatus === "all") return matchesSearch;

  //   const hasStatus = worker.evaluations.some(e => e.status === filterStatus);
  //   return matchesSearch && hasStatus;
  // });

  const filteredWorkers = workersData.filter((worker) => {
    const matchesSearch = worker.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === "all") return matchesSearch;
    const hasStatus = worker.performances.some((e: any) => e.status === filterStatus);
    return matchesSearch && hasStatus;
  });

  const stats = {
    total: workersWithEvaluations.length,
    concluidas: workersWithEvaluations.filter(w => w.evaluations.some(e => e.status === "Concluída")).length,
    pendentes: workersWithEvaluations.filter(w => w.evaluations.some(e => e.status === "Pendente")).length,
    emAvaliacao: workersWithEvaluations.filter(w => w.evaluations.some(e => e.status === "Em Avaliação")).length,
  };

  const handleOpenNewEvaluation = (worker: any) => {
    setSelectedWorker(worker);
    setNewEvaluationData({
      worker_id: worker.id,
      status: "",
      attachment: null,
    });
    setDialogOpen(true);
  };

  const handleSaveEvaluation = async () => {
    try {
      const data = new FormData();

      data.append("worker_id", String(newEvaluationData.worker_id));
      data.append("status", newEvaluationData.status);

      if (newEvaluationData.attachment) {
        data.append("attachment", newEvaluationData.attachment);
      }

      await evaluationService.store(data);
      setDialogOpen(false);
      fetchWorkers();
      await Swal.fire({
        icon: "success",
        title: "Avaliação registrada!",
        text: `Nova avaliação de ${selectedWorker?.full_name} foi salva.`,
        confirmButtonText: "OK",
      });

    } catch (error: any) {
      console.error("Erro ao salvar avaliação:", error);
      setDialogOpen(false);

      Swal.fire({
        icon: "error",
        title: "Erro",
        text: error?.message || "Erro ao salvar avaliação.",
        confirmButtonText: "Fechar",
      });
    }
  };


  return (
    <AppLayout title="Avaliação de Desempenho" subtitle="Gerencie avaliações dos trabalhadores">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Trabalhadores</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Com Avaliações Concluídas</p>
            <p className="text-2xl font-bold text-success">{stats.concluidas}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Avaliações Pendentes</p>
            <p className="text-2xl font-bold text-warning">{stats.pendentes}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Em Avaliação</p>
            <p className="text-2xl font-bold text-info">{stats.emAvaliacao}</p>
          </div>
        </div> */}

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
                <SelectItem value="Muito Bom">Muito Bom</SelectItem>
                <SelectItem value="Bom">Bom</SelectItem>
                <SelectItem value="Suficiente">Suficiente</SelectItem>
                <SelectItem value="Mau">Mau</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Baixar Formulário
          </Button>
        </div>

        {/* Workers with Evaluations List */}
        <div className="space-y-4">
          {filteredWorkers.map((worker) => (
            <div key={worker.id} className="bg-card rounded-xl border border-border overflow-hidden">
              <Accordion type="single" collapsible>
                <AccordionItem value={`worker-${worker.id}`} className="border-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {worker.full_name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-foreground">{worker.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{worker.job_function}</p>
                      </div>
                      <div className="flex items-center gap-4 mr-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Avaliações</p>
                          <p className="font-semibold text-foreground">{worker.performances.length}</p>
                        </div>
                        {worker.performances.length > 0 && (
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Última avaliação</p>
                            <div>{worker.performances[0]?.status || "-"}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-4">
                      {/* Action Button */}
                      <div className="flex justify-end">
                        <Button onClick={() => handleOpenNewEvaluation(worker)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Nova Avaliação
                        </Button>
                      </div>

                      {/* Evaluations Table */}
                      {worker.performances.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow className="table-header">
                              <TableHead>Data</TableHead>
                              <TableHead>Avaliação</TableHead>
                              <TableHead>Anexo</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {worker.performances.map((evaluation) => (
                              <TableRow key={evaluation.id} className="table-row">
                                <TableCell className="text-muted-foreground">{evaluation.perfomance_date}</TableCell>
                                <TableCell>{getStatusBadge(evaluation.status)}</TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm" onClick={() => window.open(evaluation.attachament, "_blank")}>
                                    <Download className="w-4 h-4 mr-1" />
                                    ver
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-8 bg-muted/30 rounded-lg">
                          <Star className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">Nenhuma avaliação registrada</p>
                          <Button
                            variant="primaryLight"
                            size="sm"
                            className="mt-3"
                            onClick={() => handleOpenNewEvaluation(worker)}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Criar primeira avaliação
                          </Button>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>

        {/* New Evaluation Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Nova Avaliação - {selectedWorker?.full_name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Avaliação</Label>
                <Select
                  value={newEvaluationData.status}
                  onValueChange={(value) => setNewEvaluationData({ ...newEvaluationData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma avaliação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Muito Bom">Muito Bom</SelectItem>
                    <SelectItem value="Bom">Bom</SelectItem>
                    <SelectItem value="Suficiente">Suficiente</SelectItem>
                    <SelectItem value="Mau">Mau</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="space-y-2">
                <Label>Anexar formulário de avaliação</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Clique para anexar o formulário preenchido</p>
                </div>
              </div> */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Anexar formulário de avaliação
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />

                  {newEvaluationData.attachment ? (
                    <p className="text-sm font-medium text-foreground">
                      📎 {newEvaluationData.attachment.name}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Clique para anexar o formulário preenchido
                    </p>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;

                    setNewEvaluationData((prev) => ({
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
                <Button onClick={handleSaveEvaluation}>
                  Salvar Avaliação
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Evaluations;
