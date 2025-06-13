import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BookOpenText, Users, Music, MessageSquare, CalendarDays, BookMarked, HeartHandshake as Handshake, ArrowRight, BookHeart } from 'lucide-react';
// Logo component is not used here to avoid showing "Church Facilities" text by default
import { useAuth } from '@/contexts/AuthContext';

const FeatureCard = ({ icon: Icon, title, description, linkTo, delay, bgColorClass = "bg-primary/10", iconColorClass = "text-primary" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="h-full"
  >
    <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 border-border/70 bg-card overflow-hidden rounded-xl flex flex-col">
      <CardHeader className="pb-3">
        <div className={`p-3 rounded-lg inline-block mb-3 ${bgColorClass}`}>
          <Icon className={`h-7 w-7 ${iconColorClass}`} />
        </div>
        <CardTitle className="text-xl font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-grow pt-0">
        <div>
          <CardDescription className="text-muted-foreground mb-4 text-sm leading-relaxed">{description}</CardDescription>
        </div>
        <Button asChild variant="ghost" className="mt-auto w-full justify-start text-primary hover:bg-primary/5 hover:text-primary/90 p-2">
          <Link to={linkTo}>
            Acessar <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

const HomePage = ({ setIsModalOpen }) => {
  const { user, isProfileComplete } = useAuth();
  const appName = "Aplicativo da Igreja"; 
  const welcomeMessage = user ? `Bem-vindo(a) de volta, ${user.nome}!` : `Bem-vindo(a) ao ${appName}!`;
  const subMessage = user ? "Explore os recursos disponíveis para você." : "Conecte-se com nossa comunidade e participe.";
  const churchLogoUrl = "https://i.ibb.co/cK48t2C/facilities.png";

  useEffect(() => {
    if (user && !isProfileComplete()) {
      if (setIsModalOpen) setIsModalOpen(true);
    }
  }, [user, isProfileComplete, setIsModalOpen]);

  return (
    <div className="page-container full-height-page space-y-6 sm:space-y-8 pb-4 overflow-y-auto">
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-6 sm:py-8 px-4 bg-gradient-to-br from-primary via-blue-600 to-indigo-700 rounded-xl shadow-2xl"
      >
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 150 }}
          className="mx-auto mb-3 sm:mb-4 w-16 h-16 sm:w-20 sm:h-20 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg overflow-hidden ring-2 ring-white/50"
        >
          <img-replace 
            src={churchLogoUrl} 
            alt="Logo da Igreja" 
            className="object-contain w-full h-full p-1" 
          />
        </motion.div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight font-logo">{welcomeMessage}</h1>
        <p className="mt-1.5 sm:mt-2 text-sm sm:text-lg text-blue-100 max-w-2xl mx-auto">{subMessage}</p>
        {!user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 sm:mt-6"
          >
            <Button asChild size="lg" className="bg-white text-primary hover:bg-slate-100 shadow-lg transform hover:scale-105 transition-transform text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-2.5">
              <Link to="/login">
                <Handshake className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Fazer Login ou Cadastrar
              </Link>
            </Button>
          </motion.div>
        )}
      </motion.section>

      <section className="flex-grow px-1 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6 text-center sm:text-left">Nossos Recursos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <FeatureCard icon={BookOpenText} title="Liturgia Semanal" description="Acompanhe a ordem do culto e participe ativamente." linkTo="/liturgia" delay={0.1} bgColorClass="bg-blue-500/10" iconColorClass="text-blue-600" />
          <FeatureCard icon={Users} title="Escalas de Serviço" description="Confira as escalas dos ministérios e sua participação." linkTo="/escala" delay={0.2} bgColorClass="bg-green-500/10" iconColorClass="text-green-600" />
          <FeatureCard icon={Music} title="Repertório Musical" description="Acesse cifras e letras das músicas do nosso repertório." linkTo="/repertorio" delay={0.3} bgColorClass="bg-orange-500/10" iconColorClass="text-orange-600" />
          <FeatureCard icon={MessageSquare} title="Mural de Avisos" description="Fique por dentro dos últimos avisos e comunicados." linkTo="/mural-avisos" delay={0.4} bgColorClass="bg-sky-500/10" iconColorClass="text-sky-600" />
          <FeatureCard icon={BookMarked} title="Bíblia Sagrada" description="Leia e estude a Palavra de Deus online." linkTo="/biblia" delay={0.5} bgColorClass="bg-purple-500/10" iconColorClass="text-purple-600" />
          <FeatureCard icon={BookHeart} title="Escola Bíblica" description="Materiais e estudos da nossa Escola Bíblica Dominical." linkTo="/ebd" delay={0.6} bgColorClass="bg-red-500/10" iconColorClass="text-red-600" />
        </div>
      </section>
    </div>
  );
};

export default HomePage;