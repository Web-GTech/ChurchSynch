import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { 
  getCurrentSession, 
  signInWithPassword, 
  signUpUser, 
  signOutUser, 
  onAuthStateChange as onSupabaseAuthStateChange 
} from '@/services/authService';
import { getProfile, updateProfile, getAllProfiles } from '@/services/profileService';
import { 
  getLiturgyFromStorage, 
  saveLiturgyToStorage, 
  getSelectedSongFromStorage, 
  saveSelectedSongToStorage 
} from '@/services/liturgyService';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [liturgy, setLiturgy] = useState(getLiturgyFromStorage());
  const [selectedSongForLiturgy, setSelectedSongForLiturgy] = useState(getSelectedSongFromStorage());
  const { toast } = useToast();

  const fetchUserProfileAndSetState = async (authUser) => {
    setLoading(true);
    if (!authUser) {
      setUser(null);
      setProfile(null);
      setUsers([]);
      setLoading(false);
      return;
    }

    setUser(authUser);
    try {
      const userProfile = await getProfile(authUser.id);
      setProfile(userProfile);

      if (userProfile && userProfile.role === 'admin') {
        const allUsersData = await getAllProfiles();
        setUsers(allUsersData || []);
      } else {
        setUsers([]); 
      }
    } catch (error) {
      console.error("Error fetching profile for authUser:", authUser.id, error.message, error.details);
      
      if (error.code === 'PGRST116' && error.details && error.details.includes('0 rows')) {
        console.warn("Profile not found for user, likely due to trigger delay or new user. Profile will be created/updated by app logic or next interaction.");
        setProfile(null); 
      } else if (error.message && error.message.includes("infinite recursion")) {
        toast({ variant: "destructive", title: "Erro de Configuração", description: "Detectada recursão infinita nas políticas de acesso. Contate o administrador." });
        setProfile(null);
      } else if (error.code === 'PGRST204' && error.message && error.message.includes("Could not find the 'app_metadata' column")) {
        toast({ variant: "destructive", title: "Erro de Configuração do Banco", description: "Houve um problema ao buscar dados do perfil. Coluna 'app_metadata' não deveria ser buscada em 'profiles'. Verifique as políticas RLS e chamadas de serviço." });
        setProfile(null);
      }
      else {
        setProfile(null); 
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const initializeAuth = async () => {
      const session = await getCurrentSession();
      await fetchUserProfileAndSetState(session?.user);
    };
    
    initializeAuth();

    const { data: authListener } = onSupabaseAuthStateChange(async (event, session) => {
      await fetchUserProfileAndSetState(session?.user);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    saveLiturgyToStorage(liturgy);
  }, [liturgy]);

  useEffect(() => {
    saveSelectedSongToStorage(selectedSongForLiturgy);
  }, [selectedSongForLiturgy]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { user: loggedInUser } = await signInWithPassword(email, password);
      if (loggedInUser) {
        await fetchUserProfileAndSetState(loggedInUser); 
        const currentProfile = await getProfile(loggedInUser.id); 
        toast({ title: "Login Bem-sucedido!", description: `Bem-vindo(a) de volta, ${currentProfile?.nome || loggedInUser.email}!` });
        return loggedInUser;
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Falha no Login", description: error.message });
    } finally {
      setLoading(false);
    }
    return null;
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const { user: newUser, error: signUpError } = await signUpUser(userData);
      if (signUpError) {
        throw signUpError;
      }
      if (newUser) {
        
        const profileDataToSave = {
          id: newUser.id,
          email: newUser.email,
          nome: userData.nome,
          sobrenome: userData.sobrenome,
          data_aniversario: userData.data_aniversario,
          igreja_membro: userData.igreja_membro,
          batizado: userData.batizado || 'nao_informado',
          tempo_batismo: userData.tempo_batismo || '',
          setor_atuacao: userData.setor_atuacao || '',
          role: 'membro', 
          profile_complete: false, 
        };
        
        const savedProfile = await updateProfile(newUser.id, profileDataToSave);
        setProfile(savedProfile);
        setUser(newUser);

        toast({ title: "Cadastro Realizado!", description: `Bem-vindo(a), ${userData.nome}! Verifique seu email para confirmação.` });
        return newUser;
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast({ variant: "destructive", title: "Erro no Cadastro", description: error.message || "Ocorreu um erro desconhecido." });
    } finally {
      setLoading(false);
    }
    return null;
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOutUser();
      setUser(null);
      setProfile(null);
      setUsers([]);
      setSelectedSongForLiturgy(null);
      toast({ title: "Logout Realizado", description: "Você saiu da sua conta." });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro no Logout", description: error.message });
    }
    setLoading(false);
  };

  const updateUserContextProfile = async (updatedProfileData) => {
    if (!user || !user.id) {
        toast({ variant: "destructive", title: "Erro", description: "Usuário não autenticado para atualizar perfil." });
        return null;
    }
    setLoading(true);
    try {
      const profileDataForUpdate = { ...updatedProfileData };
      if (profileDataForUpdate.email) {
        delete profileDataForUpdate.email; 
      }
      
      const updatedData = await updateProfile(user.id, profileDataForUpdate);
      setProfile(updatedData); 
      toast({ title: "Perfil Atualizado!", description: "Suas informações foram salvas com sucesso." });
      
      if (updatedData?.role === 'admin') {
        const allUsersData = await getAllProfiles();
        setUsers(allUsersData || []);
      }
      return updatedData;
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao Atualizar Perfil", description: error.message });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const isProfileComplete = () => {
    if (!profile) return false;
    return !!profile.profile_complete && !!profile.nome && !!profile.sobrenome && !!profile.data_aniversario && !!profile.igreja_membro;
  };

  const addSongToLiturgy = (songDetails) => {
    const newLiturgyItem = {
      id: songDetails.id || `${Date.now()}-${songDetails.title}`,
      title: songDetails.title,
      type: 'louvor', 
      responsible: songDetails.artist,
      details: `Tom: ${songDetails.tone || 'N/A'}. Links: ${songDetails.lyricsUrl || ''} ${songDetails.chordsUrl || ''} ${songDetails.youtubeUrl || ''}`.trim(),
      completed: false,
    };
    setLiturgy(prevLiturgy => [...prevLiturgy, newLiturgyItem]);
    setSelectedSongForLiturgy(null); 
    toast({
      title: "Música Adicionada à Liturgia!",
      description: `${songDetails.title} por ${songDetails.artist} foi adicionada.`,
    });
  };
  
  const updateLiturgy = (updatedLiturgyItems) => {
    setLiturgy(updatedLiturgyItems);
  };

  const canEditLiturgy = () => {
    if (!profile) return false;
    return profile.role === 'admin' || profile.role === 'pastor' || profile.role === 'lider_jovens' || profile.role === 'lider_ministerio';
  };

  const value = {
    user,
    profile,
    users, 
    login,
    register,
    logout,
    updateUser: updateUserContextProfile, 
    isProfileComplete,
    selectedSongForLiturgy,
    addSongToLiturgy,
    canEditLiturgy,
    liturgy,
    updateLiturgy,
    loading,
    supabase
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};