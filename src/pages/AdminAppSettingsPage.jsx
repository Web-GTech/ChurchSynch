import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Layout, Bell, Lock, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';

const AdminAppSettingsPage = () => {
  const navigate = useNavigate();

  // Mock settings state - in a real app, this would come from a config or backend
  const [settings, setSettings] = React.useState({
    appName: "Church Facilities",
    primaryColor: "#2952A3", // --ibabepi-blue
    allowRegistrations: true,
    maintenanceMode: false,
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div
      className="page-container full-height-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full shadow-xl bg-card rounded-xl overflow-hidden flex-grow flex flex-col">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-left py-6 px-6 flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-3 text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft size={24} />
            </Button>
            <div>
              <CardTitle className="text-2xl font-bold text-primary-foreground">Configurações do Aplicativo</CardTitle>
              <CardDescription className="text-primary-foreground/80">Ajustes gerais e aparência do aplicativo.</CardDescription>
            </div>
          </div>
           <Palette size={36} className="text-primary-foreground/70" />
        </CardHeader>
        <CardContent className="p-6 flex-grow overflow-y-auto space-y-8">
          
          <SettingSection icon={Layout} title="Aparência e Identidade">
            <div className="space-y-4">
              <div>
                <Label htmlFor="appName" className="text-foreground">Nome do Aplicativo</Label>
                <Input 
                  id="appName" 
                  value={settings.appName} 
                  onChange={(e) => handleSettingChange('appName', e.target.value)}
                  className="mt-1 border-border focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <Label htmlFor="primaryColor" className="text-foreground">Cor Primária (Hex)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    id="primaryColor" 
                    type="text"
                    value={settings.primaryColor} 
                    onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                    className="border-border focus:ring-primary focus:border-primary w-full"
                  />
                  <div className="w-8 h-8 rounded border border-border" style={{ backgroundColor: settings.primaryColor }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Nota: A alteração da cor primária aqui é apenas visual. A implementação real requer atualização do CSS.</p>
              </div>
            </div>
          </SettingSection>

          <SettingSection icon={Lock} title="Acesso e Segurança">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md border border-border/50">
                <Label htmlFor="allowRegistrations" className="text-foreground cursor-pointer">Permitir Novos Cadastros</Label>
                <Switch 
                  id="allowRegistrations" 
                  checked={settings.allowRegistrations} 
                  onCheckedChange={(checked) => handleSettingChange('allowRegistrations', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md border border-border/50">
                <Label htmlFor="maintenanceMode" className="text-foreground cursor-pointer">Modo Manutenção</Label>
                <Switch 
                  id="maintenanceMode" 
                  checked={settings.maintenanceMode} 
                  onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                />
              </div>
            </div>
          </SettingSection>
          
          <SettingSection icon={Bell} title="Notificações (Configuração Futura)">
             <p className="text-sm text-muted-foreground">
               As configurações de notificação (como push notifications ou alertas por email) serão gerenciadas aqui quando o backend estiver integrado.
             </p>
          </SettingSection>

          <div className="pt-6 text-right">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Salvar Configurações
            </Button>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
};

const SettingSection = ({ icon: Icon, title, children }) => (
  <div className="border-b border-border/50 pb-6 last:border-b-0 last:pb-0">
    <div className="flex items-center mb-4">
      <Icon className="h-6 w-6 text-primary mr-3" />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    </div>
    {children}
  </div>
);

export default AdminAppSettingsPage;