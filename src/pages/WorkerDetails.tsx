import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Upload,
} from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkerService } from "@/data/services/worker.service";
import { toast } from "@/hooks/use-toast";
import Swal from "sweetalert2";

const motivosRemocao = [
  { value: "Reforma", label: "Reforma" },
  { value: "Falecimento", label: "Falecimento" },
  { value: "Recisão", label: "Recisão" },
  { value: "Despedimento", label: "Despedimento" },
  { value: "Fim do Contrato", label: "Fim do Contrato" },
];

const WorkerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workerData, setWorkerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [removeData, setRemoveData] = useState({
    worker_id: "",
    reason: "",
    attachament: null as File | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);


  const workerService = new WorkerService();

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        setLoading(true);
        const res = await workerService.show(Number(id));
        console.log("detalhes.. " + res)
        setWorkerData(res);
      } catch (err: any) {
        setError(err.message || "Falha ao carregar os dados do trabalhador");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchWorker();
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "presente":
        return <span className="badge-success">Presente</span>;
      case "falta":
        return <span className="badge-error">Falta</span>;
      case "ativo":
        return <span className="badge-success">Ativo</span>;
      case "concluída":
      case "completed":
        return <span className="badge-success">Concluída</span>;
      default:
        return <span className="badge-warning">{status}</span>;
    }
  };

  const handleRemoveWorker = async () => {
    if (!removeData.reason) {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Por favor, selecione o motivo da remoção.",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const data = new FormData();

      data.append("worker_id", id);
      data.append("reason", removeData.reason);

      if (removeData.attachament) {
        data.append("attachament", removeData.attachament);
      }

      // 🔴 FECHA O DIALOG ANTES DO ALERT
      setRemoveDialogOpen(false);

      // chamada ao backend
      await workerService.removedWorker(data);

      await Swal.fire({
        icon: "success",
        title: "Trabalhador removido",
        text: "O trabalhador foi removido com sucesso.",
        confirmButtonText: "OK",
      });

      navigate("/workers");
    } catch (error: any) {
      console.error("Erro ao remover trabalhador:", error);

      Swal.fire({
        icon: "error",
        title: "Erro",
        text: error?.message || "Erro ao remover trabalhador.",
        confirmButtonText: "Fechar",
      });
    }
  };

  const getDocumentName = (field) => {
    const map = {
      nuit_document_url: 'Documento de NUIT',
      identity_document_url: 'Documento de Identificação',
      education_certificate_url: 'Certificado de Educação',
      cv_url: 'Currículo',
      other_certifications_url: 'Outros Certificados',
      declaracao_documento_url: "Declaração Dados Bancarios"
    };

    return map[field] || field;
  };


  if (loading) return <p className="text-center mt-10">Carregando dados do trabalhador...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!workerData) return null;

  return (
    <AppLayout title="Detalhes do Trabalhador" subtitle={workerData.full_name}>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/workers")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate(`/workers/edit/${id}`)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remover
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Remover Trabalhador</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <p className="text-muted-foreground">
                    Tem certeza que deseja remover <strong>{workerData.full_name}</strong>?
                    Esta ação irá mover o trabalhador para a lista de removidos.
                  </p>

                  <div className="space-y-2">
                    <Label>Motivo da Remoção *</Label>
                    <Select
                      value={removeData.reason}
                      onValueChange={(value) => setRemoveData({ ...removeData, reason: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o motivo" />
                      </SelectTrigger>
                      <SelectContent>
                        {motivosRemocao.map((motivo) => (
                          <SelectItem key={motivo.value} value={motivo.value}>
                            {motivo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Anexar documento
                    </label>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />

                      {removeData.attachament ? (
                        <p className="text-sm font-medium text-foreground">
                          📎 {removeData.attachament.name}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Clique para anexar o documento
                        </p>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;

                        setRemoveData((prev) => ({
                          ...prev,
                          attachament: file,
                        }));
                      }}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setRemoveDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleRemoveWorker}>
                      Confirmar Remoção
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">
                  {workerData.full_name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{workerData.full_name}</h2>
                  <p className="text-muted-foreground">{workerData.job_function}</p>
                </div>
                {getStatusBadge(workerData.active ? "ativo" : "inativo")}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{workerData.work_email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{workerData.work_contact}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{workerData.employment_data?.organizational_unit}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pessoais" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="pessoais">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="empresariais">Dados Empresariais</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="presencas">Presenças</TabsTrigger>
            <TabsTrigger value="contratos">Contratos</TabsTrigger>
            <TabsTrigger value="avaliacoes">Desempenho</TabsTrigger>
          </TabsList>

          <TabsContent value="pessoais">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Nome Completo</p>
                  <p className="text-foreground font-medium">{workerData.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                  <p className="text-foreground font-medium">
                    {new Date(workerData.date_of_birth).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Número de Contribuinte (NUIT)</p>
                  <p className="text-foreground font-medium">{workerData.tax_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gênero</p>
                  <p className="text-foreground font-medium">{workerData.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado Civil</p>
                  <p className="text-foreground font-medium">{workerData.marital_status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Documento</p>
                  <p className="text-foreground font-medium">{workerData.document_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Número do Documento</p>
                  <p className="text-foreground font-medium">{workerData.document_number}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Banco</p>
                  <p className="text-foreground font-medium">{workerData.bank}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">NIB/IBAN</p>
                  <p className="text-foreground font-medium">{workerData.nib_iban}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email Profissional</p>
                  <p className="text-foreground font-medium">{workerData.work_email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email Alternativo</p>
                  <p className="text-foreground font-medium">{workerData.alternative_email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contato Profissional</p>
                  <p className="text-foreground font-medium">{workerData.work_contact}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contato Alternativo</p>
                  <p className="text-foreground font-medium">{workerData.alternative_contact}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone Pessoal</p>
                  <p className="text-foreground font-medium">{workerData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="text-foreground font-medium">
                    {workerData.address}, {workerData.neighborhood}, {workerData.district}, {workerData.province}, {workerData.city}, codigo postal: {workerData.postal_box}
                  </p>
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
                  <p className="text-foreground font-medium">{workerData.job_function}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unidade Organica</p>
                  <p className="text-foreground font-medium">{workerData.employment_data?.organizational_unit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pelouro</p>
                  <p className="text-foreground font-medium">{workerData.employment_data?.pelouro}</p>
                </div>
                {/* <div>
                  <p className="text-sm text-muted-foreground">Área</p>
                  <p className="text-foreground font-medium">{workerData.employment_data?.area}</p>
                </div> */}
                <div>
                  <p className="text-sm text-muted-foreground">Departamento</p>
                  <p className="text-foreground font-medium">{workerData.employment_data?.sector}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Contrato</p>
                  <p className="text-foreground font-medium">{workerData.employment_data?.contract_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Admissão</p>
                  <p className="text-foreground font-medium">
                    {workerData.employment_data?.hire_date ? new Date(workerData.employment_data.hire_date).toLocaleDateString("pt-BR") : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Término do Contrato</p>
                  <p className="text-foreground font-medium">
                    {workerData.employment_data?.end_date ? new Date(workerData.employment_data.end_date).toLocaleDateString("pt-BR") : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nível Acadêmico</p>
                  <p className="text-foreground font-medium">{workerData.employment_data?.academic_level}</p>
                </div>
                {/* <div>
                  <p className="text-sm text-muted-foreground">Região</p>
                  <p className="text-foreground font-medium">{workerData.employment_data?.region}</p>
                </div> */}
                <div>
                  <p className="text-sm text-muted-foreground">Salário</p>
                  <p className="text-foreground font-medium">{Number(workerData.employment_data?.salary || 0).toFixed(2)} MZN</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-foreground font-medium">{workerData.employment_data?.status}</p>
                </div>
              </div>
            </div>
          </TabsContent>


          <TabsContent value="documentos">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Documentos</h3>
                {/* <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar todos
                </Button> */}
              </div>
              <div className="space-y-3">
                {workerData.documents && Object.entries(workerData.documents).map(([key, url]: any, i) => {
                  if (key.endsWith("_url") && url) {
                    const label = getDocumentName(key);
                    // const label = key.replace("_url", "").replace(/_/g, " ");
                    return (
                      <div key={i} className="flex items-center justify-between bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="text-foreground capitalize">{label}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => window.open(url, "_blank")}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  }
                  return null;
                })}
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
                    <TableHead>Motivo</TableHead>
                    <TableHead>Anexo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workerData.attendances?.map((p: any, i: number) => (
                    <TableRow key={i} className="table-row">
                      <TableCell className="font-medium">{p.start_date} - {p.end_date}</TableCell>
                      <TableCell>{getStatusBadge(p.status)}</TableCell>
                      <TableCell className="text-muted-foreground">{p.reason || "-"}</TableCell>
                      <TableCell>
                        {p.attachment ? (
                          <Button variant="ghost" size="sm" onClick={() => window.open(p.attachment, "_blank")}>
                            <Download className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
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
                  {workerData.contracts?.map((c: any, i: number) => (
                    <TableRow key={i} className="table-row">
                      <TableCell className="font-medium">{c.contract_type}</TableCell>
                      <TableCell className="text-muted-foreground">{c.start_date}</TableCell>
                      <TableCell className="text-muted-foreground">{c.end_date}</TableCell>
                      <TableCell>{getStatusBadge(c.status)}</TableCell>
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
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workerData.performances?.map((a: any, i: number) => (
                    <TableRow key={i} className="table-row">

                      <TableCell className="font-medium">{new Date(a.perfomance_date).toLocaleDateString("pt-PT")}</TableCell>
                      <TableCell>{getStatusBadge(a.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => window.open(a.attachament, "_blank")}>
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
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default WorkerDetails;
