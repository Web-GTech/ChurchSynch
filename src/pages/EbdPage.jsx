import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookHeart, MessageCircle, Search, Filter, ChevronDown, Maximize2, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const estudosExemplo = [
  {
    id: 1,
    titulo: "As Parábolas de Jesus: Ensinamentos para a Vida",
    data: "2025-05-19",
    professor: "Prof. Marcos Oliveira",
    resumo: "Uma análise profunda das principais parábolas contadas por Jesus e suas aplicações práticas para os dias atuais. Descubra os tesouros escondidos nessas narrativas.",
    conteudoCompleto: "As parábolas eram um método de ensino frequentemente utilizado por Jesus para transmitir verdades espirituais complexas de forma simples e memorável. Elas usavam elementos do cotidiano para ilustrar princípios do Reino de Deus. \n\nExemplos incluem a Parábola do Semeador (Mateus 13), que fala sobre diferentes tipos de solo representando diferentes respostas à Palavra de Deus, e a Parábola do Filho Pródigo (Lucas 15), que ilustra o amor incondicional e perdoador de Deus. \n\nEstudar as parábolas nos ajuda a entender melhor o caráter de Deus, a natureza do Seu Reino e como devemos viver como Seus seguidores. Elas nos desafiam a examinar nossos corações e a aplicar ativamente os ensinamentos de Cristo em nossas vidas.",
    curtidas: 15,
    curtidoPor: [],
    comentarios: [
      { id: 1, usuario: "Ana P.", texto: "Excelente estudo, muito edificante!", avatar: "https://avatar.vercel.sh/ana.png?size=40" },
      { id: 2, usuario: "Carlos S.", texto: "Gostei muito da abordagem sobre a parábola do semeador.", avatar: "https://avatar.vercel.sh/carlos.png?size=40" },
    ]
  },
  {
    id: 2,
    titulo: "Os Frutos do Espírito: Vivendo uma Vida Transformada",
    data: "2025-05-12",
    professor: "Profa. Lúcia Santos",
    resumo: "Estudo detalhado sobre cada um dos frutos do Espírito mencionados em Gálatas 5. Como cultivá-los e manifestá-los em nosso cotidiano.",
    conteudoCompleto: "Em Gálatas 5:22-23, Paulo lista os frutos do Espírito: amor, alegria, paz, paciência, amabilidade, bondade, fidelidade, mansidão e domínio próprio. Estes não são resultados de nossos próprios esforços, mas a obra do Espírito Santo em nós à medida que nos submetemos a Ele. \n\nCultivar esses frutos envolve permanecer em Cristo (João 15), permitir que a Palavra de Deus nos molde e buscar a plenitude do Espírito. Viver manifestando esses frutos é um testemunho poderoso do evangelho e nos aproxima da imagem de Cristo.",
    curtidas: 22,
    curtidoPor: [],
    comentarios: []
  },
];

