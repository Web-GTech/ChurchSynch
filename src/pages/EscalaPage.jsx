import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Users, PlusCircle, Trash2, Edit3, Maximize2, AlertTriangle, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const EscalaDetailModal = ({ isOpen, onOpenChange, evento }) => {
  if (!evento) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground rounded-lg shadow-xl">
        <DialogHeader className="border-b border-slate-200 pb-2.5">
          <DialogTitle className="text-lg font-semibold text-slate-900">{evento.title}</DialogTitle>
          <DialogDescription className="text-slate-600 pt-0.5 text-xs">
            Data: {new Date(evento.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </DialogDescription>
        </DialogHeader>
        <div className="py-3 space-y-2 max-h-[60vh] overflow-y-auto text-xs">
          <p><strong className="font-medium text-slate-800">Ministério:</strong> {evento.ministerio}</p>
          {evento.responsibles && evento.responsibles.length > 0 && (
            <div>
              <strong className="font-medium text-slate-800">Responsáveis:</strong>
              <ul className="list-disc list-inside ml-3 mt-0.5">
                {evento.responsibles.map((resp, idx) => <li key={idx}>{resp}</li>)}
              </ul>
            </div>
          )}
          {evento.notes && <p><strong className="font-medium text-slate-800">Observações:</strong> {evento.notes}</p>}
        </div>
        <DialogFooter className="pt-2.5 border-t border-slate-200">
          <Button onClick={() => onOpenChange(false)} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-9 text-xs">Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const EscalaForm = ({ onSave, existingEvent, onCancel }) => {
  const [title, setTitle] = useState(existingEvent?.title || '');
  const [date, setDate] = useState(existingEvent?.date || '');
  const [ministerio, setMinisterio] = useState(existingEvent?.ministerio || '');
  const [responsibles, setResponsibles] = useState(existingEvent?.responsibles?.join(', ') || '');
  const [notes, setNotes] = useState(existingEvent?.notes || '');
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date || !ministerio) {
      toast({ variant: "destructive", title: "Campos obrigatórios", description: "Título, Data e Ministério são obrigatórios."});
      return;
    }
    onSave({
      id: existingEvent?.id || Date.now().toString(),
      title,
      date,
      ministerio,
      responsibles: responsibles.split(',').map(r => r.trim()).filter(r => r),
      notes
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-0.5">
      <div>
        <Label htmlFor="title" className="text-xs text-slate-700">Título do Evento/Serviço</Label>
        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Culto de Domingo" className="mt-0.5 h-9 text-xs border-slate-300 text-slate-700" required />
      </div>
      <div>
        <Label htmlFor="date" className="text-xs text-slate-700">Data</Label>
        <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-0.5 h-9 text-xs border-slate-300 text-slate-700" required />
      </div>
      <div>
        <Label htmlFor="ministerio" className="text-xs text-slate-700">Ministério</Label>
        <Input id="ministerio" value={ministerio} onChange={e => setMinisterio(e.target.value)} placeholder="Ex: Louvor" className="mt-0.5 h-9 text-xs border-slate-300 text-slate-700" required />
      </div>
      <div>
        <Label htmlFor="responsibles" className="text-xs text-slate-700">Responsáveis (separados por vírgula)</Label>
        <Input id="responsibles" value={responsibles} onChange={e => setResponsibles(e.target.value)} placeholder="Ex: João, Maria" className="mt-0.5 h-9 text-xs border-slate-300 text-slate-700" />
      </div>
      <div>
        <Label htmlFor="notes" className="text-xs text-slate-700">Observações</Label>
        <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ex: Chegar 30 min antes" className="mt-0.5 text-xs border-slate-300 text-slate-700 min-h-[50px]" />
      </div>
      <div className="flex justify-end space-x-2 pt-1.5">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel} className="h-9 text-xs border-slate-300 text-slate-700">Cancelar</Button>}
        <Button type="submit" className="h-9 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">{existingEvent ? 'Salvar' : 'Adicionar'}</Button>
      </div>
    </form>
  );
};

