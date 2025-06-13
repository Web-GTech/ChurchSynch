import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpenText, PlusCircle, Sparkles, Music, BookOpen, Users, Mic2, CalendarCheck2, Clapperboard, Menu as MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import LiturgiaItemForm from '@/components/liturgia/LiturgiaItemForm';
import LiturgiaProgress from '@/components/liturgia/LiturgiaProgress';
import LiturgiaEmptyState from '@/components/liturgia/LiturgiaEmptyState';
import LiturgiaEtapaCard from '@/components/liturgia/LiturgiaEtapaCard';

const etapaOrder = [
  'abertura', 'louvor', 'palavra', 'ofertório', 'testemunho', 'aviso', 'encerramento', 'outro'
];

const getEtapaInfo = (type) => {
  const etapas = {
    abertura: { title: 'Momento Inicial / Abertura', icon: <Sparkles className="h-5 w-5" /> },
    louvor: { title: 'Louvor e Adoração', icon: <Music className="h-5 w-5" /> },
    palavra: { title: 'Leitura e Pregação da Palavra', icon: <BookOpen className="h-5 w-5" /> },
    ofertório: { title: 'Dízimos e Ofertas', icon: <Users className="h-5 w-5" /> },
    testemunho: { title: 'Testemunhos', icon: <Mic2 className="h-5 w-5" /> },
    aviso: { title: 'Avisos e Comunicados', icon: <CalendarCheck2 className="h-5 w-5" /> },
    encerramento: { title: 'Encerramento / Bênção Final', icon: <Clapperboard className="h-5 w-5" /> },
    default: { title: 'Outros Momentos', icon: <MenuIcon className="h-5 w-5" /> }
  };
  return etapas[type] || etapas.default;
};


const LiturgiaPage = () => {
  const { liturgy = [], updateLiturgy, canEditLiturgy, selectedSongForLiturgy, addSongToLiturgy: contextAddSongToLiturgy } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  const userCanEdit = canEditLiturgy();

  useEffect(() => {
    if (selectedSongForLiturgy && userCanEdit) {
      contextAddSongToLiturgy(selectedSongForLiturgy);
    }
  }, [selectedSongForLiturgy, userCanEdit, contextAddSongToLiturgy]);


  const handleAddItem = (newItem) => {
    const updatedLiturgy = [...liturgy, newItem];
    updateLiturgy(updatedLiturgy.sort((a,b) => etapaOrder.indexOf(a.type) - etapaOrder.indexOf(b.type)));
    setIsFormOpen(false);
    toast({ title: "Item Adicionado", description: `${newItem.title} foi adicionado à liturgia.` });
  };

  const handleToggleComplete = (itemId) => {
    const updatedLiturgy = liturgy.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updateLiturgy(updatedLiturgy);
  };

  const handleRemoveItem = (itemId) => {
    if (!userCanEdit) {
      toast({ variant: "destructive", title: "Permissão Negada", description: "Você não tem permissão para remover itens." });
      return;
    }
    const updatedLiturgy = liturgy.filter(item => item.id !== itemId);
    updateLiturgy(updatedLiturgy);
    toast({ title: "Item Removido", description: "O item foi removido da liturgia." });
  };

  const handleOpenEditModal = (item) => {
    if (!userCanEdit) {
      toast({ variant: "destructive", title: "Permissão Negada", description: "Você não tem permissão para editar itens." });
      return;
    }
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedItem = (editedItemData) => {
    const updatedLiturgy = liturgy.map(item =>
      item.id === editingItem.id ? { ...item, ...editedItemData } : item
    );
    updateLiturgy(updatedLiturgy.sort((a,b) => etapaOrder.indexOf(a.type) - etapaOrder.indexOf(b.type)));
    setIsEditModalOpen(false);
    setEditingItem(null);
    toast({ title: "Item Atualizado", description: `${editedItemData.title} foi atualizado.` });
  };

  const groupedLiturgy = liturgy.reduce((acc, item) => {
    const etapaInfo = getEtapaInfo(item.type);
    const etapaKey = etapaInfo.title; 
    if (!acc[etapaKey]) {
      acc[etapaKey] = {
        icon: etapaInfo.icon,
        type: item.type, 
        items: []
      };
    }
    acc[etapaKey].items.push(item);
    return acc;
  }, {});

  const sortedEtapas = Object.entries(groupedLiturgy).sort(([keyA, valA], [keyB, valB]) => {
    return etapaOrder.indexOf(valA.type) - etapaOrder.indexOf(valB.type);
  });

  return (
    <motion.div
      className="page-container full-height-page bg-slate-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-4xl mx-auto shadow-lg bg-card rounded-xl overflow-hidden flex-grow flex flex-col my-3 md:my-4 border border-border/50">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-center py-4 sm:py-5 px-4">
          <BookOpenText size={32} className="text-primary-foreground mx-auto mb-1.5 sm:mb-2" />
          <CardTitle className="text-xl sm:text-2xl font-bold text-primary-foreground">Liturgia Semanal</CardTitle>
          <CardDescription className="text-primary-foreground/80 mt-1 text-xs sm:text-sm">Acompanhe a ordem do culto.</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 space-y-3 flex-grow flex flex-col overflow-y-auto">
          <LiturgiaProgress liturgy={liturgy} />

          {userCanEdit && (
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary text-sm py-2.5 h-10 rounded-md">
                  <PlusCircle size={18} className="mr-2" /> Adicionar Novo Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-card rounded-lg p-5">
                <DialogHeader>
                  <DialogTitle className="text-foreground text-lg">Novo Item da Liturgia</DialogTitle>
                </DialogHeader>
                <LiturgiaItemForm onAddItem={handleAddItem} onCancel={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          )}

          {liturgy.length === 0 ? (
            <LiturgiaEmptyState />
          ) : (
            <div className="space-y-4 flex-grow overflow-y-auto pr-1 custom-scrollbar">
              {sortedEtapas.map(([etapaTitle, etapaData], index) => (
                <LiturgiaEtapaCard
                  key={etapaTitle}
                  etapaTitle={etapaTitle}
                  etapaIcon={etapaData.icon}
                  items={etapaData.items}
                  onToggleComplete={handleToggleComplete}
                  onRemoveItem={handleRemoveItem}
                  onEditItem={handleOpenEditModal}
                  userCanEdit={userCanEdit}
                  animationDelay={index * 0.1}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {editingItem && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-md bg-card rounded-lg p-5">
            <DialogHeader>
              <DialogTitle className="text-foreground text-lg">Editar Item da Liturgia</DialogTitle>
            </DialogHeader>
            <LiturgiaItemForm 
              existingItem={editingItem} 
              onSaveItem={handleSaveEditedItem} 
              onCancel={() => { setIsEditModalOpen(false); setEditingItem(null); }} 
            />
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

export default LiturgiaPage;