import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { CalendarDays } from 'lucide-react';

const AvisoDetailModal = ({ isOpen, onOpenChange, aviso }) => {
  if (!aviso) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl bg-card text-card-foreground rounded-xl shadow-2xl">
        <DialogHeader className="border-b border-border/70 pb-4 pt-5 px-6">
          <DialogTitle className="text-2xl font-bold text-primary leading-tight">{aviso.titulo}</DialogTitle>
          <DialogDescription className="text-muted-foreground pt-1 text-sm flex items-center">
            <CalendarDays size={14} className="mr-1.5 text-muted-foreground/80" />
            Publicado em: {new Date(aviso.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} | Categoria: {aviso.categoria}
          </DialogDescription>
        </DialogHeader>
        <div className="py-5 px-6 space-y-4 max-h-[65vh] overflow-y-auto prose prose-sm sm:prose-base max-w-none text-foreground/90">
          {aviso.imagem && 
            <div className="my-4 rounded-lg overflow-hidden shadow-md">
              <img-replace src={aviso.imagem} alt={aviso.titulo} className="w-full h-auto max-h-72 object-cover" />
            </div>
          }
          <p className="whitespace-pre-wrap leading-relaxed">{aviso.conteudo}</p>
        </div>
        <DialogFooter className="pt-5 pb-5 px-6 border-t border-border/70">
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground h-10 text-sm px-6 rounded-md">Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvisoDetailModal;