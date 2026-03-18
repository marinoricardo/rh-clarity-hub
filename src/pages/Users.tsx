import { useEffect, useState } from "react";
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
} from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, User, Loader2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { UserService } from "@/data/services/user.service";
import { CommonService } from "@/data/services/common.service";
import Swal from "sweetalert2";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPerfil, setFilterPerfil] = useState("all");
  const [usersData, setUsersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [commonData, setCommonData] = useState<{
    unidade_organicas: any[];
  }>({
    unidade_organicas: [],
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    unit_organic: "",
  });

  const userService = new UserService();
  const commonService = new CommonService();

  useEffect(() => {
    fetchUsers();
    fetchCommonData();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.index();
      setUsersData(data || []);
    } catch (err: any) {
      setError(err.message || "Falha ao carregar utilizadores");
    } finally {
      setLoading(false);
    }
  };

  const fetchCommonData = async () => {
    try {
      const res = await commonService.fetchCommonData();
      setCommonData(res);
    } catch (err: any) {
      console.error("Erro ao carregar dados comuns:", err);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
      unit_organic: "",
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setIsEditing(true);
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "",
      unit_organic: user.unit_organic?.toString() || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isEditing && selectedUser) {
        const updateData = { ...formData };
        if (!updateData.password) {
          delete (updateData as any).password;
        }
        await userService.update(selectedUser.id, updateData);
        setDialogOpen(false);
        await Swal.fire({
          icon: "success",
          title: "Utilizador actualizado!",
          text: "Os dados foram salvos com sucesso.",
          confirmButtonText: "OK",
        });
      } else {
        await userService.store(formData);
        setDialogOpen(false);

        await Swal.fire({
          icon: "success",
          title: "Utilizador criado!",
          text: "O novo utilizador foi adicionado com sucesso.",
          confirmButtonText: "OK",
        });
      }
      fetchUsers();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: err.message || "Ocorreu um erro ao salvar o utilizador.",
        confirmButtonText: "Fechar",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (user: any) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Remover utilizador?",
      text: `Tem certeza que deseja remover ${user.name}?`,
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });

    if (result.isConfirmed) {
      try {
        await userService.delete(user.id);
        await Swal.fire({
          icon: "success",
          title: "Utilizador removido!",
          text: "O utilizador foi removido com sucesso.",
          confirmButtonText: "OK",
        });
        fetchUsers();
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: err.message || "Ocorreu um erro ao remover o utilizador.",
          confirmButtonText: "Fechar",
        });
      }
    }
  };

  const getPerfilBadge = (perfil: string) => {
    switch (perfil) {
      case "admin":
        return <span className="badge-success">Administrador</span>;
      case "manager":
        return <span className="badge-info">Gestor</span>;
      case "user":
        return <span className="badge-warning">Utilizador</span>;
      default:
        return <span className="badge-info">{perfil}</span>;
    }
  };

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPerfil = filterPerfil === "all" || user.role === filterPerfil;
    return matchesSearch && matchesPerfil;
  });

  return (
    <AppLayout title="Gestão de Utilizadores" subtitle="Gerencie os utilizadores do sistema">
      <div className="space-y-6 animate-fade-in">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterPerfil} onValueChange={setFilterPerfil}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="rh">Recursos Humanos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Utilizador
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="table-header">
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Unidade Orgânica</TableHead>
                  <TableHead className="text-right">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum utilizador encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="table-row">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>{getPerfilBadge(user.role)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.unit_organic || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEdit(user)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(user)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Editar Utilizador" : "Novo Utilizador"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  placeholder="Nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  {isEditing ? "Nova Senha (deixe vazio para manter)" : "Senha *"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={isEditing ? "••••••••" : "Digite a senha"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Perfil *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="rh">Recursos Humanos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Unidade Orgânica</Label>
                <Select
                  value={formData.unit_organic}
                  onValueChange={(value) =>
                    setFormData({ ...formData, unit_organic: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonData.unidade_organicas?.map((unit: any) => (
                      <SelectItem key={unit.id} value={unit.name}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isEditing ? "Salvar Alterações" : "Criar Utilizador"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Users;
