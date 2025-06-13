import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const EscalaForm = ({ onSave, existingEvent, onCancel }) => {
  const { users, user: currentUser } = useAuth(); 
  const [title, setTitle] = useState(existingEvent?.title || '');
  const [date, setDate] = useState(existingEvent?.date || '');
  const [ministerio, setMinisterio] = useState(existingEvent?.ministerio || '');
  const [responsibles, setResponsibles] = useState(existingEvent?.responsibles?.join(', ') || '');
  const [notes, setNotes] = useState(existingEvent?.notes || '');
  const [convidadoId, setConvidadoId] = useState(existingEvent?.convidado?.id || '');
  const [funcaoConvidado, setFuncaoConvidado] = useState(existingEvent?.convidado?.funcao_designada || '');

  const { toast } = useToast();

  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title || '');
      setDate(existingEvent.date || '');
      setMinisterio(existingEvent.ministerio || '');
      setResponsibles(existingEvent.responsibles?.join(', ') || '');
      setNotes(existingEvent.notes || '');
      setConvidadoId(existingEvent.convidado?.id || '');
      setFuncaoConvidado(existingEvent.convidado?.funcao_designada || '');
    } else {
      setTitle('');
      setDate('');
      setMinisterio('');
      setResponsibles('');
      setNotes('');
      setConvidadoId('');
      setFuncaoConvidado('');
    }
  }, [existingEvent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date || !ministerio) {
      toast({ variant: "destructive", title: "Campos obrigatórios", description: "Título, Data e Ministério são obrigatórios."});
      return;
    }
    
    let convidadoData = null;
    if (convidadoId) {
      const membroConvidado = users.find(u => u.id === convidadoId);
      if (membroConvidado) {
        convidadoData = {
          id: membroConvidado.id,
          nome: `${membroConvidado.nome} ${membroConvidado.sobrenome || ''}`.trim(),
          funcao_designada: funcaoConvidado || 'Participante'
        };
        
        console.log(`Simulando notificação para ${convidadoData.nome} sobre a escala ${title} em ${date} para a função ${convidadoData.funcao_designada}.`);
        toast({
          title: "Membro Convidado",
          description: `${convidadoData.nome} será notificado(a) para a escala (simulação).`,
        });
      }
    }

    onSave({
      id: existingEvent?.id || Date.now().toString(),
      title,
      date,
      ministerio,
      responsibles: responsibles.split(',').map(r => r.trim()).filter(r => r),
      notes,
      convidado: convidadoData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 p-1">
      <div>
        <Label htmlFor="title" className="text-xs text-muted-foreground">Título do Evento/Serviço</Label>
        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Culto de Domingo" className="mt-1 h-9 text-sm border-border bg-input focus:ring-primary focus:border-primary" required />
      </div>
      <div>
        <Label htmlFor="date" className="text-xs text-muted-foreground">Data</Label>
        <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 h-9 text-sm border-border bg-input focus:ring-primary focus:border-primary" required />
      </div>
      <div>
        <Label htmlFor="ministerio" className="text-xs text-muted-foreground">Ministério</Label>
        <Input id="ministerio" value={ministerio} onChange={e => setMinisterio(e.target.value)} placeholder="Ex: Louvor" className="mt-1 h-9 text-sm border-border bg-input focus:ring-primary focus:border-primary" required />
      </div>
      <div>
        <Label htmlFor="responsibles" className="text-xs text-muted-foreground">Responsáveis (separados por vírgula)</Label>
        <Input id="responsibles" value={responsibles} onChange={e => setResponsibles(e.target.value)} placeholder="Ex: João, Maria" className="mt-1 h-9 text-sm border-border bg-input focus:ring-primary focus:border-primary" />
      </div>
      
      <div className="border-t border-border/70 pt-3 space-y-3.5">
        <Label className="text-xs font-medium text-foreground">Convidar Membro (Opcional)</Label>
        <div>
          <Label htmlFor="convidadoId" className="text-xs text-muted-foreground">Selecionar Membro</Label>
          <Select value={convidadoId} onValueChange={setConvidadoId}>
            <SelectTrigger className="w-full mt-1 h-9 text-sm border-border bg-input focus:ring-primary focus:border-primary">
              <SelectValue placeholder="Selecione um membro para convidar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Nenhum</SelectItem>
              {users.filter(u => u.id !== currentUser?.id).map(u => ( 
                <SelectItem key={u.id} value={u.id}>
                  {u.nome} {u.sobrenome || ''} ({u.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {convidadoId && (
          <div>
            <Label htmlFor="funcaoConvidado" className="text-xs text-muted-foreground">Função do Convidado</Label>
            <Input id="funcaoConvidado" value={funcaoConvidado} onChange={e => setFuncaoConvidado(e.target.value)} placeholder="Ex: Vocalista, Mídia" className="mt-1 h-9 text-sm border-border bg-input focus:ring-primary focus:border-primary" />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="notes" className="text-xs text-muted-foreground">Observações</Label>
        <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ex: Chegar 30 min antes" className="mt-1 text-sm border-border bg-input focus:ring-primary focus:border-primary min-h-[60px]" />
      </div>
      <div className="flex justify-end space-x-2.5 pt-2">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel} className="h-9 text-sm border-border hover:bg-muted/50">Cancelar</Button>}
        <Button type="submit" className="h-9 text-sm bg-primary hover:bg-primary/90 text-primary-foreground">{existingEvent ? 'Salvar Alterações' : 'Adicionar Escala'}</Button>
      </div>
    </form>
  );
};

export default EscalaForm;