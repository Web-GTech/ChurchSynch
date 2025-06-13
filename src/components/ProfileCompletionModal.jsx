import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Church, Users, Briefcase } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const ProfileCompletionModal = ({ isOpen, onOpenChange }) => {
  const { profile, updateUserContextProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    data_aniversario: '',
    igreja_membro: '',
    batizado: 'nao_informado',
    tempo_batismo: '',
    setor_atuacao: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        nome: profile.nome || '',
        sobrenome: profile.sobrenome || '',
        data_aniversario: profile.data_aniversario || '',
        igreja_membro: profile.igreja_membro || '',
        batizado: profile.batizado || 'nao_informado',
        tempo_batismo: profile.tempo_batismo || '',
        setor_atuacao: profile.setor_atuacao || '',
      });
    }
  }, [profile]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile || !profile.id) {
        toast({ variant: "destructive", title: "Erro", description: "Usuário não encontrado para atualizar." });
        return;
    }
    if (!formData.nome || !formData.sobrenome || !formData.data_aniversario || !formData.igreja_membro) {
      toast({
        variant: "destructive",
        title: "Campos Obrigatórios",
        description: "Nome, Sobrenome, Data de Aniversário e Igreja são obrigatórios.",
      });
      return;
    }

    setIsSubmitting(true);

    const updatedUserData = {
      ...formData,
      profile_complete: true,
    };
    
    const success = await updateUserContextProfile(updatedUserData); 
    
    setIsSubmitting(false);
    if (success) {
      onOpenChange(false); 
      navigate('/'); 
      toast({ title: "Perfil Completo!", description: "Suas informações foram salvas." });
    } else {
      toast({ variant: "destructive", title: "Erro ao Salvar", description: "Não foi possível salvar as informações. Tente novamente." });
    }
  };

  if (authLoading && !profile) {
    return null; 
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-card to-background/80 p-6 sm:p-8 rounded-xl shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="text-center mb-6">
            <AlertTriangle className="h-10 w-10 text-primary mx-auto mb-3" />
            <DialogTitle className="text-2xl font-bold text-foreground">Complete seu Perfil</DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2 text-sm">
              Para uma melhor experiência, por favor, preencha as informações do seu perfil.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="modal-nome" className="text-foreground/80 font-medium text-xs">Nome *</Label>
              <Input
                id="modal-nome"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                required
                className="border-border focus:ring-primary focus:border-primary transition-all h-10"
                placeholder="Seu primeiro nome"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="modal-sobrenome" className="text-foreground/80 font-medium text-xs">Sobrenome *</Label>
              <Input
                id="modal-sobrenome"
                value={formData.sobrenome}
                onChange={(e) => handleChange('sobrenome', e.target.value)}
                required
                className="border-border focus:ring-primary focus:border-primary transition-all h-10"
                placeholder="Seu sobrenome"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="modal-dataAniversario" className="text-foreground/80 font-medium text-xs">Data de Aniversário *</Label>
              <Input
                id="modal-dataAniversario"
                type="date"
                value={formData.data_aniversario}
                onChange={(e) => handleChange('data_aniversario', e.target.value)}
                required
                className="border-border focus:ring-primary focus:border-primary transition-all h-10"
              />
            </div>
             <div className="space-y-1">
              <Label htmlFor="modal-igreja" className="text-foreground/80 font-medium text-xs flex items-center">
                <Church size={14} className="mr-1.5" /> Nome da sua Igreja *
              </Label>
              <Input
                id="modal-igreja"
                value={formData.igreja_membro}
                onChange={(e) => handleChange('igreja_membro', e.target.value)}
                required
                className="border-border focus:ring-primary focus:border-primary transition-all h-10"
                placeholder="Ex: Igreja Batista da Paz"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="modal-batizado" className="text-foreground/80 font-medium text-xs flex items-center">
                <Users size={14} className="mr-1.5" /> Você é batizado(a)?
              </Label>
              <Select value={formData.batizado} onValueChange={(value) => handleChange('batizado', value)}>
                <SelectTrigger className="w-full border-border focus:ring-primary focus:border-primary h-10 text-sm">
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                  <SelectItem value="nao_informado">Prefiro não informar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.batizado === 'sim' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="space-y-1 overflow-hidden"
              >
                <Label htmlFor="modal-tempoBatismo" className="text-foreground/80 font-medium text-xs">Tempo de batismo</Label>
                <Input 
                  id="modal-tempoBatismo" 
                  value={formData.tempo_batismo} 
                  onChange={(e) => handleChange('tempo_batismo', e.target.value)} 
                  placeholder="Ex: 5 anos / 6 meses" 
                  className="border-border focus:ring-primary focus:border-primary h-10 text-sm"
                />
              </motion.div>
            )}
            <div className="space-y-1">
              <Label htmlFor="modal-setorAtuacao" className="text-foreground/80 font-medium text-xs flex items-center">
                <Briefcase size={14} className="mr-1.5" /> Setor/Ministério de Atuação (opcional)
              </Label>
              <Input
                id="modal-setorAtuacao"
                value={formData.setor_atuacao}
                onChange={(e) => handleChange('setor_atuacao', e.target.value)}
                className="border-border focus:ring-primary focus:border-primary transition-all h-10"
                placeholder="Ex: Louvor, Diaconato, Mídia"
              />
            </div>
            <DialogFooter className="mt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting || authLoading}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 h-10"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
                  />
                ) : <CheckCircle className="mr-2 h-5 w-5" />}
                {isSubmitting ? 'Salvando...' : 'Salvar e Continuar'}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCompletionModal;