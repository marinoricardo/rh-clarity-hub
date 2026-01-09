import { useState } from "react";
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
import { Search, UserX, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const removedWorkersData = [
  { id: 1, name: "Roberto Almeida", cargo: "Técnico", unidade: "UN São Paulo", dataRemocao: "15/12/2023", motivo: "Pedido de demissão" },
  { id: 2, name: "Sandra Oliveira", cargo: "Assistente", unidade: "UN Rio de Janeiro", dataRemocao: "02/11/2023", motivo: "Fim de contrato" },
  { id: 3, name: "Marcos Vieira", cargo: "Operador", unidade: "UN Curitiba", dataRemocao: "20/10/2023", motivo: "Desligamento" },
  { id: 4, name: "Paula Nascimento", cargo: "Analista", unidade: "UN Brasília", dataRemocao: "05/09/2023", motivo: "Fim de estágio" },
];

const RemovedWorkers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWorkers = removedWorkersData.filter((worker) =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              {removedWorkersData.length} trabalhadores removidos
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
                <TableHead>Nome</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Data Remoção</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.map((worker) => (
                <TableRow key={worker.id} className="table-row opacity-70">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-muted-foreground">
                          {worker.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <span className="font-medium text-muted-foreground">{worker.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{worker.cargo}</TableCell>
                  <TableCell className="text-muted-foreground">{worker.unidade}</TableCell>
                  <TableCell className="text-muted-foreground">{worker.dataRemocao}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-muted rounded-md text-sm text-muted-foreground">
                      {worker.motivo}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
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
