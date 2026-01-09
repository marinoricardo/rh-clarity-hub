import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  FileText,
  Star,
  DollarSign,
  Clock,
  Download,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const workerData = {
  id: 1,
  name: "Maria Santos",
  cargo: "Analista de RH",
  departamento: "Recursos Humanos",
  unidade: "UN São Paulo",
  estado: "Ativo",
  email: "maria.santos@empresa.com",
  telefone: "+55 11 99999-9999",
  endereco: "Rua das Flores, 123 - São Paulo, SP",
  dataNascimento: "15/05/1990",
  dataAdmissao: "15/03/2022",
  tipoContrato: "CLT",
  documento: "123.456.789-00",
  salario: "R$ 5.500,00",
};

const presencas = [
  { data: "09/01/2024", status: "Presente", horario: "08:00 - 17:00" },
  { data: "08/01/2024", status: "Presente", horario: "08:15 - 17:30" },
  { data: "07/01/2024", status: "Falta", horario: "-", motivo: "Consulta médica" },
  { data: "06/01/2024", status: "Presente", horario: "08:00 - 17:00" },
  { data: "05/01/2024", status: "Presente", horario: "07:55 - 17:15" },
];

const contratos = [
  { tipo: "CLT", inicio: "15/03/2022", fim: "Indeterminado", estado: "Ativo" },
];

const avaliacoes = [
  { periodo: "2023 - 2º Semestre", nota: "4.5/5.0", status: "Concluída" },
  { periodo: "2023 - 1º Semestre", nota: "4.2/5.0", status: "Concluída" },
  { periodo: "2022 - 2º Semestre", nota: "3.8/5.0", status: "Concluída" },
];

const WorkerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Presente":
        return <span className="badge-success">Presente</span>;
      case "Falta":
        return <span className="badge-error">Falta</span>;
      case "Ativo":
        return <span className="badge-success">Ativo</span>;
      case "Concluída":
        return <span className="badge-success">Concluída</span>;
      default:
        return <span className="badge-warning">{status}</span>;
    }
  };

  return (
    <AppLayout title="Detalhes do Trabalhador" subtitle={workerData.name}>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/workers")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex gap-3">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Remover
            </Button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">MS</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{workerData.name}</h2>
                  <p className="text-muted-foreground">{workerData.cargo}</p>
                </div>
                {getStatusBadge(workerData.estado)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{workerData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{workerData.telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{workerData.unidade}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="resumo" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="pessoais">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="empresariais">Dados Empresariais</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="presencas">Presenças</TabsTrigger>
            <TabsTrigger value="contratos">Contratos</TabsTrigger>
            <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="resumo" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="stats-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success-light rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Presenças</p>
                    <p className="text-xl font-bold text-foreground">98%</p>
                  </div>
                </div>
              </div>
              <div className="stats-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avaliação</p>
                    <p className="text-xl font-bold text-foreground">4.5/5</p>
                  </div>
                </div>
              </div>
              <div className="stats-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-info-light rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contrato</p>
                    <p className="text-xl font-bold text-foreground">CLT</p>
                  </div>
                </div>
              </div>
              <div className="stats-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-warning-light rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tempo Empresa</p>
                    <p className="text-xl font-bold text-foreground">1a 10m</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pessoais">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Nome Completo</p>
                  <p className="text-foreground font-medium">{workerData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                  <p className="text-foreground font-medium">{workerData.dataNascimento}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Documento</p>
                  <p className="text-foreground font-medium">{workerData.documento}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground font-medium">{workerData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="text-foreground font-medium">{workerData.telefone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="text-foreground font-medium">{workerData.endereco}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="empresariais">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Informações Empresariais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Cargo</p>
                  <p className="text-foreground font-medium">{workerData.cargo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Departamento</p>
                  <p className="text-foreground font-medium">{workerData.departamento}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unidade</p>
                  <p className="text-foreground font-medium">{workerData.unidade}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Contrato</p>
                  <p className="text-foreground font-medium">{workerData.tipoContrato}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Admissão</p>
                  <p className="text-foreground font-medium">{workerData.dataAdmissao}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Salário</p>
                  <p className="text-foreground font-medium">{workerData.salario}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documentos">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Documentos</h3>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar todos
                </Button>
              </div>
              <div className="space-y-3">
                {["Documento de Identificação", "Comprovante de Residência", "Carteira de Trabalho"].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="text-foreground">{doc}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="presencas">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Motivo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {presencas.map((p, i) => (
                    <TableRow key={i} className="table-row">
                      <TableCell className="font-medium">{p.data}</TableCell>
                      <TableCell>{getStatusBadge(p.status)}</TableCell>
                      <TableCell className="text-muted-foreground">{p.horario}</TableCell>
                      <TableCell className="text-muted-foreground">{p.motivo || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="contratos">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead>Tipo</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Fim</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contratos.map((c, i) => (
                    <TableRow key={i} className="table-row">
                      <TableCell className="font-medium">{c.tipo}</TableCell>
                      <TableCell className="text-muted-foreground">{c.inicio}</TableCell>
                      <TableCell className="text-muted-foreground">{c.fim}</TableCell>
                      <TableCell>{getStatusBadge(c.estado)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="avaliacoes">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead>Período</TableHead>
                    <TableHead>Nota</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {avaliacoes.map((a, i) => (
                    <TableRow key={i} className="table-row">
                      <TableCell className="font-medium">{a.periodo}</TableCell>
                      <TableCell className="text-foreground font-semibold">{a.nota}</TableCell>
                      <TableCell>{getStatusBadge(a.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="financeiro">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Informações Financeiras</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Salário Base</p>
                  <p className="text-foreground font-medium">{workerData.salario}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Benefícios</p>
                  <p className="text-foreground font-medium">R$ 1.200,00</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default WorkerDetails;
