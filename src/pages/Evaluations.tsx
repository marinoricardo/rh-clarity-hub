import { useState } from "react";
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
    periodo: "",
    nota: "",
    observacoes: "",
    anexo: null as File | null,
  });

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

  const filteredWorkers = workersWithEvaluations.filter((worker) => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.cargo.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    
    const hasStatus = worker.evaluations.some(e => e.status === filterStatus);
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
      periodo: "",
      nota: "",
      observacoes: "",
      anexo: null,
    });
    setDialogOpen(true);
  };

  const handleSaveEvaluation = () => {
    toast({
      title: "Avaliação registrada!",
      description: `Nova avaliação de ${selectedWorker?.name} foi salva.`,
    });
    setDialogOpen(false);
  };

  return (
    <AppLayout title="Avaliação de Desempenho" subtitle="Gerencie avaliações dos trabalhadores">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                          {worker.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-foreground">{worker.name}</h3>
                        <p className="text-sm text-muted-foreground">{worker.cargo}</p>
                      </div>
                      <div className="flex items-center gap-4 mr-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Avaliações</p>
                          <p className="font-semibold text-foreground">{worker.evaluations.length}</p>
                        </div>
                        {worker.evaluations.length > 0 && (
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Última Nota</p>
                            <div>{getNotaDisplay(worker.evaluations[0]?.nota || "-")}</div>
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
                      {worker.evaluations.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow className="table-header">
                              <TableHead>Período</TableHead>
                              <TableHead>Data</TableHead>
                              <TableHead>Nota</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {worker.evaluations.map((evaluation) => (
                              <TableRow key={evaluation.id} className="table-row">
                                <TableCell className="font-medium">{evaluation.periodo}</TableCell>
                                <TableCell className="text-muted-foreground">{evaluation.data}</TableCell>
                                <TableCell>{getNotaDisplay(evaluation.nota)}</TableCell>
                                <TableCell>{getStatusBadge(evaluation.status)}</TableCell>
                                <TableCell className="text-right">
                                  {evaluation.status === "Pendente" ? (
                                    <Button variant="primaryLight" size="sm">
                                      <Upload className="w-4 h-4 mr-1" />
                                      Upload
                                    </Button>
                                  ) : evaluation.status === "Concluída" ? (
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
              <DialogTitle>Nova Avaliação - {selectedWorker?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Período</Label>
                <Select 
                  value={newEvaluationData.periodo} 
                  onValueChange={(value) => setNewEvaluationData({...newEvaluationData, periodo: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024 - 1º Semestre">2024 - 1º Semestre</SelectItem>
                    <SelectItem value="2023 - 2º Semestre">2023 - 2º Semestre</SelectItem>
                    <SelectItem value="2023 - 1º Semestre">2023 - 1º Semestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nota (0-5)</Label>
                <Input 
                  type="number" 
                  min="0" 
                  max="5" 
                  step="0.1"
                  placeholder="Ex: 4.5"
                  value={newEvaluationData.nota}
                  onChange={(e) => setNewEvaluationData({...newEvaluationData, nota: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea 
                  placeholder="Comentários sobre o desempenho..."
                  value={newEvaluationData.observacoes}
                  onChange={(e) => setNewEvaluationData({...newEvaluationData, observacoes: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Anexar formulário de avaliação</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Clique para anexar o formulário preenchido</p>
                </div>
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
