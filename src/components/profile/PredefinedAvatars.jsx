import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle } from 'lucide-react';

const predefinedAvatarOptions = [
  { id: 'avatar1', url: 'https://picsum.photos/seed/avatar1/100/100', name: 'Natureza' },
  { id: 'avatar2', url: 'https://picsum.photos/seed/avatar2/100/100', name: 'Abstrato' },
  { id: 'avatar3', url: 'https://picsum.photos/seed/avatar3/100/100', name: 'Animal' },
  { id: 'avatar4', url: 'https://picsum.photos/seed/avatar4/100/100', name: 'Padrão' },
  { id: 'avatar5', url: 'https://picsum.photos/seed/avatar5/100/100', name: 'Céu' },
  { id: 'avatar6', url: 'https://picsum.photos/seed/avatar6/100/100', name: 'Minimalista' },
];

const PredefinedAvatars = ({ currentAvatar, onSelect }) => {
  return (
    <div>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Ou escolha um avatar pré-definido:</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {predefinedAvatarOptions.map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onSelect(avatar.url)}
            className={`relative rounded-full border-2 p-0.5 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              ${currentAvatar === avatar.url ? 'border-primary scale-110' : 'border-transparent hover:border-primary/50'}`}
            aria-label={`Selecionar avatar ${avatar.name}`}
          >
            <Avatar className="h-16 w-16 sm:h-14 sm:w-14">
              <AvatarImage src={avatar.url} alt={avatar.name} />
              <AvatarFallback>{avatar.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            {currentAvatar === avatar.url && (
              <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                <CheckCircle size={16} />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PredefinedAvatars;