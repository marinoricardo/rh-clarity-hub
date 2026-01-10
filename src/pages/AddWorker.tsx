import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Textarea } from "@/components/ui/textarea";
import { Check, ArrowLeft, ArrowRight, Upload, X, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { WorkerService } from "@/data/services/worker.service";
import Swal from "sweetalert2";



const steps = [
  { id: 1, title: "Dados Pessoais" },
  { id: 2, title: "Dados Empresariais" },
  { id: 3, title: "Documentos" },
];

const AddWorker = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [workerId, setWorkerId] = useState();
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const workerService = new WorkerService();
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



  const handleNext = async () => {
    if (currentStep == 1) {
      try {
        const response = await workerService.store(personalData)
        console.log("PersonalData:", response);
        setWorkerId(response.id)
        setCurrentStep(currentStep + 1);
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Erro no registro",
          text: err.message || "Ocorreu um erro ao registrar os dados pessoais.",
          confirmButtonText: "OK",
        });


      } finally {
      }
      console.log(personalData)
    }
    if (currentStep == 2) {
      try {
        const response = await workerService.storeCompanyData(workerId, companyData)
        console.log("PersonalData:", response);
        setCurrentStep(currentStep + 1);
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Erro no registro",
          text: err.message || "Ocorreu um erro ao registrar os dados empresarias.",
          confirmButtonText: "OK",
        });


      } finally {
      }
      console.log(companyData)
    }

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
    try {
      // Cria objeto com os ficheiros do state
      const filesToUpload: Record<string, File> = {};

      if (nuitFile) filesToUpload["nuit_document"] = nuitFile;
      if (idFile) filesToUpload["identity_document"] = idFile;
      if (certificateFile) filesToUpload["education_certificate"] = certificateFile;
      if (cvFile) filesToUpload["cv"] = cvFile;
      if (otherFile) filesToUpload["other_certifications"] = otherFile;

      const response = await workerService.uploadWorkerDocuments(
        workerId,
        filesToUpload
      );

      console.log("PersonalData:", response);

      Swal.fire({
        icon: "success",
        title: "Upload realizado",
        text: "Os documentos foram enviados com sucesso.",
        confirmButtonText: "OK",
      });

      // toast({
      //   title: "Trabalhador adicionado!",
      //   description: "O cadastro foi realizado com sucesso.",
      // });
      navigate("/workers");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Erro no registro",
        text:
          err.message ||
          "Ocorreu um erro ao registrar os documentos do trabalhador.",
        confirmButtonText: "OK",
      });
    } finally {
      console.log({
        nuitFile,
        idFile,
        certificateFile,
        cvFile,
        otherFile,
      });
    }

  };

  const handleFileUpload = () => {
    // Simulate file upload
    setUploadedFiles([...uploadedFiles, `documento_${uploadedFiles.length + 1}.pdf`]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <AppLayout title="Adicionar Trabalhador" subtitle="Preencha os dados do novo colaborador">
      <div className="max-w-l mx-auto animate-fade-in">
        {/* Stepper */}
        <div className="mb-8 bg-card rounded-xl border border-border p-8">
          <div className="flex items-end justify-between gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-1 flex-col items-center">
                <div className="flex items-center w-full mb-4">
                  <div
                    className={`stepper-circle ${currentStep > step.id
                      ? "stepper-circle-completed"
                      : currentStep === step.id
                        ? "stepper-circle-active"
                        : "stepper-circle-pending"
                      }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full ${currentStep > step.id
                        ? "stepper-line-completed"
                        : "stepper-line-pending"
                        }`}
                    />
                  )}
                </div>
                <div
                  className={`text-sm font-medium text-center ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    }`}
                >
                  {step.title}
                </div>
              </div>
            ))}
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
                      <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                      <SelectItem value="casado">Casado(a)</SelectItem>
                      <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                      <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                      <SelectItem value="uniao">União Estável</SelectItem>
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
                      <SelectItem value="bi">BI (Bilhete de Identidade)</SelectItem>
                      <SelectItem value="rg">RG</SelectItem>
                      <SelectItem value="passaporte">Passaporte</SelectItem>
                      <SelectItem value="cpf">CPF</SelectItem>
                      <SelectItem value="cnh">CNH</SelectItem>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <SelectItem value="clt">CLT</SelectItem>
                      <SelectItem value="pj">PJ</SelectItem>
                      <SelectItem value="temporario">Temporário</SelectItem>
                      <SelectItem value="estagio">Estágio</SelectItem>
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
                  <Input id="area" placeholder="Digite a área" value={companyData.area} onChange={(e) => setCompanyData({ ...companyData, area: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regiao">Região *</Label>
                  <Input id="regiao" placeholder="Digite a região" value={companyData.region} onChange={(e) => setCompanyData({ ...companyData, region: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pelouro">Pelouro</Label>
                  <Input id="pelouro" placeholder="Digite o pelouro" value={companyData.department} onChange={(e) => setCompanyData({ ...companyData, department: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unidadeOrganica">Unidade Orgânica *</Label>
                  <Input id="unidadeOrganica" placeholder="Digite a unidade orgânica" value={companyData.organic_unit} onChange={(e) => setCompanyData({ ...companyData, organic_unit: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="setor">Setor *</Label>
                  <Input id="setor" placeholder="Digite o setor" value={companyData.sector} onChange={(e) => setCompanyData({ ...companyData, sector: e.target.value })} />
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
                    accept=".pdf,.doc,.docx"
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
                    accept=".pdf,.jpg,.jpeg,.png"
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
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 1 ? "Cancelar" : "Anterior"}
            </Button>

            {currentStep < 3 ? (
              <Button onClick={handleNext}>
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSave}>
                <Check className="w-4 h-4 mr-2" />
                Salvar Trabalhador
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AddWorker;
