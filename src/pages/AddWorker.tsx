import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ArrowLeft, ArrowRight, Upload, X, FileText, Loader2 } from "lucide-react";
import { WorkerService } from "@/data/services/worker.service";
import Swal from "sweetalert2";
import { CommonService } from "@/data/services/common.service";
import { set } from "date-fns";

const steps = [
  { id: 1, title: "Dados Pessoais", description: "Informações básicas" },
  { id: 2, title: "Dados Empresariais", description: "Informações profissionais" },
  { id: 3, title: "Documentos", description: "Ficheiros necessários" },
];

const AddWorker = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [currentStep, setCurrentStep] = useState(1);
  const [workerId, setWorkerId] = useState<number | string | undefined>(id);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
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

  const workerService = new WorkerService();
  const commonService = new CommonService();

  const [nuitFile, setNuitFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [otherFile, setOtherFile] = useState<File | null>(null);


  const [personalData, setPersonalData] = useState({
    full_name: "",
    date_of_birth: "",
    tax_number: "",
    gender: "",
    marital_status: "",
    document_type: "",
    document_number: "",
    province: "",
    district: "",
    address: "",
    neighborhood: "",
    postal_box: "",
    city: "",
    work_email: "",
    alternative_email: "",
    work_contact: "",
    alternative_contact: "",
    phone: "",
    job_function: "",
  });

  const [companyData, setCompanyData] = useState({
    hire_date: "",
    end_date: "",
    inss_number: "",
    contract_type: "",
    academic_level: "",
    area: "",
    region: "",
    department: "",
    organic_unit: "",
    sector: "",
    salary: "",
    status: "activo",
  });

  // Fetch worker data if in edit mode
  useEffect(() => {
    fetchAllCommonData();
    if (isEditMode && id) {
      fetchWorkerData();
    }
  }, [id, isEditMode]);

  const fetchAllCommonData = async () => {
    const res = await commonService.fetchCommonData();
    setCommonData(res);
    console.log("Common Data:", res);
  }

  const fetchWorkerData = async () => {
    setIsFetching(true);
    try {
      const worker = await workerService.show(id!);
      // Populate personal data
      setPersonalData({
        full_name: worker.full_name || "",
        date_of_birth: worker.date_of_birth || "",
        tax_number: worker.tax_number || "",
        gender: worker.gender || "",
        marital_status: worker.marital_status || "",
        document_type: worker.document_type || "",
        document_number: worker.document_number || "",
        province: worker.province || "",
        district: worker.district || "",
        address: worker.address || "",
        neighborhood: worker.neighborhood || "",
        postal_box: worker.postal_box || "",
        city: worker.city || "",
        work_email: worker.work_email || "",
        alternative_email: worker.alternative_email || "",
        work_contact: worker.work_contact || "",
        alternative_contact: worker.alternative_contact || "",
        phone: worker.phone || "",
        job_function: worker.job_function || "",
      });
      // Populate company data
      setCompanyData({
        hire_date: worker.employment_data?.hire_date || "",
        end_date: worker.employment_data?.end_date || "",
        inss_number: worker.employment_data?.inss_number || "",
        contract_type: worker.employment_data?.contract_type || "",
        academic_level: worker.employment_data?.academic_level || "",
        area: worker.employment_data?.area || "",
        region: worker.employment_data?.region || "",
        department: worker.employment_data?.department || "",
        organic_unit: worker.employment_data?.organic_unit || "",
        sector: worker.employment_data?.sector || "",
        salary: worker.employment_data?.salary || "",
        status: worker.employment_data?.status || "activo",
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Erro ao carregar",
        text: err.message || "Não foi possível carregar os dados do trabalhador.",
        confirmButtonText: "OK",
      });
      navigate("/workers");
    } finally {
      setIsFetching(false);
    }
  };

  const handleNext = async () => {
    setIsLoading(true);

    if (currentStep === 1) {
      console.log("isEditMode:", isEditMode, "workerId:", workerId);
      try {
        if (isEditMode && workerId) {
          // Update existing worker
          await workerService.update(workerId as number, personalData);
          setCurrentStep(currentStep + 1);
        } else {
          // Create new worker
          const response = await workerService.store(personalData);
          setWorkerId(response.id);
          setCurrentStep(currentStep + 1);
        }
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Erro no registro",
          text: err.message || "Ocorreu um erro ao registrar os dados pessoais.",
          confirmButtonText: "OK",
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (currentStep === 2) {
      try {
        await workerService.storeCompanyData(workerId!, companyData);
        setCurrentStep(currentStep + 1);
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Erro no registro",
          text: err.message || "Ocorreu um erro ao registrar os dados empresariais.",
          confirmButtonText: "OK",
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNuitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNuitFile(e.target.files?.[0] || null);
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdFile(e.target.files?.[0] || null);
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertificateFile(e.target.files?.[0] || null);
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvFile(e.target.files?.[0] || null);
  };

  const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherFile(e.target.files?.[0] || null);
  };



  const handleSave = async () => {
    setIsLoading(true);
    try {
      const filesToUpload: Record<string, File> = {};

      if (nuitFile) filesToUpload["nuit_document"] = nuitFile;
      if (idFile) filesToUpload["identity_document"] = idFile;
      if (certificateFile) filesToUpload["education_certificate"] = certificateFile;
      if (cvFile) filesToUpload["cv"] = cvFile;
      if (otherFile) filesToUpload["other_certifications"] = otherFile;

      if (Object.keys(filesToUpload).length > 0) {
        await workerService.uploadWorkerDocuments(workerId!, filesToUpload);
      }

      Swal.fire({
        icon: "success",
        title: isEditMode ? "Trabalhador actualizado!" : "Trabalhador adicionado!",
        text: isEditMode
          ? "Os dados foram actualizados com sucesso."
          : "O cadastro foi realizado com sucesso.",
        confirmButtonText: "OK",
      });

      navigate("/workers");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Erro no registro",
        text: err.message || "Ocorreu um erro ao registrar os documentos do trabalhador.",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = () => {
    // Simulate file upload
    setUploadedFiles([...uploadedFiles, `documento_${uploadedFiles.length + 1}.pdf`]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  if (isFetching) {
    return (
      <AppLayout
        title={isEditMode ? "Editar Trabalhador" : "Adicionar Trabalhador"}
        subtitle="Carregando dados..."
      >
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={isEditMode ? "Editar Trabalhador" : "Adicionar Trabalhador"}
      subtitle={isEditMode ? "Atualize os dados do colaborador" : "Preencha os dados do novo colaborador"}
    >
      <div className="max-w-8xl mx-auto animate-fade-in">
        {/* Enhanced Stepper */}
        <div className="mb-8">
          <div className="relative">
            {/* Progress Bar Background */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-border mx-16" />
            {/* Progress Bar Fill */}
            <div
              className="absolute top-6 left-0 h-1 bg-primary transition-all duration-500 mx-16"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`, maxWidth: 'calc(100% - 8rem)' }}
            />

            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  {/* Step Circle */}
                  <div
                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 shadow-md ${currentStep > step.id
                      ? "bg-success text-success-foreground"
                      : currentStep === step.id
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-card border-2 border-border text-muted-foreground"
                      }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      step.id
                    )}
                  </div>

                  {/* Step Labels */}
                  <div className="mt-4 text-center">
                    <p className={`font-semibold transition-colors ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                      }`}>
                      {step.title}
                    </p>
                    <p className={`text-xs mt-1 transition-colors ${currentStep >= step.id ? "text-muted-foreground" : "text-muted-foreground/60"
                      }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-card rounded-xl border border-border p-8">
          {/* Step 1: Dados Pessoais */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground mb-6">Dados Pessoais</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="md:col-span-2 lg:col-span-3 space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input id="nome" placeholder="Digite o nome completo" value={personalData.full_name} onChange={(e) => setPersonalData({ ...personalData, full_name: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                  <Input id="dataNascimento" type="date" value={personalData.date_of_birth} onChange={(e) => setPersonalData({ ...personalData, date_of_birth: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nuit">NUIT *</Label>
                  <Input id="nuit" placeholder="Número Único de Identificação" value={personalData.tax_number} onChange={(e) => setPersonalData({ ...personalData, tax_number: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genero">Gênero *</Label>
                  <Select value={personalData.gender} onValueChange={(e) => setPersonalData({ ...personalData, gender: e })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estadoCivil">Estado Civil *</Label>
                  <Select value={personalData.marital_status} onValueChange={(e) => setPersonalData({ ...personalData, marital_status: e })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado civil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                      <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                      <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                      <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipoDocumento">Tipo de Documento *</Label>
                  <Select value={personalData.document_type} onValueChange={(e) => setPersonalData({ ...personalData, document_type: e })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BI (Bilhete de Identidade)">BI (Bilhete de Identidade)</SelectItem>
                      <SelectItem value="Carta de Condução">Carta de Condução</SelectItem>
                      <SelectItem value="Passaporte">Passaporte</SelectItem>
                      <SelectItem value="Cartão de Eleitor">Cartão de Eleitor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numeroDocumento">Número do Documento *</Label>
                  <Input id="numeroDocumento" placeholder="Digite o número" value={personalData.document_number} onChange={(e) => setPersonalData({ ...personalData, document_number: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provincia">Província *</Label>
                  <Select value={personalData.province} onValueChange={(e) => setPersonalData({ ...personalData, province: e })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a província" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sofala">Sofala</SelectItem>
                      <SelectItem value="inhambane">Inhambane</SelectItem>
                      <SelectItem value="gaza">Gaza</SelectItem>
                      <SelectItem value="maputo">Maputo</SelectItem>
                      <SelectItem value="manica">Manica</SelectItem>
                      <SelectItem value="tete">Tete</SelectItem>
                      <SelectItem value="zambesia">Zambezia</SelectItem>
                      <SelectItem value="nampula">Nampula</SelectItem>
                      <SelectItem value="niassa">Niassa</SelectItem>
                      <SelectItem value="cabo-delgado">Cabo Delgado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distrito">Distrito *</Label>
                  <Input id="distrito" placeholder="Digite o distrito" value={personalData.district} onChange={(e) => setPersonalData({ ...personalData, district: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço *</Label>
                  <Input id="endereco" placeholder="Rua e número" value={personalData.address} onChange={(e) => setPersonalData({ ...personalData, address: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input id="bairro" placeholder="Digite o bairro" value={personalData.neighborhood} onChange={(e) => setPersonalData({ ...personalData, neighborhood: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caixaPostal">Caixa Postal</Label>
                  <Input id="caixaPostal" placeholder="Digite a caixa postal" value={personalData.postal_box} onChange={(e) => setPersonalData({ ...personalData, postal_box: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade / Localidade *</Label>
                  <Input id="cidade" placeholder="Digite a cidade" value={personalData.city} onChange={(e) => setPersonalData({ ...personalData, city: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailProfissional">Email Profissional *</Label>
                  <Input id="emailProfissional" type="email" placeholder="email.profissional@empresa.com" value={personalData.work_email} onChange={(e) => setPersonalData({ ...personalData, work_email: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailAlternativo">Email Alternativo</Label>
                  <Input id="emailAlternativo" type="email" placeholder="email.alternativo@exemplo.com" value={personalData.alternative_email} onChange={(e) => setPersonalData({ ...personalData, alternative_email: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contatoProfissional">Contacto Profissional</Label>
                  <Input id="contatoProfissional" placeholder="+258 82 XXX XXXX" value={personalData.work_contact} onChange={(e) => setPersonalData({ ...personalData, work_contact: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contatoAlternativo">Contacto Alternativo</Label>
                  <Input id="contatoAlternativo" placeholder="+258 82 XXX XXXX" value={personalData.alternative_contact} onChange={(e) => setPersonalData({ ...personalData, alternative_contact: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Cel / Tel *</Label>
                  <Input id="telefone" placeholder="+258 82 XXX XXXX" value={personalData.phone} onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="funcao">Função *</Label>
                  <Input id="funcao" placeholder="Digite a função" value={personalData.job_function} onChange={(e) => setPersonalData({ ...personalData, job_function: e.target.value })} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Dados Empresariais */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground mb-6">Dados Empresariais</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dataAdmissao">Data de Admissão *</Label>
                  <Input id="dataAdmissao" type="date" value={companyData.hire_date} onChange={(e) => setCompanyData({ ...companyData, hire_date: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataFim">Data de Fim</Label>
                  <Input id="dataFim" type="date" value={companyData.end_date} onChange={(e) => setCompanyData({ ...companyData, end_date: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inss">INSS</Label>
                  <Input id="inss" placeholder="Digite o número do INSS" value={companyData.inss_number} onChange={(e) => setCompanyData({ ...companyData, inss_number: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipoContrato">Tipo de Contrato *</Label>
                  <Select value={companyData.contract_type} onValueChange={(e) => setCompanyData({ ...companyData, contract_type: e })} >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Certo">Certo</SelectItem>
                      <SelectItem value="Incerto">Incerto</SelectItem>
                      <SelectItem value="Indeterminado">Indeterminado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nivelAcademico">Nível Acadêmico *</Label>
                  <Select value={companyData.academic_level} onValueChange={(e) => setCompanyData({ ...companyData, academic_level: e })} >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basico">Ensino Básico</SelectItem>
                      <SelectItem value="secundario">Ensino Secundário</SelectItem>
                      <SelectItem value="tecnico">Técnico</SelectItem>
                      <SelectItem value="superior">Ensino Superior</SelectItem>
                      <SelectItem value="mestrado">Mestrado</SelectItem>
                      <SelectItem value="doutorado">Doutorado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Área *</Label>
                  <Select value={companyData.area} onValueChange={(e) => setCompanyData({ ...companyData, area: e })} >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a área" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonData.areas.map((area) => (
                        <SelectItem key={area.id} value={area.name}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Região *</Label>
                  <Select value={companyData.region} onValueChange={(e) => setCompanyData({ ...companyData, region: e })} >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a região" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonData.regiaos.map((regiao) => (
                        <SelectItem key={regiao.id} value={regiao.name}>
                          {regiao.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Pelouro *</Label>
                  <Select value={companyData.department} onValueChange={(e) => setCompanyData({ ...companyData, department: e })} >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o pelouro" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonData.pelouros.map((pelouro) => (
                        <SelectItem key={pelouro.id} value={pelouro.name}>
                          {pelouro.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organic_unit">Unidade Orgânica *</Label>
                  <Select value={companyData.organic_unit} onValueChange={(e) => setCompanyData({ ...companyData, organic_unit: e })} >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade orgânica" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonData.unidade_organicas.map((un) => (
                        <SelectItem key={un.id} value={un.name}>
                          {un.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sector">Departamento *</Label>
                  <Select value={companyData.sector} onValueChange={(e) => setCompanyData({ ...companyData, sector: e })} >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonData.departamentos.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salario">Salário *</Label>
                  <Input id="salario" type="number" placeholder="0,00" value={companyData.salary} onChange={(e) => setCompanyData({ ...companyData, salary: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={companyData.status} onValueChange={(e) => setCompanyData({ ...companyData, status: e })} >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Documentos */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground mb-6">Documentos</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* NUIT */}
                <div className="border border-border rounded-lg p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">NUIT *</Label>
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <input
                    type="file"
                    onChange={handleNuitChange}
                    className="hidden"
                    id="image-upload"
                  />

                  <label
                    htmlFor="image-upload"
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block w-full"
                  >
                    <Upload className="w-6 h-6 text-primary mx-auto mb-2" />

                    {nuitFile ? (
                      <>
                        <p className="text-sm font-medium text-foreground">
                          {nuitFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Clique para trocar o ficheiro
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-foreground">Clique para fazer upload</p>
                        <p className="text-xs text-muted-foreground">
                          PDF, JPG, PNG até 10MB
                        </p>
                      </>
                    )}
                  </label>

                </div>


                {/* Documento de Identificação */}
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">Documento de Identificação *</Label>
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <input
                    type="file"
                    id="id-upload"
                    className="hidden"
                    onChange={handleIdChange}
                  />

                  <label
                    htmlFor="id-upload"
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block w-full"
                  >
                    <Upload className="w-6 h-6 text-primary mx-auto mb-2" />

                    {idFile ? (
                      <>
                        <p className="text-sm font-medium text-foreground">{idFile.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Clique para trocar o ficheiro
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-foreground">Clique para fazer upload</p>
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG até 10MB</p>
                      </>
                    )}
                  </label>
                </div>


                {/* Certificado de Habilitações Literárias */}
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">
                      Certificado de Habilitações Literárias *
                    </Label>
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <input
                    type="file"
                    id="certificate-upload"
                    className="hidden"
                    onChange={handleCertificateChange}
                  />

                  <label
                    htmlFor="certificate-upload"
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block w-full"
                  >
                    <Upload className="w-6 h-6 text-primary mx-auto mb-2" />

                    {certificateFile ? (
                      <>
                        <p className="text-sm font-medium text-foreground">
                          {certificateFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Clique para trocar o ficheiro
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-foreground">Clique para fazer upload</p>
                        <p className="text-xs text-muted-foreground">
                          PDF, JPG, PNG até 10MB
                        </p>
                      </>
                    )}
                  </label>
                </div>


                {/* Curriculum */}
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">Curriculum *</Label>
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <input
                    type="file"
                    id="cv-upload"
                    className="hidden"
                    onChange={handleCvChange}
                  />

                  <label
                    htmlFor="cv-upload"
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block w-full"
                  >
                    <Upload className="w-6 h-6 text-primary mx-auto mb-2" />

                    {cvFile ? (
                      <>
                        <p className="text-sm font-medium text-foreground">{cvFile.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Clique para trocar o ficheiro
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-foreground">Clique para fazer upload</p>
                        <p className="text-xs text-muted-foreground">PDF, DOC, DOCX até 10MB</p>
                      </>
                    )}
                  </label>
                </div>


                {/* Outras Certificações */}
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">Outras Certificações</Label>
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <input
                    type="file"
                    id="other-upload"
                    className="hidden"
                    onChange={handleOtherChange}
                  />

                  <label
                    htmlFor="other-upload"
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block w-full"
                  >
                    <Upload className="w-6 h-6 text-primary mx-auto mb-2" />

                    {otherFile ? (
                      <>
                        <p className="text-sm font-medium text-foreground">{otherFile.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Clique para trocar o ficheiro
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-foreground">Clique para fazer upload</p>
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG até 10MB</p>
                      </>
                    )}
                  </label>
                </div>

              </div>

              {/* Uploaded Files Summary */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3 mt-8 pt-6 border-t border-border">
                  <Label className="text-base font-semibold">Documentos Carregados ({uploadedFiles.length})</Label>
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-muted/50 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{file}</p>
                          <p className="text-xs text-muted-foreground">1.2 MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge-success">Carregado</span>
                        <Button
                          variant="ghost"
                          size="iconSm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => currentStep === 1 ? navigate("/workers") : handlePrevious()}
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 1 ? "Cancelar" : "Anterior"}
            </Button>

            {currentStep < 3 ? (
              <Button onClick={handleNext} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {isLoading ? "Salvando..." : "Próximo"}
                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            ) : (
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Salvando..." : (isEditMode ? "Atualizar Trabalhador" : "Salvar Trabalhador")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AddWorker;
