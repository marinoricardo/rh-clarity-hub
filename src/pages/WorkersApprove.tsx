import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Search, Plus, Filter, Eye, MoreHorizontal, Download, Check, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkerService } from "@/data/services/worker.service";
import { CommonService } from "@/data/services/common.service";
import Swal from "sweetalert2";

const WorkersApprove = () => {
  const navigate = useNavigate();
  const [workersData, setWorkersData] = useState<any[]>([]); // agora dinâmico
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterUnidade, setFilterUnidade] = useState("all");
  const [filterEstado, setFilterEstado] = useState("all");

  const workerService = new WorkerService();

  const [commonData, setCommonData] = useState<{
    areas: any[];
    regiaos: any[];
    pelouros: any[];
    unidade_organicas: any[];
    departamentos: any[];
  }>({
    areas: [],
    regiaos: [],
    pelouros: [],
    unidade_organicas: [],
    departamentos: [],
  });

  const commonService = new CommonService();

  // Busca workers automaticamente ao abrir o componente
  useEffect(() => {
    fetchWorkers();
    fetchAllCommonData();
  }, []);

   const fetchWorkers = async () => {
      try {
        setLoading(true);
        const data = await workerService.index(false); // chama a API
        setWorkersData(data); // atualiza estado
      } catch (err: any) {
        setError(err.message || "Falha ao carregar trabalhadores");
      } finally {
        setLoading(false);
      }
    };


  const fetchAllCommonData = async () => {
    const res = await commonService.fetchCommonData();
    setCommonData(res);
    console.log("Common Data:", res);
  }

  const filteredWorkers = workersData.filter((worker) => {
    const matchesSearch =
      worker.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.job_function?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnidade =
      filterUnidade === "all" || worker.employment_data.organizational_unit?.includes(filterUnidade);
    const matchesEstado = filterEstado === "all" || worker.employment_data.status === filterEstado;
    return matchesSearch && matchesUnidade && matchesEstado;
  });


const approveWorker = async (workerId: number) => {
  const result = await Swal.fire({
    title: "Aprovar trabalhador?",
    text: "Tem certeza que deseja aprovar este trabalhador?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, aprovar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#16a34a", // verde
  });

  if (!result.isConfirmed) return;

  try {
    await workerService.approveWorker(workerId);

    Swal.fire({
      title: "Aprovado!",
      text: "O trabalhador foi aprovado com sucesso.",
      icon: "success",
    });

    fetchWorkers();
  } catch (error) {
    Swal.fire({
      title: "Erro",
      text: "Não foi possível aprovar o trabalhador.",
      icon: "error",
    });
  }
};


  return (
    <AppLayout title="Trabalhadores" subtitle="Gerencie todos os colaboradores pendentes">
      <div className="space-y-6 animate-fade-in">
        {loading && <p>Carregando trabalhadores...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome ou cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterUnidade} onValueChange={setFilterUnidade}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Unidades</SelectItem>
                {commonData.unidade_organicas.map((un) => (
                  <SelectItem key={un.id} value={un.name}>
                    {un.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="activo">Ativo</SelectItem>
                <SelectItem value="inactivo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">{workersData.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Ativos</p>
            <p className="text-2xl font-bold text-success">{workersData.filter(w => w.estado === "Ativo").length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Férias</p>
            <p className="text-2xl font-bold text-info">{workersData.filter(w => w.estado === "Férias").length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Licença</p>
            <p className="text-2xl font-bold text-warning">{workersData.filter(w => w.estado === "Licença").length}</p>
          </div>
        </div> */}

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead className="w-[250px]">Nome Completo</TableHead>
                <TableHead>Unidade Organica</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Tipo Contrato</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.map((worker) => (
                <TableRow key={worker.id} className="table-row">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {worker.full_name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">{worker.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{worker?.employment_data.organizational_unit}</TableCell>
                  <TableCell className="text-muted-foreground">{worker.job_function}</TableCell>
                  <TableCell className="text-muted-foreground">{worker?.employment_data.contract_type}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/workers/${worker.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button
    className="bg-green-600 hover:bg-green-700 text-white"
    onClick={() => approveWorker(worker.id)}

  >
    <Check className="w-4 h-4 mr-2" />
    Aprovar
  </Button>

                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredWorkers.length === 0 && !loading && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Nenhum trabalhador encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default WorkersApprove;
