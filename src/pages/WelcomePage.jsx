import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle, Sparkles, ArrowRight, ArrowLeft, BookOpenText, Music, CalendarDays, BookMarked, MessageSquare, BookHeart } from 'lucide-react';

const featuresSlides = [
  { 
    icon: BookOpenText, 
    title: "Liturgia Interativa", 
    description: "Acompanhe o culto em tempo real, com progresso e detalhes dos momentos. Saiba o que está acontecendo e participe ativamente!" 
  },
  { 
    icon: Music, 
    title: "Repertório Musical Completo", 
    description: "Busque letras, cifras e ouça as músicas da sua igreja. Tenha acesso fácil ao cancioneiro para louvar onde estiver." 
  },
  { 
    icon: CalendarDays, 
    title: "Escalas de Serviço", 
    description: "Veja quem está escalado para os ministérios e quando você serve. Organize sua participação e compromissos." 
  },
  { 
    icon: BookMarked, 
    title: "Bíblia Sagrada Integrada", 
    description: "Leia e estude a Palavra de Deus diretamente no app, com diversas traduções e ferramentas de busca." 
  },
  { 
    icon: MessageSquare, 
    title: "Mural de Avisos Dinâmico", 
    description: "Fique por dentro de todas as novidades, eventos e comunicados importantes da sua comunidade de fé." 
  },
  { 
    icon: BookHeart, 
    title: "Escola Bíblica", 
    description: "Acesse materiais de estudo, acompanhe as lições e participe das discussões da Escola Bíblica Dominical." 
  },
];

const FeaturesCarouselDialog = ({ isOpen, onOpenChange }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < featuresSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onOpenChange(false);
      navigate('/login');
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = featuresSlides[currentSlide];
  const IconComponent = slide.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground rounded-xl shadow-2xl p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <DialogHeader className="text-center mb-4">
              <div className="mx-auto p-3 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                <IconComponent className="h-8 w-8 text-slate-900" /> {/* Ícone preto */}
              </div>
              <DialogTitle className="text-2xl font-bold text-slate-900 font-sans">{slide.title}</DialogTitle> {/* Fonte ajustada */}
            </DialogHeader>
            <DialogDescription className="text-slate-700 text-center min-h-[60px] text-sm"> {/* Fonte ajustada */}
              {slide.description}
            </DialogDescription>
          </motion.div>
        </AnimatePresence>
        <DialogFooter className="p-6 pt-2 border-t border-border flex flex-col sm:flex-row sm:justify-between items-center">
          <div className="flex mb-3 sm:mb-0">
            {featuresSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full mx-1 transition-colors ${currentSlide === index ? 'bg-slate-900' : 'bg-slate-300 hover:bg-slate-500'}`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {currentSlide > 0 && (
              <Button variant="outline" onClick={handlePrev} className="flex-1 sm:flex-none border-slate-700 text-slate-700 hover:bg-slate-100">
                <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2 text-slate-900" /> Anterior {/* Ícone preto */}
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-white"> {/* Botão principal escuro */}
              {currentSlide === featuresSlides.length - 1 ? "E aí, vamos começar?" : "Próximo"}
              {currentSlide < featuresSlides.length - 1 && <ArrowRight className="h-4 w-4 ml-1 sm:ml-2 text-white" />}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const WelcomePage = () => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 p-4 text-center text-slate-900 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <Logo className="h-24 w-auto sm:h-32" primaryColor="black" secondaryColor="rgba(0,0,0,0.7)" text="Church Facilities" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.3, type: "spring", stiffness: 120 }}
        className="text-3xl sm:text-4xl font-bold mb-4 font-sans tracking-tight text-slate-800" /* Fonte ajustada */
      >
        Bem-vindo ao App da Sua Igreja!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto mb-10" /* Fonte ajustada */
      >
        Conecte-se, participe e cresça com sua comunidade de fé. Tudo o que você precisa, na palma da sua mão.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row items-center justify-center"
      >
        <Button
          size="lg"
          onClick={() => setIsAlertOpen(true)}
          className="bg-slate-900 text-white hover:bg-slate-800 shadow-xl transform hover:scale-105 transition-transform w-full sm:w-auto text-base px-8 py-3 rounded-xl font-medium"
        >
          <Sparkles className="mr-2 h-5 w-5 text-white" /> Descubra o App {/* Ícone preto/escuro */}
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-slate-900 text-slate-900 hover:bg-slate-900/10 shadow-xl transform hover:scale-105 transition-transform w-full sm:w-auto text-base px-8 py-3 rounded-xl font-medium"
        >
          <Link to="/login">
            Entrar ou Cadastrar <ArrowRight className="ml-2 h-5 w-5 text-slate-900" /> {/* Ícone preto/escuro */}
          </Link>
        </Button>
      </motion.div>

      <FeaturesCarouselDialog isOpen={isAlertOpen} onOpenChange={setIsAlertOpen} />
      
      <motion.div 
        className="absolute bottom-0 left-0 right-0 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} Church Facilities. Todos os direitos reservados.</p>
      </motion.div>
    </div>
  );
};

export default WelcomePage;