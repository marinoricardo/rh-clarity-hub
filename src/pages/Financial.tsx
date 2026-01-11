import { useEffect, useState } from "react";
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
import { DollarSign, Plus, Building2, TrendingUp, History, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { FundoAlocadosService } from "@/data/services/fundoalocados.service";
import { CommonService } from "@/data/services/common.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";

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
  const [fundosAlocados, setFundosAlocados] = useState<any[]>([]);
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

  const [form, setForm] = useState({
    unidade_organica_id: "",
    valor_alocado: "",
    total_salarios_pagos: "0",
  });

  const totalGeral = unidadesData.reduce((acc, un) => acc + un.valorTotal, 0);
  const totalTrabalhadores = unidadesData.reduce((acc, un) => acc + un.trabalhadores, 0);
  const fundosService = new FundoAlocadosService();
  const commonService = new CommonService();

  useEffect(() => {
    fetchFundosAlocados();
  }, []);

  const fetchFundosAlocados = async () => {
    try {
      const fundos = await fundosService.index();
      const common = await commonService.fetchCommonData();
      setCommonData(common);
      console.log("Fundos Alocados:", fundos);
      setFundosAlocados(fundos);
    } catch (error) {
      console.error("Erro ao buscar fundos alocados:", error);
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "MZN",
    }).format(value);
  };


  const formatarDataHora = (dataISO: any) => {
    return new Date(dataISO).toLocaleString('pt-BR', {
      timeZone: 'UTC',
    })
  }

  const handleAddValue = async () => {
    try {
      // Fecha o dialog primeiro
      setDialogOpen(false);

      // Aguarda o store
      await fundosService.store(form);

      // Atualiza a lista
      fetchFundosAlocados();

      // Mostra o Swal após fechar o dialog
      Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: 'Fundo alocado com sucesso',
        confirmButtonText: 'OK'
      });

    } catch (error) {
      // Garante que o dialog está fechado
      setDialogOpen(false);

      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: error?.response?.data?.message || 'Erro ao salvar fundo alocado',
        confirmButtonText: 'OK'
      });
    }
  };


  return (
    <AppLayout title="Gestão Financeira" subtitle="Controle financeiro por unidade">
      <div className="space-y-6 animate-fade-in">
        {/* Summary Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div> */}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            {/* <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar trabalhador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Muito Bom">Muito Bom</SelectItem>
                <SelectItem value="Bom">Bom</SelectItem>
                <SelectItem value="Suficiente">Suficiente</SelectItem>
                <SelectItem value="Mau">Mau</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="primaryLight"
                size="sm"
              // onClick={() => setSelectedUnidade(unidade)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Alocar Fundos
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Alocar Fundos</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="organic_unit">Unidade Orgânica *</Label>
                  <Select value={form.unidade_organica_id} onValueChange={(e) => setForm({ ...form, unidade_organica_id: e })} >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade orgânica" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonData.unidade_organicas.map((un) => (
                        <SelectItem key={un.id} value={un.id}>
                          {un.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Valor (MZN)</Label>
                  <Input type="number" placeholder="0,00" value={form.valor_alocado} onChange={(e) => setForm({ ...form, valor_alocado: e.target.value })} />
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
        </div>

        {/* Units Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Valores por Unidade Orgânica</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Unidade Orgânica</TableHead>
                <TableHead>Valor Alocado</TableHead>
                <TableHead>Última Atualização</TableHead>
                {/* <TableHead className="text-right">Ações</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {fundosAlocados.map((fundo) => (
                <TableRow key={fundo.id} className="table-row">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium">{fundo.unidade_organica.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {formatCurrency(fundo.valor_alocado)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatarDataHora(fundo.created_at)}</TableCell>
                  {/* <TableCell className="text-right">
                    <Dialog open={dialogOpen && selectedUnidade?.id === fundo.id} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="primaryLight"
                          size="sm"
                          onClick={() => setSelectedUnidade(fundo)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Adicionar Valor
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adicionar Valor - {fundo.unidade_organica.name}</DialogTitle>
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
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* History */}
        {/* <div className="bg-card rounded-xl border border-border overflow-hidden">
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
        </div> */}
      </div>
    </AppLayout>
  );
};

export default Financial;
