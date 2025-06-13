import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Music, ListMusic, Youtube, CheckCircle, ExternalLink, AlertTriangle, BookOpenText, Save, UploadCloud } from 'lucide-react';
import { motion }from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const RepertorioResults = ({ results, onSaveToChurchRepertory, onAddToLiturgy, savedSongs, isAdmin, canEditLiturgy }) => {
  const { toast } = useToast();

  if (!results) return null;

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const openExternalLink = (url, serviceName) => {
    if (url && isValidUrl(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        variant: "destructive",
        title: "URL Inválida",
        description: `Não foi possível abrir o link para ${serviceName}. A URL pode estar incorreta ou indisponível.`,
      });
    }
  };

  const isAlreadySaved = savedSongs.some(s => s.song === results.song && s.artist === results.artist);

  const ActionButton = ({ onClick, icon: Icon, iconColor, text, serviceName, isExternal = false, url, disabled = false, customDisabledMessage }) => {
    const isDisabled = disabled || (url !== "internal_action" && (!url || !isValidUrl(url)));
    const title = isDisabled ? (customDisabledMessage || `Link para ${serviceName} indisponível ou inválido`) : `Acessar ${serviceName}`;
    
    return (
      <Button 
        variant="outline" 
        onClick={onClick} 
        disabled={isDisabled}
        title={title}
        className="w-full justify-start text-left hover:bg-indigo-50 border-indigo-200 text-indigo-600 py-2 h-10 rounded-md text-xs disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:border-slate-200 disabled:text-slate-400"
      >
        {isDisabled && url !== "internal_action" ? <AlertTriangle className={`mr-2 h-3.5 w-3.5 ${iconColor || 'text-slate-400'}`} /> : <Icon className={`mr-2 h-3.5 w-3.5 ${iconColor || ''}`} />} 
        {text}
        {isExternal && !isDisabled && <ExternalLink className="ml-auto h-3 w-3 opacity-60"/>}
      </Button>
    );
  };


  return (
    <motion.div
      initial={{ opacity: 0, height: 0, marginTop: 0 }}
      animate={{ opacity: 1, height: 'auto', marginTop: '0.75rem' }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 shadow-md border-blue-100 rounded-lg aspect-[16/5] sm:aspect-[16/4] lg:aspect-[16/3.5] flex flex-col">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-base sm:text-md text-indigo-700 truncate">{results.song}</CardTitle>
          <CardDescription className="text-slate-500 text-xs truncate">Artista: {results.artist} {results.tone && `(Tom: ${results.tone})`}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1.5 pb-3 px-3 flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <ActionButton
              onClick={() => openExternalLink(results.vagalume, "Letra (Vagalume)")}
              icon={ListMusic}
              iconColor="text-orange-500"
              text="Letra (Vagalume)"
              serviceName="Vagalume"
              url={results.vagalume}
              isExternal={true}
            />
            <ActionButton
              onClick={() => openExternalLink(results.cifraclubPrint || results.cifraclub, "Cifra (CifraClub)")}
              icon={Music}
              iconColor="text-green-500"
              text="Cifra (CifraClub)"
              serviceName="CifraClub"
              url={results.cifraclubPrint || results.cifraclub}
              isExternal={true}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <ActionButton
              onClick={() => openExternalLink(results.deezer, "Deezer")}
              icon={() => <svg className="mr-2 h-3.5 w-3.5 text-purple-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-2.08 13.498L6.502 12l3.418-3.498v6.996zm4.16 0L10.502 12l3.578-3.498v6.996z"/></svg>}
              text="Ouvir no Deezer"
              serviceName="Deezer"
              isExternal={true}
              url={results.deezer}
            />
            <ActionButton
              onClick={() => openExternalLink(results.youtube, "YouTube")}
              icon={Youtube}
              iconColor="text-red-500"
              text="Ver no YouTube"
              serviceName="YouTube"
              isExternal={true}
              url={results.youtube}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
            <ActionButton
              onClick={() => onAddToLiturgy(results)}
              icon={UploadCloud}
              iconColor="text-teal-500"
              text="[📤 Enviar para Liturgia]"
              serviceName="Liturgia"
              url="internal_action" 
              disabled={!canEditLiturgy}
              customDisabledMessage="Sem permissão."
            />
            <ActionButton
              onClick={() => onSaveToChurchRepertory(results)}
              icon={isAlreadySaved ? CheckCircle : Save}
              iconColor={isAlreadySaved ? "text-green-600" : "text-blue-500"}
              text={isAlreadySaved ? "Salvo" : "[+ Salvar ao Repertório]"}
              serviceName="Repertório da Igreja"
              url="internal_action" 
              disabled={!isAdmin || isAlreadySaved}
              customDisabledMessage={!isAdmin ? "Apenas admins." : (isAlreadySaved ? "Já salvo." : undefined)}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RepertorioResults;