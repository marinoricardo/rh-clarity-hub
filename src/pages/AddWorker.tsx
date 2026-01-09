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
      <div className="max-w-4xl mx-auto animate-fade-in">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="stepper-step flex-1">
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
                      className={`stepper-line ${
                        currentStep > step.id
                          ? "stepper-line-completed"
                          : "stepper-line-pending"
                      }`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`text-sm font-medium ${
                  currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.title}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input id="nome" placeholder="Digite o nome completo" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                  <Input id="dataNascimento" type="date" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="documento">Documento de Identificação *</Label>
                  <Input id="documento" placeholder="CPF / BI / Passaporte" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input id="telefone" placeholder="+55 11 99999-9999" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="email@exemplo.com" />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="endereco">Endereço Completo</Label>
                  <Textarea id="endereco" placeholder="Rua, número, bairro, cidade, estado, CEP" />
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
                  <Label htmlFor="cargo">Cargo *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analista">Analista</SelectItem>
                      <SelectItem value="desenvolvedor">Desenvolvedor</SelectItem>
                      <SelectItem value="gerente">Gerente</SelectItem>
                      <SelectItem value="operador">Operador</SelectItem>
                      <SelectItem value="assistente">Assistente</SelectItem>
                      <SelectItem value="tecnico">Técnico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rh">Recursos Humanos</SelectItem>
                      <SelectItem value="ti">Tecnologia</SelectItem>
                      <SelectItem value="vendas">Vendas</SelectItem>
                      <SelectItem value="operacoes">Operações</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unidade">Unidade (UN) *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sp">UN São Paulo</SelectItem>
                      <SelectItem value="rj">UN Rio de Janeiro</SelectItem>
                      <SelectItem value="bh">UN Belo Horizonte</SelectItem>
                      <SelectItem value="ctba">UN Curitiba</SelectItem>
                      <SelectItem value="poa">UN Porto Alegre</SelectItem>
                      <SelectItem value="bsb">UN Brasília</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="dataAdmissao">Data de Admissão *</Label>
                  <Input id="dataAdmissao" type="date" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salario">Salário</Label>
                  <Input id="salario" type="number" placeholder="0,00" />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Documentos */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-foreground mb-6">Documentos</h2>
              
              {/* Upload Area */}
              <div
                className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={handleFileUpload}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="text-foreground font-medium mb-1">
                  Clique para fazer upload ou arraste os arquivos
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF, DOC, JPG, PNG até 10MB
                </p>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <Label>Documentos Anexados</Label>
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

              <div className="bg-info-light rounded-lg p-4">
                <p className="text-sm text-info">
                  <strong>Documentos recomendados:</strong> Documento de identificação, Comprovante de residência, 
                  Certificados de formação, Carteira de trabalho, Foto 3x4.
                </p>
              </div>
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
