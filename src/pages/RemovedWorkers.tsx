import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, UserX, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkerService } from "@/data/services/worker.service";
import { useNavigate } from "react-router-dom";

const removedWorkersData = [
  { id: 1, name: "Roberto Almeida", cargo: "Técnico", unidade: "UN São Paulo", dataRemocao: "15/12/2023", motivo: "Pedido de demissão" },
  { id: 2, name: "Sandra Oliveira", cargo: "Assistente", unidade: "UN Rio de Janeiro", dataRemocao: "02/11/2023", motivo: "Fim de contrato" },
  { id: 3, name: "Marcos Vieira", cargo: "Operador", unidade: "UN Curitiba", dataRemocao: "20/10/2023", motivo: "Desligamento" },
  { id: 4, name: "Paula Nascimento", cargo: "Analista", unidade: "UN Brasília", dataRemocao: "05/09/2023", motivo: "Fim de estágio" },
];

const RemovedWorkers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const workerService = new WorkerService();
  const [workersData, setWorkersData] = useState<any[]>([]);

  // Busca workers automaticamente ao abrir o componente
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        const data = await workerService.removedWorkers(); // chama a API
        setWorkersData(data); // atualiza estado
      } catch (err: any) {
        setError(err.message || "Falha ao carregar trabalhadores");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const filteredWorkers = workersData.filter((worker) =>
    worker.worker.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatarDataHora = (dataISO: any) => {
    return new Date(dataISO).toLocaleString('pt-BR', {
      timeZone: 'UTC',
    })
  }


  return (
    <AppLayout title="Trabalhadores Removidos" subtitle="Histórico de desligamentos">
      <div className="space-y-6 animate-fade-in">
        {/* Info */}
        <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <UserX className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-foreground font-semibold">
              {workersData.length} trabalhadores removidos
            </p>
            <p className="text-sm text-muted-foreground">
              Histórico de todos os desligamentos realizados
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar trabalhador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Nome do Trabalhador</TableHead>
                {/* <TableHead>Unidade Orgânica</TableHead> */}
                <TableHead>Removido por: </TableHead>
                <TableHead>Quando: </TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Anexo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.map((worker) => (
                <TableRow key={worker.id} className="table-row opacity-70">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-muted-foreground">
                          {worker.worker.full_name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <span className="font-medium text-muted-foreground">{worker.worker.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{worker.user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{formatarDataHora(worker.created_at)}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-muted rounded-md text-sm text-muted-foreground">
                      {worker.reason}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => window.open(worker.attachament, "_blank")}>
                      <Download className="w-4 h-4 mr-1" />
                      Ver documento
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/removed-workers/${worker.id}/history`)}>
                      <Eye className="w-4 h-4 mr-1" />
                      Ver histórico
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredWorkers.length === 0 && (
          <div className="text-center py-12">
            <UserX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-muted-foreground">
              Não encontramos trabalhadores removidos com esse critério.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default RemovedWorkers;
