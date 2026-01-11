import { useEffect, useState } from "react";
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
import { Search, FileText, Eye, Trash2, AlertTriangle, Download, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkerService } from "@/data/services/worker.service";

// const contractsData = [
//   { id: 1, nomeCompleto: "Maria Santos", unidadeOrganica: "UN São Paulo", funcao: "Analista de RH", tipoContrato: "CLT", dataFim: "Indeterminado", estado: "Ativo" },
//   { id: 2, nomeCompleto: "João Ferreira", unidadeOrganica: "UN Rio de Janeiro", funcao: "Desenvolvedor", tipoContrato: "CLT", dataFim: "Indeterminado", estado: "Ativo" },
//   { id: 3, nomeCompleto: "Ana Costa", unidadeOrganica: "UN Belo Horizonte", funcao: "Gerente de Vendas", tipoContrato: "PJ", dataFim: "10/01/2024", estado: "A Expirar" },
//   { id: 4, nomeCompleto: "Pedro Lima", unidadeOrganica: "UN São Paulo", funcao: "Contador", tipoContrato: "Temporário", dataFim: "05/03/2024", estado: "A Expirar" },
//   { id: 5, nomeCompleto: "Carla Mendes", unidadeOrganica: "UN Curitiba", funcao: "Designer", tipoContrato: "Estágio", dataFim: "18/11/2023", estado: "Expirado" },
//   { id: 6, nomeCompleto: "Lucas Oliveira", unidadeOrganica: "UN Porto Alegre", funcao: "Operador", tipoContrato: "CLT", dataFim: "Indeterminado", estado: "Ativo" },
// ];

const Contracts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("all");
  const [filterEstado, setFilterEstado] = useState("all");
  const [workersData, setWorkersData] = useState<any[]>([]); // agora dinâmico
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const workerService = new WorkerService();

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

  const getContractStatus = (
    hireDate?: string | null,
    endDate?: string | null
  ) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (hireDate) {
      const start = new Date(hireDate);
      start.setHours(0, 0, 0, 0);
      if (today < start) return "Ainda não iniciado";
    }

    if (!endDate) return "Ativo";

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    return end >= today ? "Ativo" : "Expirado";
  };


  const formatarDataHora = (dataISO: any) => {
    return new Date(dataISO).toLocaleDateString('pt-BR', {
      timeZone: 'UTC',
    })
  }

  // const filteredContracts = contractsData.filter((contract) => {
  //   const matchesSearch = contract.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     contract.funcao.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesTipo = filterTipo === "all" || contract.tipoContrato === filterTipo;
  //   const matchesEstado = filterEstado === "all" || contract.estado === filterEstado;
  //   return matchesSearch && matchesTipo && matchesEstado;
  // });
  const filteredContracts = workersData.filter((worker) => {
    const matchesSearch = worker.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.job_function.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getExpiringContracts = (contracts: any[], days = 30) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const limitDate = new Date();
    limitDate.setDate(today.getDate() + days);
    limitDate.setHours(0, 0, 0, 0);

    return contracts.filter((contract) => {
      const endDate = contract?.employment_data?.end_date;
      if (!endDate) return false;

      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);

      return end >= today && end <= limitDate;
    });
  };


  // const expiringContracts = contractsData.filter(c => c.estado === "A Expirar");
  const expiringContracts = getExpiringContracts(filteredContracts, 30);

  


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
            {/* <Button variant="warning" size="sm">
              Ver todos
            </Button> */}
          </div>
        )}

        {/* Stats */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">
              {totalContracts}
            </p>
          </div>

          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Ativos</p>
            <p className="text-2xl font-bold text-success">
              {activeContracts.length}
            </p>
          </div>

          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">A Expirar</p>
            <p className="text-2xl font-bold text-warning">
              {expiringContracts.length}
            </p>
          </div>

          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Expirados</p>
            <p className="text-2xl font-bold text-destructive">
              {expiredContracts.length}
            </p>
          </div>
        </div> */}


        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome ou função..."
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
              <SelectItem value="Certo">Certo</SelectItem>
              <SelectItem value="Incerto">Incerto</SelectItem>
              <SelectItem value="Indeterminado">Indeterminado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterEstado} onValueChange={setFilterEstado}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Expirado">Expirado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Nome Completo</TableHead>
                <TableHead>Unidade Orgânica</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Tipo de Contrato</TableHead>
                <TableHead>Data de Contratação</TableHead>
                <TableHead>Data Fim do Contrato</TableHead>
                <TableHead>Estado do Contrato</TableHead>
                <TableHead className="text-right">Acção</TableHead>
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
                      <span className="font-medium">{contract.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{contract.employment_data.organizational_unit}</TableCell>
                  <TableCell className="text-muted-foreground">{contract.job_function}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-muted rounded-md text-sm">{contract.employment_data.contract_type}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatarDataHora(contract.employment_data.hire_date)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatarDataHora(contract.employment_data.end_date)}</TableCell>
                  <TableCell>{getEstadoBadge(getContractStatus(contract.employment_data.hire_date, contract.employment_data.end_date))}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="sm">
                      Reencontratar
                    </Button>
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