const EscalaPage = () => {
  const { user } = useAuth();
  const [escalas, setEscalas] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null);
  const [filter, setFilter] = useState('proximos'); 
  const { toast } = useToast();

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const storedEscalas = localStorage.getItem('churchFacilitiesEscalas_v2');
    if (storedEscalas) {
      setEscalas(JSON.parse(storedEscalas));
    }
  }, []);

  const saveEscalas = (updatedEscalas) => {
    setEscalas(updatedEscalas);
    localStorage.setItem('churchFacilitiesEscalas_v2', JSON.stringify(updatedEscalas));
  };

  const handleSaveEvent = (eventData) => {
    let updatedEscalas;
    if (editingEvent) {
      updatedEscalas = escalas.map(e => e.id === editingEvent.id ? eventData : e);
      toast({ title: "Escala Atualizada", description: `${eventData.title} foi atualizado.` });
    } else {
      updatedEscalas = [...escalas, eventData];
      toast({ title: "Escala Adicionada", description: `${eventData.title} foi adicionado.` });
    }
    saveEscalas(updatedEscalas.sort((a, b) => new Date(a.date) - new Date(b.date)));
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleEditEvent = (event) => {
    if (!isAdmin) {
      toast({ variant: "destructive", title: "Permissão Negada", description: "Apenas administradores podem editar escalas." });
      return;
    }
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleRemoveEvent = (eventId) => {
    if (!isAdmin) {
      toast({ variant: "destructive", title: "Permissão Negada", description: "Apenas administradores podem remover escalas." });
      return;
    }
    const eventToRemove = escalas.find(e => e.id === eventId);
    saveEscalas(escalas.filter(e => e.id !== eventId));
    if (eventToRemove) {
      toast({ title: "Escala Removida", description: `${eventToRemove.title} foi removido.` });
    }
  };

  const handleOpenDetailModal = (event) => {
    setSelectedEventForDetail(event);
    setIsDetailModalOpen(true);
  };
  
  const today = new Date().toISOString().split('T')[0];

  const filteredEscalas = escalas.filter(escala => {
    if (filter === 'proximos') return escala.date >= today;
    if (filter === 'passados') return escala.date < today;
    return true; 
  }).sort((a, b) => filter === 'passados' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date));


  return (
    <motion.div
      className="page-container full-height-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-4xl shadow-sm bg-card rounded-xl overflow-hidden flex-grow flex flex-col border border-slate-200">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-center py-3 sm:py-4 px-4">
          <CalendarDays size={28} className="text-primary-foreground mx-auto mb-1 sm:mb-1.5" />
          <CardTitle className="text-xl sm:text-2xl font-bold text-primary-foreground">Escalas de Serviço</CardTitle>
          <CardDescription className="text-primary-foreground/80 mt-0.5 text-xs sm:text-sm">Confira as escalas e responsabilidades.</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 space-y-3 flex-grow flex flex-col overflow-y-auto">
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            {isAdmin && (
              <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) setEditingEvent(null);}}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 hover:text-primary text-sm py-2 h-9">
                    <PlusCircle size={16} className="mr-1.5" /> {editingEvent ? 'Editar' : 'Nova Escala'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-card rounded-lg p-4">
                  <DialogHeader className="pb-2">
                    <DialogTitle className="text-md text-slate-900">{editingEvent ? 'Editar Escala' : 'Adicionar Nova Escala'}</DialogTitle>
                  </DialogHeader>
                  <EscalaForm 
                    onSave={handleSaveEvent} 
                    existingEvent={editingEvent}
                    onCancel={() => { setIsFormOpen(false); setEditingEvent(null); }}
                  />
                </DialogContent>
              </Dialog>
            )}
            <div className="flex-grow" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[160px] border-slate-300 text-slate-700 text-xs py-2 h-9">
                <SelectValue placeholder="Filtrar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="proximos" className="text-xs">Próximos</SelectItem>
                <SelectItem value="passados" className="text-xs">Passados</SelectItem>
                <SelectItem value="todos" className="text-xs">Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredEscalas.length === 0 ? (
             <div className="text-center py-10 text-slate-500 flex-grow flex flex-col justify-center items-center">
                <AlertTriangle size={28} className="mx-auto mb-1.5 opacity-50" />
                <p className="text-sm">Nenhuma escala encontrada.</p>
             </div>
          ) : (
            <div className="space-y-2 flex-grow overflow-y-auto pr-1">
              {filteredEscalas.map((escala, index) => (
                <motion.div
                  key={escala.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white border border-slate-200 rounded-md shadow-sm hover:shadow-md transition-shadow aspect-[16/2.5] flex flex-col justify-between p-2.5" 
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-xs text-slate-900 truncate">{escala.title}</h3>
                        <p className="text-2xs text-slate-500">
                          {new Date(escala.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })} - {escala.ministerio}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 mt-0.5">
                        {isAdmin && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => handleEditEvent(escala)} className="h-6 w-6 text-slate-500 hover:text-blue-600 hover:bg-blue-100">
                              <Edit3 size={12} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveEvent(escala.id)} className="h-6 w-6 text-slate-500 hover:text-red-600 hover:bg-red-100">
                              <Trash2 size={12} />
                            </Button>
                          </>
                        )}
                         <Button variant="ghost" size="icon" onClick={() => handleOpenDetailModal(escala)} className="h-6 w-6 text-slate-500 hover:text-primary hover:bg-primary/10">
                            <Maximize2 size={12} />
                          </Button>
                      </div>
                    </div>
                    {escala.responsibles && escala.responsibles.length > 0 && (
                      <div className="mt-1">
                        <p className="text-2xs text-slate-700 truncate">
                          <Users size={10} className="inline mr-1 opacity-70" />
                          {escala.responsibles.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <EscalaDetailModal isOpen={isDetailModalOpen} onOpenChange={setIsDetailModalOpen} evento={selectedEventForDetail} />
    </motion.div>
  );
};

export default EscalaPage;