import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Clock, User } from "lucide-react";

const pendingWorkers = [
  { id: 1, name: "Carlos Rodrigues", step: 2, totalSteps: 3, lastUpdate: "Hoje, 10:30" },
  { id: 2, name: "Fernanda Lima", step: 1, totalSteps: 3, lastUpdate: "Ontem, 16:45" },
  { id: 3, name: "Bruno Martins", step: 2, totalSteps: 3, lastUpdate: "08/01/2024" },
  { id: 4, name: "Patrícia Souza", step: 1, totalSteps: 3, lastUpdate: "07/01/2024" },
];

const stepLabels = {
  1: "Dados Pessoais",
  2: "Dados Empresariais",
  3: "Documentos",
};

const PendingWorkers = () => {
  const navigate = useNavigate();

  return (
    <AppLayout title="Trabalhadores Pendentes" subtitle="Cadastros incompletos">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="bg-warning-light rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="text-warning font-semibold">
              {pendingWorkers.length} cadastros pendentes
            </p>
            <p className="text-sm text-warning/80">
              Complete os cadastros para liberar o acesso dos trabalhadores
            </p>
          </div>
        </div>

        {/* Pending List */}
        <div className="grid gap-4">
          {pendingWorkers.map((worker) => (
            <div
              key={worker.id}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Worker Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{worker.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Última atualização: {worker.lastUpdate}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Etapa {worker.step} de {worker.totalSteps}: {stepLabels[worker.step as keyof typeof stepLabels]}
                    </span>
                    <span className="font-medium text-foreground">
                      {Math.round((worker.step / worker.totalSteps) * 100)}%
                    </span>
                  </div>
                  <Progress value={(worker.step / worker.totalSteps) * 100} className="h-2" />
                </div>

                {/* Action */}
                <Button onClick={() => navigate("/workers/add")}>
                  Continuar Cadastro
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {pendingWorkers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum cadastro pendente
            </h3>
            <p className="text-muted-foreground">
              Todos os trabalhadores estão com cadastro completo.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default PendingWorkers;
