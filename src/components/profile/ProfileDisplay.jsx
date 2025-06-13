import React from 'react';
import { Mail, CalendarDays, Phone, Instagram as InstagramIcon, BookHeart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ProfileDisplay = ({ user: profileData }) => { 
  const { user } = useAuth(); 

  const displayData = profileData || user;

  if (!displayData) return null;

  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center">
        <Mail size={16} className="mr-3 text-primary/80 flex-shrink-0" />
        <span className="text-slate-700 break-all">{displayData.email}</span>
      </div>
      <div className="flex items-center">
        <CalendarDays size={16} className="mr-3 text-primary/80 flex-shrink-0" />
        <span className="text-slate-700">{displayData.data_aniversario ? new Date(displayData.data_aniversario + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Não informado'}</span>
      </div>
      {displayData.whatsapp && (
        <a href={`https://wa.me/${displayData.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-green-600 hover:text-green-700">
          <Phone size={16} className="mr-3 flex-shrink-0" />
          <span>{displayData.whatsapp}</span>
        </a>
      )}
      {displayData.instagram && (
        <a href={`https://instagram.com/${displayData.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-pink-600 hover:text-pink-700">
          <InstagramIcon size={16} className="mr-3 flex-shrink-0" />
          <span>{displayData.instagram}</span>
        </a>
      )}
      <div className="flex items-center">
        <BookHeart size={16} className="mr-3 text-primary/80 flex-shrink-0" />
        <span className="text-slate-700">Batizado: {displayData.batizado === 'sim' ? `Sim (${displayData.tempo_batismo || 'Tempo não informado'})` : 'Não'}</span>
      </div>
    </div>
  );
};

export default ProfileDisplay;