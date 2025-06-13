import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const itemTypes = [
  { value: 'abertura', label: 'Abertura' },
  { value: 'louvor', label: 'Louvor/Adoração' },
  { value: 'palavra', label: 'Pregação/Palavra' },
  { value: 'ofertório', label: 'Ofertório/Dízimos' },
  { value: 'testemunho', label: 'Testemunho' },
  { value: 'aviso', label: 'Avisos' },
  { value: 'encerramento', label: 'Encerramento/Bênção' },
  { value: 'outro', label: 'Outro' },
];

const LiturgiaItemForm = ({ onAddItem, existingItem, onSaveItem, onCancel }) => {
  const [item, setItem] = useState(
    existingItem || { title: '', type: 'louvor', responsible: '', details: '', completed: false }
  );
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value) => {
    setItem(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item.title || !item.type) {
      toast({ variant: "destructive", title: "Campos obrigatórios", description: "Título e tipo são obrigatórios."});
      return;
    }
    if (existingItem) {
      onSaveItem(item);
    } else {
      onAddItem({ ...item, id: Date.now().toString() });
    }
    if (onCancel) onCancel();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <div>
        <Label htmlFor="title" className="text-slate-700">Título</Label>
        <Input id="title" name="title" value={item.title} onChange={handleChange} placeholder="Ex: Oração Inicial, Hino 123" className="mt-1 border-slate-300 text-slate-700" required />
      </div>
      <div>
        <Label htmlFor="type" className="text-slate-700">Tipo</Label>
        <Select name="type" value={item.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="mt-1 border-slate-300 text-slate-700">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            {itemTypes.map(typeOption => (
              <SelectItem key={typeOption.value} value={typeOption.value}>{typeOption.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="responsible" className="text-slate-700">Responsável (Opcional)</Label>
        <Input id="responsible" name="responsible" value={item.responsible} onChange={handleChange} placeholder="Ex: Pastor João, Equipe de Louvor" className="mt-1 border-slate-300 text-slate-700" />
      </div>
      <div>
        <Label htmlFor="details" className="text-slate-700">Detalhes/Links (Opcional)</Label>
        <Input id="details" name="details" value={item.details} onChange={handleChange} placeholder="Ex: Link da cifra, observações" className="mt-1 border-slate-300 text-slate-700" />
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel} className="border-slate-300 text-slate-700">Cancelar</Button>}
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">{existingItem ? 'Salvar Alterações' : 'Adicionar Item'}</Button>
      </div>
    </form>
  );
};

export default LiturgiaItemForm;