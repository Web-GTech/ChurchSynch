import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, UserCircle, Bell, Palette, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  const { user } = useAuth();

  const settingsOptions = [
    { title: "Perfil", description: "Atualize suas informações pessoais.", icon: UserCircle, link: "/perfil" },
    { title: "Notificações", description: "Gerencie suas preferências de notificação.", icon: Bell, link: "#" },
    { title: "Aparência", description: "Personalize a aparência do aplicativo.", icon: Palette, link: "#" },
    { title: "Segurança", description: "Altere sua senha e configurações de segurança.", icon: Shield, link: "#" },
  ];

  if (!user) return null;

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full shadow-xl bg-card rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-center py-8">
          <SettingsIcon size={48} className="text-primary-foreground mx-auto mb-3" />
          <CardTitle className="text-3xl font-bold text-primary-foreground">Configurações</CardTitle>
          <CardDescription className="text-primary-foreground/80 mt-1">Gerencie suas preferências e conta.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {settingsOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={option.link} className="block">
                <Card className="hover:shadow-lg transition-shadow duration-200 hover:border-primary/50 cursor-pointer">
                  <CardContent className="p-4 flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <option.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-md text-foreground">{option.title}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SettingsPage;