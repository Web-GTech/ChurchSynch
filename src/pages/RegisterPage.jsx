import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, UserPlus, Loader2, ShieldQuestion, Church } from 'lucide-react';
import Logo from '@/components/Logo';
import { useToast } from "@/components/ui/use-toast";

const RegisterPage = () => {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dataAniversario, setDataAniversario] = useState('');
  const [igrejaMembro, setIgrejaMembro] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !sobrenome || !email || !password || !confirmPassword || !dataAniversario || !igrejaMembro) {
      toast({
        variant: "destructive",
        title: "Campos Incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro de Senha",
        description: "As senhas não coincidem.",
      });
      return;
    }
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha Inválida",
        description: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }
    setIsLoading(true);
    const newUser = await register({ 
      nome, 
      sobrenome, 
      email, 
      password, 
      data_aniversario: dataAniversario, 
      igreja_membro: igrejaMembro,
      batizado: 'nao_informado', 
      tempo_batismo: '' 
    });
    setIsLoading(false);
    if (newUser) {
      navigate('/'); 
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-ibabepi-blue-lightest via-ibabepi-blue-lighter to-ibabepi-blue-light p-4"
    >
      <Card className="w-full max-w-md shadow-2xl bg-card rounded-xl overflow-hidden">
        <CardHeader className="text-center p-6 bg-gradient-to-b from-ibabepi-blue-dark to-ibabepi-blue-medium">
          <div className="mx-auto mb-4">
            <Logo width="80" />
          </div>
          <CardTitle className="text-3xl font-bold text-white">Criar Conta</CardTitle>
          <CardDescription className="text-ibabepi-blue-lightest mt-1">
            Junte-se à comunidade.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="nome" className="text-ibabepi-blue-dark font-medium">Nome *</Label>
                <Input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="border-ibabepi-blue-light focus:ring-ibabepi-blue-medium focus:border-ibabepi-blue-medium transition-all"
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sobrenome" className="text-ibabepi-blue-dark font-medium">Sobrenome *</Label>
                <Input
                  id="sobrenome"
                  type="text"
                  value={sobrenome}
                  onChange={(e) => setSobrenome(e.target.value)}
                  required
                  className="border-ibabepi-blue-light focus:ring-ibabepi-blue-medium focus:border-ibabepi-blue-medium transition-all"
                  placeholder="Seu sobrenome"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="email-register" className="text-ibabepi-blue-dark font-medium">Email *</Label>
              <Input
                id="email-register"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-ibabepi-blue-light focus:ring-ibabepi-blue-medium focus:border-ibabepi-blue-medium transition-all"
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="igreja-membro" className="text-ibabepi-blue-dark font-medium">Nome da sua Igreja *</Label>
              <Input
                id="igreja-membro"
                type="text"
                value={igrejaMembro}
                onChange={(e) => setIgrejaMembro(e.target.value)}
                required
                className="border-ibabepi-blue-light focus:ring-ibabepi-blue-medium focus:border-ibabepi-blue-medium transition-all"
                placeholder="Ex: Igreja Batista da Paz"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="dataAniversario-register" className="text-ibabepi-blue-dark font-medium">Data de Nascimento *</Label>
              <Input
                id="dataAniversario-register"
                type="date"
                value={dataAniversario}
                onChange={(e) => setDataAniversario(e.target.value)}
                required
                className="border-ibabepi-blue-light focus:ring-ibabepi-blue-medium focus:border-ibabepi-blue-medium transition-all"
              />
            </div>
            <div className="space-y-1 relative">
              <Label htmlFor="password-register" className="text-ibabepi-blue-dark font-medium">Senha *</Label>
              <Input
                id="password-register"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-ibabepi-blue-light focus:ring-ibabepi-blue-medium focus:border-ibabepi-blue-medium transition-all pr-10"
                placeholder="Mínimo 6 caracteres"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-7 h-7 w-7 px-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} className="text-gray-500" /> : <Eye size={16} className="text-gray-500" />}
              </Button>
            </div>
            <div className="space-y-1 relative">
              <Label htmlFor="confirm-password-register" className="text-ibabepi-blue-dark font-medium">Confirmar Senha *</Label>
              <Input
                id="confirm-password-register"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="border-ibabepi-blue-light focus:ring-ibabepi-blue-medium focus:border-ibabepi-blue-medium transition-all pr-10"
                placeholder="Repita a senha"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-7 h-7 w-7 px-0"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={16} className="text-gray-500" /> : <Eye size={16} className="text-gray-500" />}
              </Button>
            </div>
            <Button type="submit" className="w-full bg-ibabepi-blue-medium hover:bg-ibabepi-blue-dark text-white font-semibold py-3 rounded-lg transition-colors" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UserPlus className="mr-2 h-5 w-5" />}
              {isLoading ? 'Registrando...' : 'Criar Conta'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center p-6 border-t border-ibabepi-blue-lightest">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-semibold text-ibabepi-blue-medium hover:text-ibabepi-blue-dark hover:underline">
              Faça login
            </Link>
          </p>
          <Link to="/ajuda/privacidade" className="mt-3 text-xs text-gray-500 hover:text-ibabepi-blue-medium hover:underline flex items-center">
            <ShieldQuestion size={14} className="mr-1" /> Política de Privacidade
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default RegisterPage;