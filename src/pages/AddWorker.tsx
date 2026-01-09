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

const steps = [
  { id: 1, title: "Dados Pessoais" },
  { id: 2, title: "Dados Empresariais" },
  { id: 3, title: "Documentos" },
];

const AddWorker = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    toast({
      title: "Trabalhador adicionado!",
      description: "O cadastro foi realizado com sucesso.",
    });
    navigate("/workers");
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
                    className={`stepper-circle ${
                      currentStep > step.id
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
                      className={`flex-1 h-1 mx-2 rounded-full ${
                        currentStep > step.id
                          ? "stepper-line-completed"
                          : "stepper-line-pending"
                      }`}
                    />
                  )}
                </div>
                <div
                  className={`text-sm font-medium text-center ${
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
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
                  <Input id="nome" placeholder="Digite o nome completo" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                  <Input id="dataNascimento" type="date" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nuit">NUIT *</Label>
                  <Input id="nuit" placeholder="Número Único de Identificação" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="genero">Gênero *</Label>
                  <Select>
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
                  <Select>
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
                  <Select>
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
                  <Input id="numeroDocumento" placeholder="Digite o número" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="provincia">Província *</Label>
                  <Select>
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
                      <SelectItem value="zambesia">Zambesia</SelectItem>
                      <SelectItem value="nampula">Nampula</SelectItem>
                      <SelectItem value="niassa">Niassa</SelectItem>
                      <SelectItem value="cabo-delgado">Cabo Delgado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="distrito">Distrito *</Label>
                  <Input id="distrito" placeholder="Digite o distrito" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço *</Label>
                  <Input id="endereco" placeholder="Rua e número" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input id="bairro" placeholder="Digite o bairro" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="caixaPostal">Caixa Postal</Label>
                  <Input id="caixaPostal" placeholder="Digite a caixa postal" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade / Localidade *</Label>
                  <Input id="cidade" placeholder="Digite a cidade" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emailProfissional">Email Profissional *</Label>
                  <Input id="emailProfissional" type="email" placeholder="email.profissional@empresa.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emailAlternativo">Email Alternativo</Label>
                  <Input id="emailAlternativo" type="email" placeholder="email.alternativo@exemplo.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contatoProfissional">Contacto Profissional</Label>
                  <Input id="contatoProfissional" placeholder="+258 82 XXX XXXX" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contatoAlternativo">Contacto Alternativo</Label>
                  <Input id="contatoAlternativo" placeholder="+258 82 XXX XXXX" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telefone">Cel / Tel *</Label>
                  <Input id="telefone" placeholder="+258 82 XXX XXXX" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="funcao">Função *</Label>
                  <Input id="funcao" placeholder="Digite a função" />
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
                  <Input id="dataAdmissao" type="date" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dataFim">Data de Fim</Label>
                  <Input id="dataFim" type="date" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="inss">INSS</Label>
                  <Input id="inss" placeholder="Digite o número do INSS" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipoContrato">Tipo de Contrato *</Label>
                  <Select>
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
                  <Select>
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
                  <Input id="area" placeholder="Digite a área" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="regiao">Região *</Label>
                  <Input id="regiao" placeholder="Digite a região" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pelouro">Pelouro</Label>
                  <Input id="pelouro" placeholder="Digite o pelouro" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unidadeOrganica">Unidade Orgânica *</Label>
                  <Input id="unidadeOrganica" placeholder="Digite a unidade orgânica" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="setor">Setor *</Label>
                  <Input id="setor" placeholder="Digite o setor" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salario">Salário *</Label>
                  <Input id="salario" type="number" placeholder="0,00" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select>
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
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">NUIT *</Label>
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={handleFileUpload}
                  >
                    <Upload className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-foreground">Clique para fazer upload</p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, PNG até 10MB</p>
                  </div>
                </div>

                {/* Documento de Identificação */}
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">Documento de Identificação *</Label>
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={handleFileUpload}
                  >
                    <Upload className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-foreground">Clique para fazer upload</p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, PNG até 10MB</p>
                  </div>
                </div>

                {/* Certificado de Habilitações Literárias */}
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">Certificado de Habilitações Literárias *</Label>
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={handleFileUpload}
                  >
                    <Upload className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-foreground">Clique para fazer upload</p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, PNG até 10MB</p>
                  </div>
                </div>

                {/* Curriculum */}
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">Curriculum *</Label>
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={handleFileUpload}
                  >
                    <Upload className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-foreground">Clique para fazer upload</p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, DOCX até 10MB</p>
                  </div>
                </div>

                {/* Outras Certificações */}
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">Outras Certificações</Label>
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={handleFileUpload}
                  >
                    <Upload className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-foreground">Clique para fazer upload</p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, PNG até 10MB</p>
                  </div>
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