const EstudoDetailModal = ({ isOpen, onOpenChange, estudo }) => {
  if (!estudo) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl bg-card text-card-foreground rounded-xl shadow-2xl">
        <DialogHeader className="border-b border-border/70 pb-4 pt-5 px-6">
          <DialogTitle className="text-xl font-bold text-primary leading-tight">{estudo.titulo}</DialogTitle>
          <DialogDescription className="text-muted-foreground pt-1 text-sm">
            Por: {estudo.professor} | Data: {new Date(estudo.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric'})}
          </DialogDescription>
        </DialogHeader>
        <div className="py-5 px-6 space-y-4 max-h-[65vh] overflow-y-auto prose prose-sm sm:prose-base max-w-none text-foreground/90">
          <p className="whitespace-pre-wrap leading-relaxed">{estudo.conteudoCompleto || estudo.resumo}</p>
        </div>
        <DialogFooter className="pt-5 pb-5 px-6 border-t border-border/70">
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground h-10 text-sm px-6 rounded-md">Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EbdPage = () => {
  const { user } = useAuth();
  const [estudos, setEstudos] = useState(() => {
    const storedEstudos = localStorage.getItem('churchFacilitiesEstudosEBD_v3');
    return storedEstudos ? JSON.parse(storedEstudos) : estudosExemplo.map(e => ({...e, curtidoPor: e.curtidoPor || [], comentarios: e.comentarios || []}));
  });
  const [novoComentario, setNovoComentario] = useState('');
  const [comentarioEstudoId, setComentarioEstudoId] = useState(null);
  const [selectedEstudo, setSelectedEstudo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('churchFacilitiesEstudosEBD_v3', JSON.stringify(estudos));
  }, [estudos]);

  const handleCurtir = (estudoId) => {
    if (!user) return;
    setEstudos(prevEstudos =>
      prevEstudos.map(e => {
        if (e.id === estudoId) {
          const jaCurtiu = e.curtidoPor.includes(user.id);
          return {
            ...e,
            curtidas: jaCurtiu ? e.curtidas - 1 : e.curtidas + 1,
            curtidoPor: jaCurtiu ? e.curtidoPor.filter(id => id !== user.id) : [...e.curtidoPor, user.id],
          };
        }
        return e;
      })
    );
  };

  const handleAbrirComentario = (estudoId) => {
    setComentarioEstudoId(estudoId === comentarioEstudoId ? null : estudoId); 
    setNovoComentario('');
  };

  const handleEnviarComentario = (estudoId) => {
    if (!novoComentario.trim() || !user) return;
    const comentario = {
      id: Date.now(),
      usuario: user.nome || "Usuário",
      texto: novoComentario,
      avatar: user.avatarUrl || `https://avatar.vercel.sh/${user.email || user.nome}.png?size=40`
    };
    setEstudos(estudos.map(e => e.id === estudoId ? { ...e, comentarios: [...(e.comentarios || []), comentario] } : e));
    setNovoComentario('');
  };

  const handleOpenEstudoDetails = (estudo) => {
    setSelectedEstudo(estudo);
    setIsModalOpen(true);
  };

  const filteredEstudos = estudos.filter(estudo => 
    estudo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudo.resumo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudo.professor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      className="page-container full-height-page bg-slate-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-4xl mx-auto shadow-lg bg-card rounded-xl overflow-hidden flex-grow flex flex-col my-3 md:my-4 border border-border/50">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-center py-5 sm:py-6">
          <BookHeart size={36} className="text-primary-foreground mx-auto mb-2.5" />
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary-foreground">Escola Bíblica Dominical</CardTitle>
          <CardDescription className="text-primary-foreground/80 mt-1 text-sm sm:text-base">Aprofunde seu conhecimento nas Escrituras.</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-5 space-y-4 sm:space-y-5 flex-grow flex flex-col overflow-y-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Input 
                type="text" 
                placeholder="Pesquisar estudos..." 
                className="pl-10 h-10 text-sm border-border focus:ring-primary focus:border-primary text-foreground bg-input" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted/50 h-10 text-sm px-4">
              <Filter size={16} className="mr-2" /> Filtrar <ChevronDown size={16} className="ml-1.5" />
            </Button>
          </div>

          <div className="space-y-4 sm:space-y-5 flex-grow overflow-y-auto pr-1.5 custom-scrollbar">
            {filteredEstudos.length > 0 ? filteredEstudos.map((estudo, index) => {
              const jaCurtiu = user && estudo.curtidoPor.includes(user.id);
              return (
                <motion.div
                  key={estudo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-card shadow-md border border-border/70 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200 ease-in-out flex flex-col aspect-[16/6] sm:aspect-[16/5]">
                    <CardHeader className="pb-2 pt-3.5 px-4 cursor-pointer flex-shrink-0" onClick={() => handleOpenEstudoDetails(estudo)}>
                      <CardTitle className="text-base sm:text-lg font-semibold text-foreground truncate leading-tight">{estudo.titulo}</CardTitle>
                      <CardDescription className="text-xs text-muted-foreground pt-0.5 truncate">
                        {new Date(estudo.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })} - Por: {estudo.professor}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 pb-2.5 cursor-pointer flex-grow overflow-hidden" onClick={() => handleOpenEstudoDetails(estudo)}>
                      <p className="text-sm text-muted-foreground leading-normal line-clamp-2 sm:line-clamp-3">{estudo.resumo}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center bg-muted/30 py-2.5 px-4 border-t border-border/50 flex-shrink-0">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleCurtir(estudo.id)} className={`p-1.5 h-auto rounded-md ${jaCurtiu ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-primary'}`}>
                          <Heart size={16} className="mr-1" fill={jaCurtiu ? 'currentColor' : 'none'} /> 
                          <span className="text-xs">{estudo.curtidas}</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleAbrirComentario(estudo.id)} className="text-muted-foreground hover:text-primary p-1.5 h-auto rounded-md">
                          <MessageCircle size={16} className="mr-1" /> 
                          <span className="text-xs">{estudo.comentarios?.length || 0}</span>
                        </Button>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleOpenEstudoDetails(estudo)} className="border-border text-foreground hover:bg-muted/50 text-xs px-3 py-1.5 h-auto rounded-md">
                        <Maximize2 size={14} className="mr-1.5" /> Detalhes
                      </Button>
                    </CardFooter>
                    {comentarioEstudoId === estudo.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 border-t border-border/50 bg-card space-y-2"
                      >
                        <h4 className="text-sm font-semibold text-foreground">Deixe seu comentário:</h4>
                        <Textarea 
                          value={novoComentario}
                          onChange={(e) => setNovoComentario(e.target.value)}
                          placeholder="Escreva algo construtivo..."
                          className="min-h-[50px] text-sm border-border bg-input focus:ring-primary focus:border-primary text-foreground"
                        />
                        <div className="text-right">
                          <Button size="sm" onClick={() => handleEnviarComentario(estudo.id)} className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 px-3">Enviar Comentário</Button>
                        </div>
                         {estudo.comentarios?.length > 0 && (
                          <div className="pt-2 space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                            <h4 className="text-sm font-semibold text-foreground">Comentários:</h4>
                            {estudo.comentarios.map(com => (
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
                          </div>
                        )}
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              )
            }) : (
              <div className="text-center py-12 text-muted-foreground flex-grow flex flex-col justify-center items-center">
                <Search size={40} className="mx-auto mb-3" />
                <p className="text-lg">Nenhum estudo encontrado.</p>
                {searchTerm && <p className="text-sm">Tente um termo de busca diferente.</p>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <EstudoDetailModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} estudo={selectedEstudo} />
    </motion.div>
  );
};

export default EbdPage;