import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Lightbulb, Music, Palette, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const initialSuggestionsData = [
  { id: 1, artist: "Hillsong United", name: "Oceans (Where Feet May Fail)" },
  { id: 2, artist: "Chris Tomlin", name: "How Great Is Our God" },
  { id: 3, artist: "Lauren Daigle", name: "You Say" },
  { id: 4, artist: "Fernandinho", name: "Grandes Coisas" },
  { id: 5, artist: "Aline Barros", name: "Sonda-me, Usa-me" },
];

const RepertorioSuggestions = ({ onSuggestionClick }) => {
  const [suggestions, setSuggestions] = useState(() => {
    const savedSuggestions = localStorage.getItem('ibabepi_repertorio_suggestions_v2');
    return savedSuggestions ? JSON.parse(savedSuggestions) : initialSuggestionsData;
  });
  const [showAddSuggestion, setShowAddSuggestion] = useState(false);
  const [newSuggestion, setNewSuggestion] = useState({ artist: '', name: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    localStorage.setItem('ibabepi_repertorio_suggestions_v2', JSON.stringify(suggestions));
  }, [suggestions]);

  const handleAddSuggestion = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Acesso Negado",
        description: "Apenas administradores podem adicionar sugestões."
      });
      return;
    }
    if (!newSuggestion.artist.trim() || !newSuggestion.name.trim()) {
      toast({
        variant: "destructive",
        title: "Campos Vazios",
        description: "Preencha o artista e nome da música para a sugestão."
      });
      return;
    }
    const newId = suggestions.length > 0 ? Math.max(...suggestions.map(s => s.id)) + 1 : 1;
    setSuggestions([...suggestions, { id: newId, ...newSuggestion }]);
    setNewSuggestion({ artist: '', name: '' });
    setShowAddSuggestion(false);
    toast({
      title: "Sugestão Adicionada!",
      description: `${newSuggestion.name} por ${newSuggestion.artist} adicionada.`,
      className: "bg-green-500 text-white"
    });
  };

  const handleRemoveSuggestion = (id) => {
    if (!isAdmin) {
        toast({ variant: "destructive", title: "Acesso Negado", description: "Apenas administradores podem remover sugestões." });
        return;
    }
    setSuggestions(suggestions.filter(s => s.id !== id));
    toast({ title: "Sugestão Removida", className: "bg-ibabepi-blue-medium text-white" });
  };

  const filteredSuggestions = searchTerm
    ? suggestions.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.artist.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : suggestions;

  return (
    <section className="mt-10 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-ibabepi-blue-dark flex items-center">
          <Lightbulb className="mr-2 h-6 w-6 text-yellow-400" /> Sugestões de Músicas
        </h3>
        {isAdmin && (
          <Button variant="ghost" size="sm" onClick={() => setShowAddSuggestion(!showAddSuggestion)} className="text-ibabepi-blue-medium hover:text-ibabepi-blue-dark">
            <PlusCircle className="mr-2 h-4 w-4" /> {showAddSuggestion ? 'Cancelar' : 'Adicionar Sugestão'}
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showAddSuggestion && isAdmin && (
          <motion.form
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: '1rem' }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            onSubmit={handleAddSuggestion}
            className="p-4 border border-ibabepi-blue-lighter rounded-lg mb-4 space-y-3 bg-white shadow-sm"
          >
            <h4 className="font-medium text-ibabepi-blue-dark">Nova Sugestão</h4>
            <Input placeholder="Artista" value={newSuggestion.artist} onChange={(e) => setNewSuggestion({ ...newSuggestion, artist: e.target.value })} className="border-ibabepi-blue-light focus:border-ibabepi-blue-medium"/>
            <Input placeholder="Nome da Música" value={newSuggestion.name} onChange={(e) => setNewSuggestion({ ...newSuggestion, name: e.target.value })} className="border-ibabepi-blue-light focus:border-ibabepi-blue-medium"/>
            <Button type="submit" size="sm" className="bg-ibabepi-blue-medium hover:bg-ibabepi-blue-dark text-white">Adicionar</Button>
          </motion.form>
        )}
      </AnimatePresence>

      <Input
        type="text"
        placeholder="Buscar sugestões..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full border-ibabepi-blue-light focus:border-ibabepi-blue-medium shadow-sm"
      />

      {filteredSuggestions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredSuggestions.map((s, index) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                <Card 
                    className="h-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white border-ibabepi-blue-lighter rounded-lg cursor-pointer group"
                    onClick={() => onSuggestionClick(s.artist, s.name)}
                >
                  <CardContent className="p-4 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-start">
                        <Music className="h-6 w-6 text-ibabepi-blue-medium mb-2 group-hover:text-ibabepi-blue-dark transition-colors" />
                        {isAdmin && (
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-ibabepi-gray hover:text-red-500 opacity-50 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); handleRemoveSuggestion(s.id); }}>
                                <X size={16} />
                            </Button>
                        )}
                      </div>
                      <h4 className="font-semibold text-ibabepi-blue-darkest group-hover:text-ibabepi-blue-dark transition-colors">{s.name}</h4>
                      <p className="text-xs text-ibabepi-gray-dark">{s.artist}</p>
                    </div>
                    <Button variant="link" className="text-xs mt-3 p-0 h-auto self-start text-ibabepi-blue-medium group-hover:underline">
                      Pesquisar esta música
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-center text-ibabepi-gray-dark py-4">Nenhuma sugestão encontrada.</p>
      )}
    </section>
  );
};

export default RepertorioSuggestions;