import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Search as SearchIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import RepertorioSearch from '@/components/RepertorioSearch';
import RepertorioResults from '@/components/RepertorioResults';
import RepertorioSuggestions from '@/components/RepertorioSuggestions';
import SearchHistoryList from '@/components/SearchHistoryList';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const RepertorioPage = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [churchRepertory, setChurchRepertory] = useState([]);
  const { user, addSongToLiturgy, canEditLiturgy } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === 'admin';
  const userCanEditLiturgy = canEditLiturgy();

  useEffect(() => {
    const storedHistory = localStorage.getItem('repertorioSearchHistory_v2');
    if (storedHistory) setSearchHistory(JSON.parse(storedHistory));
    const storedRepertory = localStorage.getItem('churchRepertory_v2');
    if (storedRepertory) setChurchRepertory(JSON.parse(storedRepertory));
  }, []);

  const updateSearchHistory = (newSearch) => {
    const updatedHistory = [newSearch, ...searchHistory.filter(item => !(item.artist === newSearch.artist && item.song === newSearch.song))].slice(0, 10);
    setSearchHistory(updatedHistory);
    localStorage.setItem('repertorioSearchHistory_v2', JSON.stringify(updatedHistory));
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
    if (results && results.artist && results.song) {
      updateSearchHistory({ artist: results.artist, song: results.song, tone: results.tone, id: results.id || Date.now().toString() });
    }
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('repertorioSearchHistory_v2');
    toast({ title: "Histórico Limpo", description: "Seu histórico de busca de repertório foi removido." });
  };

  const handleRemoveFromHistory = (itemIdToRemove) => {
    const updatedHistory = searchHistory.filter(item => item.id !== itemIdToRemove);
    setSearchHistory(updatedHistory);
    localStorage.setItem('repertorioSearchHistory_v2', JSON.stringify(updatedHistory));
  };
  
  const handleHistoryItemClick = (artist, song, tone) => {
     const formattedArtist = artist.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
     const formattedSong = song.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
     handleSearchResults({
      id: `${Date.now()}-${song}`,
      artist: artist,
      song: song,
      tone: tone || '', 
      vagalume: `https://www.vagalume.com.br/${formattedArtist}/${formattedSong}.html`,
      cifraclub: `https://www.cifraclub.com.br/${formattedArtist}/${formattedSong}/`,
      cifraclubPrint: `https://m.cifraclub.com.br/${formattedArtist}/${formattedSong}/imprimir.html`,
      deezer: `https://www.deezer.com/search/${encodeURIComponent(artist + " " + song)}`,
      youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(artist + " " + song + " oficial")}`
    });
  };


  const handleSaveToChurchRepertory = (songDetails) => {
    if (!isAdmin) {
      toast({ variant: "destructive", title: "Permissão Negada", description: "Apenas administradores podem salvar músicas no repertório da igreja." });
      return;
    }
    const isAlreadySaved = churchRepertory.some(s => s.song === songDetails.song && s.artist === songDetails.artist);
    if (isAlreadySaved) {
      toast({ variant: "default", title: "Já Salvo", description: `${songDetails.song} já está no repertório da igreja.` });
      return;
    }
    const newSong = { 
      id: songDetails.id || `${Date.now()}-${songDetails.song}`, 
      song: songDetails.song, 
      artist: songDetails.artist, 
      tone: songDetails.tone, 
      vagalume: songDetails.vagalume, 
      cifraclub: songDetails.cifraclubPrint || songDetails.cifraclub,
      youtube: songDetails.youtube,
      deezer: songDetails.deezer
    };
    const updatedRepertory = [...churchRepertory, newSong];
    setChurchRepertory(updatedRepertory);
    localStorage.setItem('churchRepertory_v2', JSON.stringify(updatedRepertory));
    toast({ title: "Salvo no Repertório!", description: `${songDetails.song} por ${songDetails.artist} adicionado ao repertório da igreja.` });
  };

  const handleAddSongToLiturgy = (songDetails) => {
    if (!userCanEditLiturgy) {
      toast({ variant: "destructive", title: "Permissão Negada", description: "Você não tem permissão para adicionar músicas à liturgia." });
      return;
    }
    const songToAdd = {
      id: songDetails.id || `${Date.now()}-${songDetails.song}`,
      title: songDetails.song,
      artist: songDetails.artist,
      tone: songDetails.tone,
      type: 'louvor',
      lyricsUrl: songDetails.vagalume,
      chordsUrl: songDetails.cifraclubPrint || songDetails.cifraclub,
      youtubeUrl: songDetails.youtube,
      completed: false
    };
    addSongToLiturgy(songToAdd); 
  };
  
  const handleSuggestionClick = (suggestionArtist, suggestionName) => {
    const formattedArtist = suggestionArtist.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const formattedSong = suggestionName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    handleSearchResults({
      id: `${Date.now()}-${suggestionName}`,
      artist: suggestionArtist,
      song: suggestionName,
      tone: '', 
      vagalume: `https://www.vagalume.com.br/${formattedArtist}/${formattedSong}.html`,
      cifraclub: `https://www.cifraclub.com.br/${formattedArtist}/${formattedSong}/`,
      cifraclubPrint: `https://m.cifraclub.com.br/${formattedArtist}/${formattedSong}/imprimir.html`,
      deezer: `https://www.deezer.com/search/${encodeURIComponent(suggestionArtist + " " + suggestionName)}`,
      youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(suggestionArtist + " " + suggestionName + " oficial")}`
    });
  };


  return (
    <motion.div
      className="page-container full-height-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-4xl shadow-sm bg-card rounded-xl overflow-hidden flex-grow flex flex-col border border-slate-200">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-center py-3 sm:py-4 px-4">
          <Music size={28} className="text-primary-foreground mx-auto mb-1 sm:mb-1.5" />
          <CardTitle className="text-xl sm:text-2xl font-bold text-primary-foreground">Repertório Musical</CardTitle>
          <CardDescription className="text-primary-foreground/80 mt-0.5 text-xs sm:text-sm">Encontre letras, cifras e ouça suas músicas.</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 space-y-3 flex-grow flex flex-col overflow-y-auto">
          <RepertorioSearch onSearchResults={handleSearchResults} />
          
          {searchResults && (
            <RepertorioResults 
              results={searchResults} 
              onSaveToChurchRepertory={handleSaveToChurchRepertory}
              onAddToLiturgy={handleAddSongToLiturgy}
              savedSongs={churchRepertory}
              isAdmin={isAdmin}
              canEditLiturgy={userCanEditLiturgy}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow overflow-hidden">
            <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar">
              {searchHistory.length > 0 && (
                <SearchHistoryList 
                  history={searchHistory} 
                  onHistoryItemClick={handleHistoryItemClick}
                  onClearHistory={handleClearHistory}
                  onRemoveItem={handleRemoveFromHistory}
                />
              )}
            </div>
            <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar">
               <RepertorioSuggestions onSuggestionClick={handleSuggestionClick} />
            </div>
          </div>
          
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RepertorioPage;