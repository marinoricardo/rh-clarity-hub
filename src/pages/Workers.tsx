import { useState } from "react";
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
import { Search, Plus, Filter, Eye, MoreHorizontal, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const workersData = [
  { id: 1, name: "Maria Santos", cargo: "Analista de RH", unidade: "UN São Paulo", estado: "Ativo", admissao: "15/03/2022" },
  { id: 2, name: "João Ferreira", cargo: "Desenvolvedor", unidade: "UN Rio de Janeiro", estado: "Ativo", admissao: "22/07/2021" },
  { id: 3, name: "Ana Costa", cargo: "Gerente de Vendas", unidade: "UN Belo Horizonte", estado: "Ativo", admissao: "10/01/2020" },
  { id: 4, name: "Pedro Lima", cargo: "Contador", unidade: "UN São Paulo", estado: "Ativo", admissao: "05/09/2023" },
  { id: 5, name: "Carla Mendes", cargo: "Designer", unidade: "UN Curitiba", estado: "Férias", admissao: "18/11/2022" },
  { id: 6, name: "Lucas Oliveira", cargo: "Operador", unidade: "UN Porto Alegre", estado: "Ativo", admissao: "03/04/2021" },
  { id: 7, name: "Juliana Rocha", cargo: "Assistente Admin", unidade: "UN São Paulo", estado: "Ativo", admissao: "27/06/2023" },
  { id: 8, name: "Roberto Alves", cargo: "Técnico", unidade: "UN Brasília", estado: "Licença", admissao: "14/02/2020" },
];

const Workers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUnidade, setFilterUnidade] = useState("all");
  const [filterEstado, setFilterEstado] = useState("all");

  const filteredWorkers = workersData.filter((worker) => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.cargo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnidade = filterUnidade === "all" || worker.unidade.includes(filterUnidade);
    const matchesEstado = filterEstado === "all" || worker.estado === filterEstado;
    return matchesSearch && matchesUnidade && matchesEstado;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Ativo":
        return <span className="badge-success">Ativo</span>;
      case "Férias":
        return <span className="badge-info">Férias</span>;
      case "Licença":
        return <span className="badge-warning">Licença</span>;
      default:
        return <span className="badge-error">{estado}</span>;
    }
  };

  return (
    <AppLayout title="Trabalhadores" subtitle="Gerencie todos os colaboradores">
      <div className="space-y-6 animate-fade-in">
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
                <SelectItem value="São Paulo">UN São Paulo</SelectItem>
                <SelectItem value="Rio de Janeiro">UN Rio de Janeiro</SelectItem>
                <SelectItem value="Belo Horizonte">UN Belo Horizonte</SelectItem>
                <SelectItem value="Curitiba">UN Curitiba</SelectItem>
                <SelectItem value="Porto Alegre">UN Porto Alegre</SelectItem>
                <SelectItem value="Brasília">UN Brasília</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Férias">Férias</SelectItem>
                <SelectItem value="Licença">Licença</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="default">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={() => navigate("/workers/add")}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Trabalhador
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead className="w-[250px]">Nome</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Data Admissão</TableHead>
                <TableHead>Estado</TableHead>
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
                          {worker.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">{worker.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{worker.cargo}</TableCell>
                  <TableCell className="text-muted-foreground">{worker.unidade}</TableCell>
                  <TableCell className="text-muted-foreground">{worker.admissao}</TableCell>
                  <TableCell>{getEstadoBadge(worker.estado)}</TableCell>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="iconSm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/workers/${worker.id}`)}>
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredWorkers.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Nenhum trabalhador encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Workers;
