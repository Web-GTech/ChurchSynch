import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, PlusCircle, Edit3, Trash2, Search, ArrowLeft, ShieldCheck, UserCheck, UserX, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserFormModal = ({ isOpen, onOpenChange, existingUser, onSave }) => {
  const [formData, setFormData] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    if (existingUser) {
      setFormData({ ...existingUser, password: '' }); 
    } else {
      setFormData({ nome: '', sobrenome: '', email: '', role: 'membro', password: '' });
    }
  }, [existingUser, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.nome) {
      toast({ variant: "destructive", title: "Erro", description: "Nome e Email são obrigatórios."});
      return;
    }
    if (!existingUser && !formData.password) {
       toast({ variant: "destructive", title: "Erro", description: "Senha é obrigatória para novos usuários."});
      return;
    }
    onSave({ ...formData, id: existingUser?.id || `temp-${Date.now()}` });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground rounded-lg shadow-xl">
        <DialogHeader className="border-b border-border/70 pb-3">
          <DialogTitle className="text-lg font-semibold text-foreground">{existingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm pt-0.5">
            {existingUser ? 'Modifique os dados do usuário.' : 'Crie um novo perfil de usuário.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="nome" className="text-xs text-muted-foreground">Nome</Label>
              <Input id="nome" name="nome" value={formData.nome || ''} onChange={handleChange} className="h-9 text-sm border-border bg-input focus:ring-primary focus:border-primary" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sobrenome" className="text-xs text-muted-foreground">Sobrenome</Label>
              <Input id="sobrenome" name="sobrenome" value={formData.sobrenome || ''} onChange={handleChange} className="h-9 text-sm border-border bg-input focus:ring-primary focus:border-primary" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} className="h-9 text-sm border-border bg-input focus:ring-primary focus:border-primary" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs text-muted-foreground">Senha {existingUser ? '(Deixe em branco para não alterar)' : ''}</Label>
            <Input id="password" name="password" type="password" value={formData.password || ''} onChange={handleChange} className="h-9 text-sm border-border bg-input focus:ring-primary focus:border-primary" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-xs text-muted-foreground">Função</Label>
            <Select value={formData.role || 'membro'} onValueChange={handleRoleChange}>
              <SelectTrigger className="h-9 text-sm border-border bg-input focus:ring-primary focus:border-primary">
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="lider_jovens">Líder de Jovens</SelectItem>
                <SelectItem value="lider_ministerio">Líder de Ministério</SelectItem>
                <SelectItem value="membro">Membro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-5">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 text-sm border-border hover:bg-muted/50">Cancelar</Button>
            <Button type="submit" className="h-9 text-sm bg-primary hover:bg-primary/90 text-primary-foreground">{existingUser ? 'Salvar Alterações' : 'Criar Usuário'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AdminManageUsersPage = () => {
  const { users: initialAppUsers, register, updateUserContext } = useAuth(); 
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setUsers(initialAppUsers);
  }, [initialAppUsers]);

  const handleSaveUser = (userData) => {
    if (editingUser) {
      // Simulate update logic - in real app, this would call updateUserContext or similar
      const updatedUsers = users.map(u => u.id === editingUser.id ? { ...u, ...userData, password: userData.password || u.password } : u);
      setUsers(updatedUsers);
      // Ideally, updateUserContext should be robust enough for this or have a dedicated admin update function.
      // For now, we update local state and then call updateUserContext with the modified user for consistency if it's the currently logged-in admin editing themselves.
      if(userData.id === initialAppUsers.find(u=>u.role==='admin')?.id) updateUserContext({...users.find(u=>u.id===userData.id), ...userData});

      toast({ title: "Usuário Atualizado", description: `${userData.nome} foi atualizado com sucesso.` });
    } else {
      // Simulate register logic - in real app, this would call register or a dedicated admin create user
      const newUser = { ...userData, id: `user${Date.now()}`, profileComplete: false }; // Mock ID and profile status
      setUsers(prev => [...prev, newUser]);
      // Note: The `register` from AuthContext might try to log in the new user. For admin creation, this might not be desired.
      // A dedicated admin_create_user function would be better.
      toast({ title: "Usuário Criado", description: `${userData.nome} foi adicionado com sucesso.` });
    }
    setEditingUser(null);
  };
  
  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleRemoveUser = (userId) => {
    if (users.find(u=>u.id === userId)?.role === 'admin' && users.filter(u=>u.role==='admin').length <=1){
      toast({ variant: "destructive", title: "Ação não permitida", description: "Não é possível remover o único administrador."});
      return;
    }
    setUsers(users.filter(u => u.id !== userId));
    toast({ title: "Usuário Removido", description: "Usuário removido com sucesso." });
  };
  
  const filteredUsers = users.filter(user => {
    const nameMatch = `${user.nome} ${user.sobrenome}`.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = filterRole === 'all' || user.role === filterRole;
    return (nameMatch || emailMatch) && roleMatch;
  });

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <ShieldCheck className="h-4 w-4 text-red-500" />;
      case 'lider_jovens':
      case 'lider_ministerio': return <UserCheck className="h-4 w-4 text-blue-500" />;
      default: return <UserX className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <motion.div
      className="page-container full-height-page bg-slate-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6">
        <Card className="shadow-xl bg-card rounded-xl overflow-hidden border border-slate-200/60">
          <CardHeader className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                 <Button variant="ghost" size="icon" onClick={() => navigate('/admin/dashboard')} className="mr-3 text-primary-foreground hover:bg-primary-foreground/10">
                  <ArrowLeft size={20} />
                </Button>
                <CardTitle className="text-xl sm:text-2xl font-bold">Gerenciar Usuários</CardTitle>
              </div>
              <Users size={28} className="text-primary-foreground/70" />
            </div>
            <CardDescription className="text-primary-foreground/80 mt-1.5 ml-12 text-sm">
              Adicione, edite ou remova usuários do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Input 
                  type="text" 
                  placeholder="Pesquisar por nome ou email..." 
                  className="pl-10 h-10 text-sm border-border bg-input focus:ring-primary focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="h-10 text-sm border-border bg-input focus:ring-primary focus:border-primary sm:w-[180px]">
                  <Filter size={14} className="mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Filtrar por função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Funções</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="lider_jovens">Líder de Jovens</SelectItem>
                  <SelectItem value="lider_ministerio">Líder de Ministério</SelectItem>
                  <SelectItem value="membro">Membro</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => { setEditingUser(null); setIsModalOpen(true); }} className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 text-sm px-3.5">
                <PlusCircle size={16} className="mr-2" /> Adicionar Usuário
              </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-max text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left text-muted-foreground font-medium">
                    <th className="p-3">Usuário</th>
                    <th className="p-3 hidden sm:table-cell">Email</th>
                    <th className="p-3 hidden md:table-cell">Função</th>
                    <th className="p-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatarUrl || `https://avatar.vercel.sh/${user.email}.png?size=32`} alt={user.nome} />
                            <AvatarFallback>{user.nome?.[0]}{user.sobrenome?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground truncate max-w-[120px] sm:max-w-none">{user.nome} {user.sobrenome}</p>
                            <p className="text-xs text-muted-foreground sm:hidden">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground hidden sm:table-cell">{user.email}</td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          {getRoleIcon(user.role)}
                          <span className="capitalize">{user.role?.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-primary hover:bg-primary/10" onClick={() => handleEditUser(user)}>
                          <Edit3 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleRemoveUser(user.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
               {filteredUsers.length === 0 && (
                <p className="text-center py-8 text-muted-foreground">Nenhum usuário encontrado.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <UserFormModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} existingUser={editingUser} onSave={handleSaveUser} />
    </motion.div>
  );
};

export default AdminManageUsersPage;