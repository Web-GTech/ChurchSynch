import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';

const AdminRegistrationPage = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [secretKey, setSecretKey] = useState(''); // Chave secreta para simular uma camada de segurança
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulação de envio para aprovação.
    // Em um cenário real, isso enviaria os dados para um backend (Supabase)
    // para que um gestor aprovasse o cadastro.
    console.log("Dados do admin para aprovação:", { nome, email, secretKey });
    
    // A chave secreta é apenas uma simulação local.
    // Em um sistema real, a aprovação seria feita por um gestor no Supabase.
    if (secretKey === "IBABEPI_ADMIN_KEY") { // Chave secreta de exemplo
        let adminUsers = JSON.parse(localStorage.getItem('ibabepiAdminUsers')) || [];
        const existingAdmin = adminUsers.find(u => u.email === email);
        if (existingAdmin) {
            toast({ title: "Erro", description: "Este e-mail de administrador já está cadastrado.", variant: "destructive" });
            return;
        }
        adminUsers.push({ nome, email, password, role: 'admin' });
        localStorage.setItem('ibabepiAdminUsers', JSON.stringify(adminUsers));

        toast({
            title: "Solicitação de Cadastro de Admin Enviada",
            description: "Sua solicitação de cadastro como administrador foi enviada e será processada. (Simulação: Cadastro aprovado com chave secreta)",
        });
        navigate('/login');
    } else {
         toast({
            title: "Chave Secreta Inválida",
            description: "A chave secreta fornecida é inválida. Contate o gestor do sistema.",
            variant: "destructive"
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-ibabepi-blue-dark to-ibabepi-blue">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl bg-ibabepi-white">
          <CardHeader className="text-center">
            <ShieldCheck size={48} className="mx-auto mb-4 text-ibabepi-blue" />
            <CardTitle className="text-3xl font-bold text-ibabepi-blue-dark">Cadastro de Administrador</CardTitle>
            <CardDescription className="text-ibabepi-blue">Solicite acesso administrativo.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="nome" className="text-ibabepi-blue-dark">Nome Completo</Label>
                <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required className="border-ibabepi-blue focus:ring-ibabepi-blue-dark" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-ibabepi-blue-dark">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border-ibabepi-blue focus:ring-ibabepi-blue-dark" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password" className="text-ibabepi-blue-dark">Senha</Label>
                 <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="border-ibabepi-blue focus:ring-ibabepi-blue-dark" 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-ibabepi-blue"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="secretKey" className="text-ibabepi-blue-dark">Chave Secreta de Aprovação</Label>
                <Input id="secretKey" type="password" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} required placeholder="Fornecida pelo gestor" className="border-ibabepi-blue focus:ring-ibabepi-blue-dark" />
              </div>
              <p className="text-xs text-gray-500">
                Este cadastro requer aprovação. Após submeter, um gestor analisará sua solicitação. (Para fins de demonstração, use a chave "IBABEPI_ADMIN_KEY")
              </p>
              <Button type="submit" className="w-full bg-ibabepi-blue hover:bg-ibabepi-blue-dark text-ibabepi-white py-3 text-lg">
                Solicitar Cadastro
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Já é administrador?{' '}
              <Link to="/login" className="font-medium text-ibabepi-blue hover:underline">
                Faça login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminRegistrationPage;