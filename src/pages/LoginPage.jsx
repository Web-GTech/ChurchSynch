import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, LogIn, ShieldQuestion, Loader2 } from 'lucide-react';
import Logo from '@/components/Logo';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, profile, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && profile) {
      if (profile.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [profile, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
    // Navigation is now handled by useEffect
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/20 dark:from-primary/5 dark:via-background dark:to-secondary/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl bg-card rounded-xl overflow-hidden border-border/50">
          <CardHeader className="text-center bg-gradient-to-b from-primary/5 via-card to-card pt-10 pb-8">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 150, damping: 15 }}
              className="mx-auto mb-6"
            >
              <Logo className="h-16" primaryColor="hsl(var(--primary))" secondaryColor="hsl(var(--primary)/0.7)" text="Church Facilities" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-foreground">Bem-vindo!</CardTitle>
            <CardDescription className="text-muted-foreground">Acesse sua conta Church Facilities</CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-foreground/80 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-input border-border focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/70 h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-foreground/80 font-medium">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-input border-border focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/70 h-10 text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </div>
                 <div className="text-right">
                    <Link to="#" className="text-xs text-primary hover:underline">Esqueceu a senha?</Link>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold py-2.5 h-10 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                disabled={isLoading || authLoading}
              >
                {isLoading || authLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
                {isLoading || authLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-3 py-6 bg-secondary/30 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Link to="/register" className="font-semibold text-primary hover:underline hover:text-primary/80">
                Cadastre-se
              </Link>
            </p>
            {/* Removido o link para /admin-register pois a página foi removida */}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;