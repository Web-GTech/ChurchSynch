import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit3, Mail, CalendarDays, Phone, Instagram as InstagramIcon, BookHeart, Church } from 'lucide-react';

const ProfileCard = ({ user, onEdit }) => {
  const userRoleDisplay = {
    admin: "Administrador(a)",
    pastor: "Pastor(a)",
    lider_jovens: "Líder de Jovens",
    lider_ministerio: "Líder de Ministério",
    membro: "Membro"
  };

  const initials = user.nome && user.sobrenome 
    ? `${user.nome.charAt(0)}${user.sobrenome.charAt(0)}`
    : user.nome ? user.nome.substring(0,2) 
    : user.email ? user.email.substring(0,2).toUpperCase()
    : 'CF';

  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'data não disponível';
  const igrejaNome = user.igreja_membro || "Comunidade";

  return (
    <>
      <div className="bg-gradient-to-br from-primary to-blue-600 p-6 text-primary-foreground relative rounded-t-xl">
        <div className="absolute top-3 right-3">
          <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/20">
            <Edit3 size={18} />
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Avatar className="h-24 w-24 sm:h-20 sm:w-20 border-4 border-white/50 shadow-lg">
            <AvatarImage src={user.avatar_url || `https://avatar.vercel.sh/${user.id}.png`} alt={`${user.nome} ${user.sobrenome}`} />
            <AvatarFallback className="text-3xl bg-white/30 text-primary font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center sm:text-left">{`${user.nome || ''} ${user.sobrenome || ''}`.trim() || 'Nome do Usuário'}</h2>
            <p className="text-sm opacity-90 text-center sm:text-left">{userRoleDisplay[user.role] || 'Membro'}</p>
          </div>
        </div>
      </div>
      <div className="bg-slate-100 dark:bg-slate-800 px-6 py-3 border-b border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center">
          <Church size={14} className="mr-2 text-primary/80" />
          Membro da {igrejaNome} desde {joinDate}
        </p>
      </div>
      <div className="p-5 sm:p-6 space-y-3 text-sm">
        <div className="flex items-center">
          <Mail size={16} className="mr-3 text-primary/80 flex-shrink-0" />
          <span className="text-slate-700 dark:text-slate-300 break-all">{user.email}</span>
        </div>
        <div className="flex items-center">
          <CalendarDays size={16} className="mr-3 text-primary/80 flex-shrink-0" />
          <span className="text-slate-700 dark:text-slate-300">{user.data_aniversario ? new Date(user.data_aniversario + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric'}) : 'Data de aniversário não informada'}</span>
        </div>
        {user.whatsapp && (
          <a href={`https://wa.me/${user.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400">
            <Phone size={16} className="mr-3 flex-shrink-0" />
            <span>{user.whatsapp}</span>
          </a>
        )}
        {user.instagram && (
          <a href={`https://instagram.com/${user.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-pink-600 hover:text-pink-700 dark:text-pink-500 dark:hover:text-pink-400">
            <InstagramIcon size={16} className="mr-3 flex-shrink-0" />
            <span>{user.instagram}</span>
          </a>
        )}
        <div className="flex items-center">
          <BookHeart size={16} className="mr-3 text-primary/80 flex-shrink-0" />
          <span className="text-slate-700 dark:text-slate-300">Batizado: {user.batizado === 'sim' ? `Sim${user.tempo_batismo ? ` (${user.tempo_batismo})` : ''}` : (user.batizado === 'nao' ? 'Não' : 'Não informado')}</span>
        </div>
      </div>
    </>
  );
};

export default ProfileCard;