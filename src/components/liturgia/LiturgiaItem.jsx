import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Trash2, User, Edit3, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LiturgiaItem = ({ item, index, onToggleComplete, onRemove, onEdit, userCanEdit }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={`flex items-start p-2 rounded-md border ${item.completed ? 'bg-green-50/70 border-green-200/80 opacity-80' : 'bg-card border-border/60 hover:bg-muted/30'} transition-all group`}
    >
      <div className="flex-grow cursor-pointer min-w-0 pt-0.5" onClick={() => onToggleComplete(item.id)}>
        <h3 className={`font-medium text-xs ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {item.title}
        </h3>
        {(item.responsible || item.details) && (
           <div className="text-[0.68rem] text-muted-foreground mt-0.5 space-y-0.5">
            {item.responsible && (
              <div className="flex items-center">
                <User size={10} className="inline mr-1 flex-shrink-0" />
                <span className="truncate">{item.responsible}</span>
              </div>
            )}
            {item.details && (
              <div className="flex items-center">
                <LinkIcon size={10} className="inline mr-1 flex-shrink-0" />
                <span className="truncate">{item.details}</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center ml-1.5 space-x-0.5 flex-shrink-0 pt-0.5">
        {userCanEdit && (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(item)} 
              className="h-6 w-6 text-muted-foreground hover:text-blue-600 hover:bg-blue-100/70 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
              aria-label="Editar item"
            >
              <Edit3 size={12} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onRemove(item.id)} 
              className="h-6 w-6 text-muted-foreground hover:text-red-600 hover:bg-red-100/70 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
              aria-label="Remover item"
            >
              <Trash2 size={12} />
            </Button>
          </>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onToggleComplete(item.id)} 
          className={`h-6 w-6 ${item.completed ? 'text-green-600 hover:bg-green-100/70' : 'text-muted-foreground hover:text-green-600 hover:bg-green-100/70'}`}
          aria-label={item.completed ? "Marcar como não concluído" : "Marcar como concluído"}
        >
          {item.completed ? <CheckSquare size={14} /> : <Square size={14} />}
        </Button>
      </div>
    </motion.div>
  );
};

export default LiturgiaItem;