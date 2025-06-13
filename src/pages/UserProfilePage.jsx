import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Edit3, LogOut, Save, ShieldAlert, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfileDisplay from '@/components/profile/ProfileDisplay';
import ProfileQuickAccess from '@/components/profile/ProfileQuickAccess';

const UserProfilePage = () => {
  const { user, profile, updateUser, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userRoleDisplay = {
    admin: "Administrador(a)",
    pastor: "Pastor(a)",
    lider_jovens: "Líder de Jovens",
    lider_ministerio: "Líder de Ministério",
    membro: "Membro"
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user && profile) {
      setFormData({
        nome: profile.nome || '',
        sobrenome: profile.sobrenome || '',
        email: user.email || '', 
        dataAniversario: profile.data_aniversario || '',
        batizado: profile.batizado === 'sim',
        tempoBatismo: profile.tempo_batismo || '',
        whatsapp: profile.whatsapp || '',
        instagram: profile.instagram || '',
        avatar_url: profile.avatar_url || '',
      });
      if (!profile.profile_complete && !isEditing) { 
        setIsEditing(true);
      }
    }
  }, [user, profile, navigate, isEditing, authLoading]);

  if (authLoading || !user || !profile) {
    return (
      <div className="page-container full-height-page flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-primary">Carregando perfil...</p>
      </div>
    );
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const updatedProfileData = {
      nome: formData.nome,
      sobrenome: formData.sobrenome,
      data_aniversario: formData.dataAniversario,
      batizado: formData.batizado ? 'sim' : 'nao',
      tempo_batismo: formData.batizado ? formData.tempoBatismo : '',
      whatsapp: formData.whatsapp,
      instagram: formData.instagram,
      profile_complete: true,
      avatar_url: formData.avatar_url, 
    };
    
    await updateUser(updatedProfileData);
    setIsSubmitting(false);
    setIsEditing(false);
  };

  const initials = profile.nome && profile.sobrenome
    ? `${profile.nome.charAt(0)}${profile.sobrenome.charAt(0)}`
    : profile.nome ? profile.nome.substring(0, 2)
    : user.email ? user.email.substring(0, 2).toUpperCase()
    : 'CF';

  return (
    <div className="page-container full-height-page flex flex-col items-center bg-slate-50 pb-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg p-3"
      >
        <Card className="shadow-xl bg-card rounded-2xl overflow-hidden border border-slate-200">
          <CardHeader className="p-0">
            <div className="bg-gradient-to-br from-primary to-blue-600 p-6 text-primary-foreground relative">
              {!isEditing && (
                <div className="absolute top-3 right-3">
                  <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/20">
                    <Edit3 size={18} />
                  </Button>
                </div>
              )}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 border-4 border-white/50 shadow-lg">
                  <AvatarImage src={profile.avatar_url || `https://avatar.vercel.sh/${user.email}.png?size=80`} alt={`${profile.nome} ${profile.sobrenome}`} />
                  <AvatarFallback className="text-3xl bg-white/30 text-primary font-semibold">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{`${profile.nome || ''} ${profile.sobrenome || ''}`}</h2>
                  <p className="text-sm opacity-90">{userRoleDisplay[profile.role] || 'Membro'}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-100 px-6 py-3 border-b border-slate-200">
              <p className="text-xs text-slate-600 font-medium">Membro da Igreja Church Facilities desde {profile.joinDate || new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
          </CardHeader>

          {!profile.profile_complete && !isEditing && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-yellow-100 border-b border-yellow-300 text-yellow-800 flex items-center text-sm"
            >
              <ShieldAlert className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>Seu perfil está incompleto. Por favor, edite para adicionar suas informações.</span>
            </motion.div>
          )}

          <CardContent className="p-5 sm:p-6">
            {isEditing ? (
              <ProfileForm 
                formData={formData} 
                onFormChange={handleFormChange} 
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                onCancel={() => {
                  setIsEditing(false);
                  setFormData({ 
                    nome: profile.nome || '',
                    sobrenome: profile.sobrenome || '',
                    email: user.email || '',
                    dataAniversario: profile.data_aniversario || '',
                    batizado: profile.batizado === 'sim',
                    tempoBatismo: profile.tempo_batismo || '',
                    whatsapp: profile.whatsapp || '',
                    instagram: profile.instagram || '',
                    avatar_url: profile.avatar_url || '',
                  });
                }} 
              />
            ) : (
              <ProfileDisplay user={{...user, ...profile}} />
            )}
            {!isEditing && <ProfileQuickAccess user={{...user, ...profile}} />}
          </CardContent>

          {!isEditing && (
            <CardFooter className="bg-slate-50 p-4 border-t border-slate-200">
              <Button variant="outline" onClick={logout} className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 h-10 text-sm" disabled={isSubmitting || authLoading}>
                {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut size={16} className="mr-2" />}
                 Sair da Conta
              </Button>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default UserProfilePage;