import { supabase } from '@/lib/supabaseClient';

export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error getting session:", error.message);
    return null;
  }
  return session;
};

export const signInWithPassword = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("Error signing in:", error.message);
    throw error;
  }
  return data;
};

export const signUpUser = async (userData) => {
  const { nome, sobrenome, email, password, dataAniversario, batizado, tempoBatismo, whatsapp, instagram, avatar_url } = userData;
  
  const profileDataForSignUp = {
    nome: nome,
    sobrenome: sobrenome,
    data_aniversario: dataAniversario || null, 
    batizado: batizado || 'nao_informado',
    tempo_batismo: tempoBatismo || null,
    role: 'membro', 
    profile_complete: !!(nome && sobrenome && dataAniversario),
    whatsapp: whatsapp || null,
    instagram: instagram || null,
    avatar_url: avatar_url || null,
  };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: profileDataForSignUp
    }
  });

  if (error) {
    console.error("Error signing up:", error.message);
    throw error;
  }
  
  if (data.user && !error) {
    // A trigger handle_new_user deve cuidar da inserção inicial.
    // Se precisar forçar uma atualização ou garantir dados, pode ser feito aqui,
    // mas a trigger é mais confiável para a criação inicial síncrona com auth.users.
    // Apenas para garantir que os dados estão lá, podemos tentar um select, mas não é estritamente necessário
    // se a trigger estiver funcionando corretamente.
  }
  return data;
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
    throw error;
  }
};

export const onAuthStateChange = (callback) => {
  const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
    callback(event, session);
  });
  return authListener;
};