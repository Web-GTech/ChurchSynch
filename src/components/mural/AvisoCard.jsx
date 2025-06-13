import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, ThumbsUp, MessageCircle, Send, Eye, Heart, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AvisoCard = ({ aviso, onCurtir, onComentar, onOpenDetails, user, onMarkAsRead }) => {
  const [showComentarios, setShowComentarios] = useState(false);
  const [novoComentario, setNovoComentario] = useState('');
  const jaCurtiu = user && aviso.curtidoPor?.includes(user.id);

  const handleEnviarComentario = () => {
    if (novoComentario.trim()) {
      onComentar(aviso.id, novoComentario);
      setNovoComentario('');
    }
  };

  const handleOpenDetailsClick = () => {
    onMarkAsRead(aviso.id);
    onOpenDetails(aviso);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex"
    >
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl border-border/70 bg-card flex flex-col w-full aspect-[16/7] sm:aspect-[16/6] md:aspect-[16/5]">
        {aviso.imagem && (
          <div className="h-1/3 sm:h-2/5 w-full overflow-hidden cursor-pointer flex-shrink-0 group" onClick={handleOpenDetailsClick}>
            <img-replace src={aviso.imagem} alt={aviso.titulo} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          </div>
        )}
        <CardHeader className="pt-3 pb-1.5 px-4 cursor-pointer flex-shrink-0" onClick={handleOpenDetailsClick}>
          <div className="flex justify-between items-start mb-1">
            <CardTitle className="text-base font-semibold text-foreground truncate leading-tight">{aviso.titulo}</CardTitle>
            {aviso.tipo === 'importante' && (
              <Badge variant="destructive" className="bg-destructive text-destructive-foreground text-xs whitespace-nowrap px-2 py-0.5 ml-2 self-start">
                <AlertTriangle size={12} className="mr-1" /> Importante
              </Badge>
            )}
            {aviso.tipo === 'destaque' && (
              <Badge variant="default" className="bg-primary text-primary-foreground text-xs whitespace-nowrap px-2 py-0.5 ml-2 self-start">
                 Destaque
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs text-muted-foreground flex items-center truncate">
            <CalendarDays size={12} className="mr-1.5" />
            {new Date(aviso.data + 'T00:00:00').toLocaleDateString('pt-BR', {day:'2-digit', month:'short', year: 'numeric'})} | {aviso.categoria}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-1 pb-2 px-4 flex-grow cursor-pointer overflow-hidden" onClick={handleOpenDetailsClick}>
          <p className="text-sm text-muted-foreground leading-normal line-clamp-2 sm:line-clamp-3">{aviso.conteudo}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 pt-2 pb-3 px-4 border-t border-border/50 flex-shrink-0">
          <div className="flex justify-between w-full items-center">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => onCurtir(aviso.id)} className={`p-1.5 h-auto rounded-md ${jaCurtiu ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-primary'}`}>
                <Heart size={16} className="mr-1" fill={jaCurtiu ? 'currentColor' : 'none'} /> 
                <span className="text-xs">{aviso.curtidas}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowComentarios(!showComentarios)} className="text-muted-foreground hover:text-primary p-1.5 h-auto rounded-md">
                <MessageCircle size={16} className="mr-1" /> 
                <span className="text-xs">{aviso.comentarios?.length || 0}</span>
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={handleOpenDetailsClick} className="text-primary hover:text-primary/80 p-1.5 h-auto rounded-md">
              <Eye size={16} className="mr-1" /> <span className="text-xs">Ver Mais</span>
            </Button>
          </div>
          {showComentarios && (
            <div className="w-full mt-2 space-y-2">
              {aviso.comentarios?.map(com => (
                <div key={com.id} className="flex items-start space-x-2 text-xs">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={com.avatar} alt={com.usuario} />
                    <AvatarFallback className="text-xs">{com.usuario.substring(0,1)}</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted/50 p-2 rounded-md flex-1">
                    <span className="font-semibold text-foreground">{com.usuario}: </span>
                    <span className="text-muted-foreground">{com.texto}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-2">
                <Input 
                  type="text" 
                  placeholder="Adicionar um comentário..." 
                  className="h-8 text-xs flex-grow bg-input border-border focus:ring-primary focus:border-primary" 
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEnviarComentario()}
                />
                <Button size="icon" className="h-8 w-8 bg-primary hover:bg-primary/90 flex-shrink-0" onClick={handleEnviarComentario} disabled={!novoComentario.trim()}>
                  <Send size={14} />
                </Button>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AvisoCard;