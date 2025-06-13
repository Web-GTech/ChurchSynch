import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Loader2, Upload, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import PredefinedAvatars from '@/components/profile/PredefinedAvatars';

const ProfileForm = ({ formData, onFormChange, onSubmit, onCancel, isSubmitting }) => {
  const { supabase, user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  const handleAvatarChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarFile(file);
      onFormChange('avatar_url', URL.createObjectURL(file)); 
    }
  };

  const handlePredefinedAvatarSelect = (url) => {
    setAvatarFile(null); 
    onFormChange('avatar_url', url);
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user) return formData.avatar_url; 
    setUploading(true);
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true, 
        });

      if (error) {
        throw error;
      }
      
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setUploading(false);
      toast({ title: "Avatar Enviado", description: "Seu novo avatar foi salvo." });
      return publicUrlData.publicUrl;

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({ variant: "destructive", title: "Erro no Upload", description: "Não foi possível enviar o avatar. Tente novamente." });
      setUploading(false);
      return formData.avatar_url; 
    }
  };

  const handleSubmitWithAvatar = async (e) => {
    e.preventDefault();
    let avatarUrlToSave = formData.avatar_url;
    if (avatarFile) {
      avatarUrlToSave = await uploadAvatar();
    }
    onSubmit({ ...formData, avatar_url: avatarUrlToSave });
  };


  return (
    <form onSubmit={handleSubmitWithAvatar} className="space-y-6">
      <div>
        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Foto de Perfil</Label>
        <div className="flex items-center gap-4 mb-3">
          {formData.avatar_url && (
            <img 
              src={formData.avatar_url.startsWith('blob:') || formData.avatar_url.startsWith('https://picsum.photos') ? formData.avatar_url : `${formData.avatar_url}?t=${new Date().getTime()}`} 
              alt="Avatar" 
              className="h-20 w-20 rounded-full object-cover border-2 border-primary/30" 
            />
          )}
          <div className="flex-grow">
            <Label htmlFor="avatar-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
              <Upload size={16} className="mr-2" />
              Carregar Imagem
            </Label>
            <Input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            {uploading && <p className="text-xs text-primary flex items-center mt-1"><Loader2 className="h-3 w-3 animate-spin mr-1" />Enviando avatar...</p>}
          </div>
        </div>
        <PredefinedAvatars currentAvatar={formData.avatar_url} onSelect={handlePredefinedAvatarSelect} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="profile-nome" className="text-sm text-slate-700 dark:text-slate-300">Nome *</Label>
          <Input id="profile-nome" value={formData.nome || ''} onChange={(e) => onFormChange('nome', e.target.value)} required className="border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-50 focus:ring-primary focus:border-primary h-10 text-sm" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="profile-sobrenome" className="text-sm text-slate-700 dark:text-slate-300">Sobrenome *</Label>
          <Input id="profile-sobrenome" value={formData.sobrenome || ''} onChange={(e) => onFormChange('sobrenome', e.target.value)} required className="border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-50 focus:ring-primary focus:border-primary h-10 text-sm" />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="profile-igreja" className="text-sm text-slate-700 dark:text-slate-300">Nome da Igreja *</Label>
        <Input id="profile-igreja" value={formData.igreja_membro || ''} onChange={(e) => onFormChange('igreja_membro', e.target.value)} required placeholder="Ex: Igreja Batista da Paz" className="border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-50 focus:ring-primary focus:border-primary h-10 text-sm" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="profile-dataAniversario" className="text-sm text-slate-700 dark:text-slate-300">Data de Aniversário *</Label>
        <Input id="profile-dataAniversario" type="date" value={formData.data_aniversario || ''} onChange={(e) => onFormChange('data_aniversario', e.target.value)} required className="border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-50 focus:ring-primary focus:border-primary h-10 text-sm" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="profile-whatsapp" className="text-sm text-slate-700 dark:text-slate-300">WhatsApp</Label>
          <Input id="profile-whatsapp" type="tel" placeholder="(XX) XXXXX-XXXX" value={formData.whatsapp || ''} onChange={(e) => onFormChange('whatsapp', e.target.value)} className="border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-50 focus:ring-primary focus:border-primary h-10 text-sm" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="profile-instagram" className="text-sm text-slate-700 dark:text-slate-300">Instagram</Label>
          <Input id="profile-instagram" type="text" placeholder="@seuusuario" value={formData.instagram || ''} onChange={(e) => onFormChange('instagram', e.target.value)} className="border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-50 focus:ring-primary focus:border-primary h-10 text-sm" />
        </div>
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="profile-batizado" className="text-sm text-slate-700 dark:text-slate-300">Você é batizado(a)?</Label>
        <Select value={formData.batizado || 'nao_informado'} onValueChange={(value) => onFormChange('batizado', value)}>
          <SelectTrigger className="w-full border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-50 focus:ring-primary focus:border-primary h-10 text-sm">
            <SelectValue placeholder="Selecione uma opção" />
          </SelectTrigger>
          <SelectContent className="bg-card border-slate-300 dark:border-slate-600">
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
          <Label htmlFor="profile-tempoBatismo" className="text-sm text-slate-700 dark:text-slate-300">Tempo de batismo</Label>
          <Input id="profile-tempoBatismo" value={formData.tempo_batismo || ''} onChange={(e) => onFormChange('tempo_batismo', e.target.value)} placeholder="Ex: 5 anos / 6 meses" className="border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-50 focus:ring-primary focus:border-primary h-10 text-sm" />
        </motion.div>
      )}
      <div className="flex space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 border-slate-400 dark:border-slate-500 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm h-10" disabled={isSubmitting || uploading}>Cancelar</Button>
        <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm h-10" disabled={isSubmitting || uploading}>
          {isSubmitting || uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isSubmitting ? 'Salvando...' : (uploading ? 'Enviando Avatar...' : 'Salvar Alterações')}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;