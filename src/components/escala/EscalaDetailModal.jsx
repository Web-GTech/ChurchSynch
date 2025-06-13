import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const EscalaDetailModal = ({ isOpen, onOpenChange, evento }) => {
  if (!evento) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground rounded-lg shadow-xl">
        <DialogHeader className="border-b border-border/70 pb-3">
          <DialogTitle className="text-lg font-semibold text-foreground">{evento.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground pt-0.5 text-sm">
            Data: {new Date(evento.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2.5 max-h-[60vh] overflow-y-auto text-sm">
          <p><strong className="font-medium text-foreground/90">Ministério:</strong> {evento.ministerio}</p>
          {evento.responsibles && evento.responsibles.length > 0 && (
            <div>
              <strong className="font-medium text-foreground/90">Responsáveis:</strong>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5">
                {evento.responsibles.map((resp, idx) => <li key={idx}>{resp}</li>)}
              </ul>
            </div>
          )}
          {evento.convidado && evento.convidado.nome && (
             <div>
              <strong className="font-medium text-foreground/90">Convidado:</strong>
              <p className="ml-4 mt-1">{evento.convidado.nome} - {evento.convidado.funcao_designada || 'Participante'}</p>
            </div>
          )}
          {evento.notes && <p><strong className="font-medium text-foreground/90">Observações:</strong> {evento.notes}</p>}
        </div>
        <DialogFooter className="pt-4 border-t border-border/70">
          <Button onClick={() => onOpenChange(false)} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-9 text-sm">Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EscalaDetailModal;