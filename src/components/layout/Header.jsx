import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, CalendarDays, Music, BookOpen, UserCircle, Settings, LogOut, Bell, Sun, Moon, MessageSquare, CheckSquare, ListMusic, Edit3, Users2, Settings2, BarChart3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(currentTheme);
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no Logout",
        description: "Não foi possível fazer logout. Tente novamente.",
      });
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  };
  
  const userName = profile?.nome || user?.email?.split('@')[0] || 'Usuário';
  const userEmail = user?.email || 'Não disponível';
  const userAvatarUrl = profile?.avatar_url;

  const navLinks = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: CalendarDays, label: 'Escalas', path: '/escala' },
    { icon: Music, label: 'Repertório', path: '/repertorio' },
    { icon: BookOpen, label: 'EBD', path: '/ebd' },
    { icon: MessageSquare, label: 'Avisos', path: '/mural-avisos' },
    { icon: CheckSquare, label: 'Liturgia', path: '/liturgia' },
  ];

  const adminLinks = [
    { icon: BarChart3, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Edit3, label: 'Gerenciar Conteúdo', path: '/admin/manage-content' },
    { icon: Users2, label: 'Gerenciar Usuários', path: '/admin/manage-users' },
    { icon: Settings2, label: 'Configurações App', path: '/admin/app-settings' },
  ];

  const NavLinkItem = ({ path, label, icon: Icon, onClick }) => (
    <Link
      to={path}
      onClick={onClick}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                  ${location.pathname === path 
                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground' 
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted dark:text-foreground/60 dark:hover:text-foreground/90 dark:hover:bg-muted/50'
                  }`}
    >
      <Icon className="mr-2 h-5 w-5" />
      {label}
    </Link>
  );

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-card/95 backdrop-blur-sm shadow-md' : 'bg-card/80'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Logo width="36" />
            {/* Nome "ChurchFacilities" removido daqui */}
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <NavLinkItem key={link.path} {...link} />
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Mudar tema">
              {currentTheme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={() => navigate('/notifications')} aria-label="Notificações">
              <Bell className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-9 w-9 border-2 border-primary/50">
                    <AvatarImage src={userAvatarUrl || `https://avatar.vercel.sh/${user?.id}.png`} alt={userName} />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/perfil" className="flex items-center">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Meu Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {profile?.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Administração</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      {adminLinks.map(link => (
                        <DropdownMenuItem key={link.path} asChild>
                          <Link to={link.path} className="flex items-center">
                            <link.icon className="mr-2 h-4 w-4" />
                            <span>{link.label}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-500 hover:!bg-red-500/10 focus:!bg-red-500/10 focus:!text-red-700 dark:focus:!text-red-400 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Botão de menu hambúrguer removido */}
            {/* 
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Abrir menu">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div> 
            */}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Removido pois o botão de toggle foi removido */}
      {/* 
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-card border-t border-border overflow-hidden"
          >
            <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map(link => (
                <NavLinkItem key={link.path} {...link} onClick={() => setIsMobileMenuOpen(false)} />
              ))}
              {profile?.role === 'admin' && (
                <>
                  <div className="pt-2 pb-1">
                    <p className="px-3 text-xs font-semibold uppercase text-muted-foreground tracking-wider">Admin</p>
                  </div>
                  {adminLinks.map(link => (
                    <NavLinkItem key={link.path} {...link} onClick={() => setIsMobileMenuOpen(false)} />
                  ))}
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence> 
      */}
    </header>
  );
};

export default Header;