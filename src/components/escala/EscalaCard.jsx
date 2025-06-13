import React from 'react';
import { motion } from 'framer-motion';
import { Users, Edit3, Trash2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EscalaCard = ({ escala, isAdmin, onEdit, onRemove, onOpenDetails, index }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-card border border-border/70 rounded-lg shadow-sm hover:shadow-md transition-shadow p-3.5 flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-1.5">
          <div>
            <h3 className="font-semibold text-sm text-foreground truncate">{escala.title}</h3>
            <p className="text-xs text-muted-foreground">
              {new Date(escala.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })} - {escala.ministerio}
            </p>
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            {isAdmin && (
              <>
                <Button variant="ghost" size="icon" onClick={() => onEdit(escala)} className="h-7 w-7 text-muted-foreground hover:text-blue-600 hover:bg-blue-100">
                  <Edit3 size={14} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onRemove(escala.id)} className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <Trash2 size={14} />
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={() => onOpenDetails(escala)} className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10">
              <Maximize2 size={14} />
            </Button>
          </div>
        </div>
        {escala.responsibles && escala.responsibles.length > 0 && (
          <div className="mt-1.5">
            <p className="text-xs text-foreground/90 truncate">
              <Users size={12} className="inline mr-1.5 opacity-80" />
              {escala.responsibles.join(', ')}
            </p>
          </div>
        )}
         {escala.convidado && escala.convidado.nome && (
          <div className="mt-1">
            <p className="text-xs text-primary/90 truncate">
              Convidado: {escala.convidado.nome} ({escala.convidado.funcao_designada || 'Participante'})
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EscalaCard;