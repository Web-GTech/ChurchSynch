import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, ShieldAlert, MessageSquare, BookOpenText, CalendarDays as CalendarDaysIcon } from 'lucide-react';

const ProfileQuickAccessItem = ({ to, icon: Icon, label, external = false }) => (
  <Button
    asChild={!external}
    variant="ghost"
    className="w-full justify-start text-left p-3 h-auto hover:bg-slate-100 rounded-lg text-slate-700 hover:text-primary"
    onClick={external ? () => window.open(to, '_blank') : undefined}
  >
    {external ? (
      <a href={to} target="_blank" rel="noopener noreferrer" className="flex items-center w-full">
        <Icon size={20} className="mr-3 text-primary/80" />
        <span className="text-sm font-medium">{label}</span>
      </a>
    ) : (
      <Link to={to} className="flex items-center w-full">
        <Icon size={20} className="mr-3 text-primary/80" />
        <span className="text-sm font-medium">{label}</span>
      </Link>
    )}
  </Button>
);


const ProfileQuickAccess = ({ user }) => {
  return (
    <div className="mt-6 pt-5 border-t border-slate-200">
      <h3 className="text-base font-semibold text-slate-800 mb-2.5">Acessos Rápidos e Configurações</h3>
      <div className="space-y-1.5">
        <ProfileQuickAccessItem to="/mural-avisos" icon={MessageSquare} label="Mural de Avisos" />
        <ProfileQuickAccessItem to="/liturgia" icon={BookOpenText} label="Liturgia Semanal" />
        <ProfileQuickAccessItem to="/escala" icon={CalendarDaysIcon} label="Minhas Escalas" />
        <ProfileQuickAccessItem to="/settings" icon={Settings} label="Configurações da Conta" />
        {user.role === 'admin' && (
          <ProfileQuickAccessItem to="/admin/dashboard" icon={ShieldAlert} label="Painel Admin" />
        )}
      </div>
    </div>
  );
};

export default ProfileQuickAccess;