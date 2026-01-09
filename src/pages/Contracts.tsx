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
import { Search, FileText, Eye, Trash2, AlertTriangle, Download } from "lucide-react";

const contractsData = [
  { id: 1, worker: "Maria Santos", tipo: "CLT", inicio: "15/03/2022", fim: "Indeterminado", estado: "Ativo" },
  { id: 2, worker: "João Ferreira", tipo: "CLT", inicio: "22/07/2021", fim: "Indeterminado", estado: "Ativo" },
  { id: 3, worker: "Ana Costa", tipo: "PJ", inicio: "10/01/2023", fim: "10/01/2024", estado: "A Expirar" },
  { id: 4, worker: "Pedro Lima", tipo: "Temporário", inicio: "05/09/2023", fim: "05/03/2024", estado: "A Expirar" },
  { id: 5, worker: "Carla Mendes", tipo: "Estágio", inicio: "18/11/2022", fim: "18/11/2023", estado: "Expirado" },
  { id: 6, worker: "Lucas Oliveira", tipo: "CLT", inicio: "03/04/2021", fim: "Indeterminado", estado: "Ativo" },
];

const Contracts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("all");
  const [filterEstado, setFilterEstado] = useState("all");

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Ativo":
        return <span className="badge-success">Ativo</span>;
      case "A Expirar":
        return <span className="badge-warning">A Expirar</span>;
      case "Expirado":
        return <span className="badge-error">Expirado</span>;
      default:
        return <span className="badge-info">{estado}</span>;
    }
  };

  const filteredContracts = contractsData.filter((contract) => {
    const matchesSearch = contract.worker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === "all" || contract.tipo === filterTipo;
    const matchesEstado = filterEstado === "all" || contract.estado === filterEstado;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  const expiringContracts = contractsData.filter(c => c.estado === "A Expirar");

  return (
    <AppLayout title="Gestão de Contratos" subtitle="Controle de contratos dos trabalhadores">
      <div className="space-y-6 animate-fade-in">
        {/* Alert for expiring contracts */}
        {expiringContracts.length > 0 && (
          <div className="bg-warning-light rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-warning font-semibold">
                {expiringContracts.length} contrato(s) a expirar
              </p>
              <p className="text-sm text-warning/80">
                Verifique os contratos que precisam ser renovados nos próximos 30 dias.
              </p>
            </div>
            <Button variant="warning" size="sm">
              Ver todos
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">{contractsData.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Ativos</p>
            <p className="text-2xl font-bold text-success">{contractsData.filter(c => c.estado === "Ativo").length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">A Expirar</p>
            <p className="text-2xl font-bold text-warning">{expiringContracts.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Expirados</p>
            <p className="text-2xl font-bold text-destructive">{contractsData.filter(c => c.estado === "Expirado").length}</p>
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
          <Select value={filterTipo} onValueChange={setFilterTipo}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="CLT">CLT</SelectItem>
              <SelectItem value="PJ">PJ</SelectItem>
              <SelectItem value="Temporário">Temporário</SelectItem>
              <SelectItem value="Estágio">Estágio</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterEstado} onValueChange={setFilterEstado}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="A Expirar">A Expirar</SelectItem>
              <SelectItem value="Expirado">Expirado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Trabalhador</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Data Fim</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => (
                <TableRow key={contract.id} className="table-row">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">{contract.worker}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-muted rounded-md text-sm">{contract.tipo}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{contract.inicio}</TableCell>
                  <TableCell className="text-muted-foreground">{contract.fim}</TableCell>
                  <TableCell>{getEstadoBadge(contract.estado)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="iconSm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="iconSm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="iconSm" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

export default Contracts;
