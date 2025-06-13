import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Info, PlusCircle, Filter, ChevronDown, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import AvisoCard from '@/components/mural/AvisoCard';
import AvisoDetailModal from '@/components/mural/AvisoDetailModal';

const initialAvisos = [
  {
    id: 1,
    titulo: "Reunião de Obreiros - Próxima Semana",
    data: "2025-05-28",
    categoria: "Liderança",
    tipo: "importante",
    conteudo: "Lembramos a todos os obreiros sobre nossa reunião mensal na próxima quarta-feira, às 19h30, no salão anexo. Sua presença é fundamental! Discutiremos o planejamento para o próximo trimestre e as novas diretrizes para os ministérios. Traga suas sugestões.",
    imagem: "https://images.unsplash.com/photo-1519709310016-15c7d76a8799?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNodXJjaCUyMG1lZXRpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
    curtidas: 12,
    curtidoPor: [],
    comentarios: [
      { id: 1, usuario: "Carlos M.", texto: "Estarei lá!", avatar: "https://avatar.vercel.sh/carlos.png?size=40" },
    ],
    visualizado: false,
  },
  {
    id: 2,
    titulo: "Campanha do Agasalho 2025",
    data: "2025-05-25",
    categoria: "Ação Social",
    tipo: "normal",
    conteudo: "Nossa campanha do agasalho já começou! Traga suas doações de roupas de frio em bom estado e ajude a aquecer quem precisa. Ponto de coleta na entrada da igreja. Aceitamos cobertores também.",
    imagem: "https://images.unsplash.com/photo-1618803300260-97041538659f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdGhlcyUyMGRvbmF0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
    curtidas: 25,
    curtidoPor: [],
    comentarios: [
      { id: 2, usuario: "Ana S.", texto: "Já separei minhas doações!", avatar: "https://avatar.vercel.sh/ana.png?size=40" },
      { id: 3, usuario: "Pedro L.", texto: "Ótima iniciativa!", avatar: "https://avatar.vercel.sh/pedro.png?size=40" },
    ],
    visualizado: false,
  },
];

const MuralAvisosPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [avisos, setAvisos] = useState(() => {
    const storedAvisos = localStorage.getItem('churchFacilitiesAvisos_v3');
    return storedAvisos ? JSON.parse(storedAvisos) : initialAvisos.map(a => ({...a, curtidoPor: a.curtidoPor || [], comentarios: a.comentarios || [], visualizado: a.visualizado || false}));
  });
  const [selectedAviso, setSelectedAviso] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('churchFacilitiesAvisos_v3', JSON.stringify(avisos));
  }, [avisos]);

  const handleCurtir = (avisoId) => {
    if (!user) return;
    setAvisos(prevAvisos =>
      prevAvisos.map(a => {
        if (a.id === avisoId) {
          const jaCurtiu = a.curtidoPor?.includes(user.id);
          return {
            ...a,
            curtidas: jaCurtiu ? a.curtidas - 1 : a.curtidas + 1,
            curtidoPor: jaCurtiu ? a.curtidoPor.filter(id => id !== user.id) : [...(a.curtidoPor || []), user.id],
          };
        }
        return a;
      })
    );
  };

  const handleComentar = (avisoId, textoComentario) => {
    const novoComentario = {
      id: Date.now(),
      usuario: user?.nome || "Usuário Anônimo",
      texto: textoComentario,
      avatar: user?.avatarUrl || `https://avatar.vercel.sh/${user?.email || user?.nome || 'anon'}.png?size=40`
    };
    setAvisos(prevAvisos => prevAvisos.map(a => 
        a.id === avisoId ? { ...a, comentarios: [...(a.comentarios || []), novoComentario] } : a
      )
    );
  };

  const handleMarkAsRead = (avisoId) => {
    setAvisos(prevAvisos =>
      prevAvisos.map(a => (a.id === avisoId ? { ...a, visualizado: true } : a))
    );
  };

  const handleOpenDetails = (aviso) => {
    handleMarkAsRead(aviso.id);
    setSelectedAviso(aviso);
    setIsModalOpen(true);
  };

  const filteredAvisos = avisos.filter(aviso => 
    aviso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aviso.conteudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aviso.categoria.toLowerCase().includes(searchTerm.toLowerCase())
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
          <Megaphone size={36} className="text-primary-foreground mx-auto mb-2.5" />
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary-foreground">Mural de Avisos</CardTitle>
          <CardDescription className="text-primary-foreground/80 mt-1 text-sm sm:text-base">Fique por dentro das novidades.</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-5 flex-grow flex flex-col overflow-y-auto">
          <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-5">
            <div className="relative flex-grow">
              <Input 
                type="text" 
                placeholder="Pesquisar avisos..." 
                className="pl-10 h-10 text-sm border-border focus:ring-primary focus:border-primary text-foreground bg-input" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted/50 h-10 text-sm px-4">
              <Filter size={16} className="mr-2" /> Filtrar <ChevronDown size={16} className="ml-1.5" />
            </Button>
             {isAdmin && (
              <Button variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 text-sm px-4">
                <PlusCircle size={16} className="mr-2" /> Novo Aviso
              </Button>
            )}
          </div>
          
          {filteredAvisos.length === 0 && (
            <div className="text-center py-12 flex-grow flex flex-col justify-center items-center text-muted-foreground">
              <Info size={40} className="mx-auto mb-3" />
              <p className="text-lg">Nenhum aviso encontrado.</p>
              {searchTerm && <p className="text-sm">Tente um termo de busca diferente.</p>}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredAvisos.map((aviso) => (
              <AvisoCard 
                key={aviso.id} 
                aviso={aviso} 
                onCurtir={handleCurtir} 
                onComentar={handleComentar}
                onOpenDetails={handleOpenDetails}
                onMarkAsRead={handleMarkAsRead}
                user={user}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      <AvisoDetailModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} aviso={selectedAviso} />
    </motion.div>
  );
};

export default MuralAvisosPage;