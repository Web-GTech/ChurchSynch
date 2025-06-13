import { supabase } from '@/lib/supabaseClient';

export const getProfile = async (userId) => {
  if (!userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      nome,
      sobrenome,
      email,
      role,
      data_aniversario,
      batizado,
      tempo_batismo,
      profile_complete,
      avatar_url,
      whatsapp,
      instagram,
      igreja_membro,
      setor_atuacao,
      created_at,
      updated_at
    `)
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { 
    console.error('Error fetching profile:', error.message, error.details);
    throw error;
  }
  return data;
};

export const updateProfile = async (userId, profileData) => {
  if (!userId) throw new Error("User ID is required to update profile.");
  
  const dataToUpdate = { ...profileData, updated_at: new Date().toISOString() };

  const { data, error } = await supabase
    .from('profiles')
    .update(dataToUpdate)
    .eq('id', userId)
    .select(`
      id,
      nome,
      sobrenome,
      email,
      role,
      data_aniversario,
      batizado,
      tempo_batismo,
      profile_complete,
      avatar_url,
      whatsapp,
      instagram,
      igreja_membro,
      setor_atuacao,
      created_at,
      updated_at
    `)
    .single();

  if (error) {
    console.error('Error updating profile:', error.message, error.details);
    throw error;
  }
  return data;
};

export const getAllProfiles = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          nome,
          sobrenome,
          email,
          role,
          data_aniversario,
          batizado,
          tempo_batismo,
          profile_complete,
          avatar_url,
          whatsapp,
          instagram,
          igreja_membro,
          setor_atuacao,
          created_at,
          updated_at
        `);
    if (error) {
        console.error('Error fetching all profiles:', error.message, error.details);
        throw error;
    }
    return data;
};