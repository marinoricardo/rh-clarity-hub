import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Clock, User } from "lucide-react";
import { WorkerService } from "@/data/services/worker.service";

const stepLabels: Record<string, string> = {
  "Personal Data": "Dados Pessoais",
  "Company Data": "Dados Empresariais",
  "Documents": "Documentos",
};

const PendingWorkers = () => {
  const navigate = useNavigate();
  const [pendingWorkers, setPendingWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const workerService = new WorkerService();

  useEffect(() => {
    const fetchPendingWorkers = async () => {
      try {
        setLoading(true);
        const res = await workerService.pendingWorkers(); // chama a API
        console.log("chegou..." + res.pending_workers)
        setPendingWorkers(res);
      } catch (err: any) {
        setError(err.message || "Falha ao carregar trabalhadores pendentes");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingWorkers();
  }, []);

  return (
    <AppLayout title="Trabalhadores Pendentes" subtitle="Cadastros incompletos">
      <div className="space-y-6 animate-fade-in">
        {loading && <p>Carregando trabalhadores pendentes...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Stats */}
        {pendingWorkers.length > 0 && (
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
        )}

        {/* Pending List */}
        <div className="grid gap-4">
          {pendingWorkers.map((worker) => (
            <div
              key={worker.worker_id}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Worker Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{worker.full_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Última atualização: {new Date(worker.last_update).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {worker.current_step
                        ? `Etapa: ${stepLabels[worker.current_step] || worker.current_step}`
                        : "Etapa desconhecida"}
                    </span>
                    <span className="font-medium text-foreground">
                      {worker.progress_percentage}%
                    </span>
                  </div>
                  <Progress value={worker.progress_percentage} className="h-2" />
                </div>

                {/* Action */}
                <Button onClick={() => navigate(`/pending-workers/edit/${worker.worker_id}`)}>
                  Continuar Cadastro
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {pendingWorkers.length === 0 && !loading && (
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
