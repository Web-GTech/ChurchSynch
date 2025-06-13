import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Music } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const RepertorioSearch = ({ onSearchResults }) => {
  const [artistName, setArtistName] = useState('');
  const [songName, setSongName] = useState('');
  const [songTone, setSongTone] = useState('');
  const { toast } = useToast();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!artistName.trim() || !songName.trim()) {
      toast({
        variant: "destructive",
        title: "Campos Obrigatórios",
        description: "Por favor, preencha o nome do artista/banda e o nome da música."
      });
      return;
    }

    const formatForUrl = (text) =>
      text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const formattedArtist = formatForUrl(artistName);
    const formattedSong = formatForUrl(songName);
    
    const vagalumeBase = `https://www.vagalume.com.br/${formattedArtist}/${formattedSong}.html`;
    // CifraClub sometimes uses just the song name, sometimes artist and song.
    // A more robust solution would be to try both or use their API if available.
    // For simplicity, we'll use the common pattern.
    // The print version is often cleaner for embedding if available.
    const cifraClubBase = `https://www.cifraclub.com.br/${formattedArtist}/${formattedSong}`;
    const cifraClubPrint = `https://m.cifraclub.com.br/${formattedArtist}/${formattedSong}/imprimir.html`;


    const searchData = {
      id: `${Date.now()}-${songName}-${artistName}`, // Unique ID for history
      artist: artistName,
      song: songName,
      tone: songTone || 'N/A',
      vagalume: vagalumeBase,
      cifraclub: `${cifraClubBase}/`,
      cifraclubPrint: cifraClubPrint, // Use print version for embed
      deezer: `https://www.deezer.com/search/${encodeURIComponent(artistName + " " + songName)}`,
      youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(artistName + " " + songName + " oficial")}`,
      youtubeMusic: `https://music.youtube.com/search?q=${encodeURIComponent(artistName + " " + songName)}`
    };
    
    onSearchResults(searchData);

    toast({
      title: "Busca Realizada!",
      description: `Exibindo resultados para ${songName} de ${artistName}.`,
      className: "bg-green-500 text-white"
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSearch}
      className="space-y-5 mb-8 p-6 border border-ibabepi-blue-lighter rounded-xl shadow-lg bg-gradient-to-br from-white to-ibabepi-blue-lightest"
    >
      <div className="flex items-center text-ibabepi-blue-darkest mb-3">
        <Music className="mr-3 h-6 w-6" />
        <h2 className="text-xl font-semibold">Buscar Música</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="artistNameSearch" className="text-ibabepi-blue-darker font-medium">Artista/Banda</Label>
          <Input
            id="artistNameSearch"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            placeholder="Ex: Fernandinho"
            className="border-ibabepi-blue-light focus:ring-ibabepi-blue-medium focus:border-ibabepi-blue-medium"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="songNameSearch" className="text-ibabepi-blue-darker font-medium">Nome da Música</Label>
          <Input
            id="songNameSearch"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            placeholder="Ex: Grandes Coisas"
            className="border-ibabepi-blue-light focus:ring-ibabepi-blue-medium focus:border-ibabepi-blue-medium"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="songToneSearch" className="text-ibabepi-blue-darker font-medium">Tom (Opcional)</Label>
          <Input
            id="songToneSearch"
            value={songTone}
            onChange={(e) => setSongTone(e.target.value)}
            placeholder="Ex: G, Am"
            className="border-ibabepi-blue-light focus:ring-ibabepi-blue-medium focus:border-ibabepi-blue-medium"
          />
        </div>
      </div>
      <Button
        type="submit"
        className="w-full md:w-auto bg-gradient-to-r from-ibabepi-blue-medium to-ibabepi-blue-dark hover:from-ibabepi-blue-dark hover:to-ibabepi-blue-darker text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        <Search className="mr-2 h-5 w-5" /> Buscar Música
      </Button>
    </motion.form>
  );
};

export default RepertorioSearch;