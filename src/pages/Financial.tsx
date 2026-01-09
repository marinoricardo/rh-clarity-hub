import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Plus, Building2, TrendingUp, History } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const unidadesData = [
  { id: 1, nome: "UN São Paulo", trabalhadores: 85, valorTotal: 425000, ultimaAtualizacao: "09/01/2024" },
  { id: 2, nome: "UN Rio de Janeiro", trabalhadores: 52, valorTotal: 260000, ultimaAtualizacao: "08/01/2024" },
  { id: 3, nome: "UN Belo Horizonte", trabalhadores: 38, valorTotal: 190000, ultimaAtualizacao: "08/01/2024" },
  { id: 4, nome: "UN Curitiba", trabalhadores: 28, valorTotal: 140000, ultimaAtualizacao: "07/01/2024" },
  { id: 5, nome: "UN Porto Alegre", trabalhadores: 25, valorTotal: 125000, ultimaAtualizacao: "07/01/2024" },
  { id: 6, nome: "UN Brasília", trabalhadores: 20, valorTotal: 100000, ultimaAtualizacao: "06/01/2024" },
];

const historicoData = [
  { data: "09/01/2024", unidade: "UN São Paulo", valor: 425000, tipo: "Folha" },
  { data: "08/01/2024", unidade: "UN Rio de Janeiro", valor: 260000, tipo: "Folha" },
  { data: "05/01/2024", unidade: "UN São Paulo", valor: 15000, tipo: "Benefícios" },
  { data: "03/01/2024", unidade: "UN Curitiba", valor: 8000, tipo: "Bonificação" },
];

const Financial = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUnidade, setSelectedUnidade] = useState<any>(null);

  const totalGeral = unidadesData.reduce((acc, un) => acc + un.valorTotal, 0);
  const totalTrabalhadores = unidadesData.reduce((acc, un) => acc + un.trabalhadores, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleAddValue = () => {
    toast({
      title: "Valor adicionado!",
      description: `Valor financeiro registrado para ${selectedUnidade?.nome}.`,
    });
    setDialogOpen(false);
  };

  return (
    <AppLayout title="Gestão Financeira" subtitle="Controle financeiro por unidade">
      <div className="space-y-6 animate-fade-in">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stats-card bg-gradient-to-br from-primary to-primary-hover text-primary-foreground">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-90">Total Geral</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(totalGeral)}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+5.2% este mês</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unidades</p>
                <p className="text-3xl font-bold text-foreground mt-1">{unidadesData.length}</p>
                <p className="text-sm text-muted-foreground mt-2">Em operação</p>
              </div>
              <div className="w-12 h-12 bg-info-light rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-info" />
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Trabalhadores</p>
                <p className="text-3xl font-bold text-foreground mt-1">{totalTrabalhadores}</p>
                <p className="text-sm text-muted-foreground mt-2">Total geral</p>
              </div>
              <div className="w-12 h-12 bg-success-light rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
        </div>

        {/* Units Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Valores por Unidade</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Unidade</TableHead>
                <TableHead>Trabalhadores</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unidadesData.map((unidade) => (
                <TableRow key={unidade.id} className="table-row">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium">{unidade.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{unidade.trabalhadores}</TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {formatCurrency(unidade.valorTotal)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{unidade.ultimaAtualizacao}</TableCell>
                  <TableCell className="text-right">
                    <Dialog open={dialogOpen && selectedUnidade?.id === unidade.id} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="primaryLight"
                          size="sm"
                          onClick={() => setSelectedUnidade(unidade)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Adicionar Valor
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adicionar Valor - {unidade.nome}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label>Tipo</Label>
                            <Input placeholder="Ex: Folha, Benefícios, Bonificação" />
                          </div>
                          <div className="space-y-2">
                            <Label>Valor (R$)</Label>
                            <Input type="number" placeholder="0,00" />
                          </div>
                          <div className="space-y-2">
                            <Label>Data</Label>
                            <Input type="date" />
                          </div>
                          <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleAddValue}>
                              Salvar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* History */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <History className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Histórico de Registros</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Data</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historicoData.map((item, index) => (
                <TableRow key={index} className="table-row">
                  <TableCell className="text-muted-foreground">{item.data}</TableCell>
                  <TableCell className="font-medium">{item.unidade}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-muted rounded-md text-sm">{item.tipo}</span>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {formatCurrency(item.valor)}
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

export default Financial;
