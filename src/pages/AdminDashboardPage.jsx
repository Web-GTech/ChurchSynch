import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Bell, BookOpen, CalendarRange, Megaphone, Music2, Palette, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Painel Principal', icon: LayoutDashboard, path: '/admin/dashboard', color: 'text-sky-600', area: 'Geral' },
    { name: 'Gerenciar Usuários', icon: Users, path: '/admin/manage-users', color: 'text-purple-600', area: 'Gestão' },
    { name: 'Gerenciar Conteúdo', icon: FileText, path: '/admin/manage-content', color: 'text-green-600', area: 'Gestão' },
    { name: 'EBD', icon: BookOpen, path: '/admin/manage-content?tab=ebd', color: 'text-orange-500', area: 'Conteúdo' },
    { name: 'Liturgia', icon: CalendarRange, path: '/admin/manage-content?tab=liturgia', color: 'text-red-500', area: 'Conteúdo' },
    { name: 'Escalas', icon: ClipboardList, path: '/admin/manage-content?tab=escalas', color: 'text-indigo-500', area: 'Conteúdo' },
    { name: 'Avisos', icon: Megaphone, path: '/admin/manage-content?tab=avisos', color: 'text-yellow-500', area: 'Comunicação' },
    { name: 'Repertório', icon: Music2, path: '/admin/manage-content?tab=repertorio', color: 'text-teal-500', area: 'Recursos' }, 
    { name: 'Notificações', icon: Bell, path: '/admin/manage-content?tab=notificacoes', color: 'text-rose-500', area: 'Comunicação'},
    { name: 'Aparência', icon: Palette, path: '/admin/app-settings?tab=appearance', color: 'text-pink-500', area: 'Sistema' },
    { name: 'Configurações', icon: Settings, path: '/admin/app-settings', color: 'text-slate-500', area: 'Sistema' },
  ];

  const handleNavigation = (path) => {
    if (path.includes('?tab=')) {
      const [basePath, tabQuery] = path.split('?');
      const tab = tabQuery.split('=')[1];
      navigate(basePath, { state: { defaultTab: tab } });
    } else {
      navigate(path);
    }
  };

  return (
    <motion.div
      className="page-container full-height-page bg-slate-100"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="w-full max-w-2xl mx-auto p-3 sm:p-5">
        <Card className="shadow-xl bg-card rounded-2xl overflow-hidden border border-border/60">
          <CardHeader className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground p-5 sm:p-7">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold">Painel Administrativo</CardTitle>
                <CardDescription className="text-primary-foreground/80 mt-1 text-xs sm:text-sm">
                  Bem-vindo, {user?.nome || 'Admin'}. Gerencie o app Church Facilities.
                </CardDescription>
              </div>
              <Button variant="ghost" onClick={logout} className="text-primary-foreground hover:bg-primary-foreground/10 h-9 px-3 text-sm">
                <LogOut size={16} className="mr-1.5" /> Sair
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-2.5">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
                >
                  <Card 
                    className="bg-card hover:bg-slate-50/80 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md rounded-lg border border-border/70 cursor-pointer"
                    onClick={() => handleNavigation(item.path)}
                  >
                    <div className="flex items-center p-3 sm:p-3.5">
                      <div className={`p-2 mr-3 sm:mr-3.5 rounded-md bg-gradient-to-br ${item.color.replace('text-', 'from-')}/10 ${item.color.replace('text-', 'to-')}/5`}>
                        <item.icon size={22} className={`${item.color}`} strokeWidth={1.75} />
                      </div>
                      <div className="flex-grow">
                        <CardTitle className="text-sm sm:text-[0.9rem] font-medium text-foreground leading-tight">{item.name}</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground mt-0.5">{item.area}</CardDescription>
                      </div>
                      <Button variant="link" className={`text-xs h-auto p-0 ${item.color}/90 hover:${item.color} font-medium ml-2`}>Ver</Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;