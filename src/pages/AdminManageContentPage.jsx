import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit3, Trash2, List, Megaphone, BookOpen, CalendarRange, Music2, Bell, ArrowLeft, ClipboardList } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const mockContent = {
  avisos: [
    { id: 'av1', title: 'Culto de Domingo', date: '2025-05-25', category: 'Cultos', content: 'Nosso culto de domingo será especial...' },
    { id: 'av2', title: 'Reunião de Jovens', date: '2025-05-24', category: 'Jovens', content: 'Não perca nossa reunião de jovens...' },
  ],
  ebd: [
    { id: 'ebd1', title: 'Estudo sobre Gálatas', professor: 'Prof. Silva', series: 'Epístolas Paulinas', content: 'Análise profunda da carta aos Gálatas...' },
  ],
  liturgia: [
    { id: 'lit1', date: '2025-05-25', theme: 'Adoração Contínua', items: [{ type: 'Louvor', title: 'Grande é o Senhor' }] },
  ],
  escalas: [
    { id: 'esc1', title: 'Culto Domingo Manhã', date: '2025-05-25', ministerio: 'Louvor', responsibles: ['João', 'Maria'] },
  ],
  repertorio: [
    { id: 'rep1', title: 'Grande És Tu', artist: 'Soraya Moraes', tone: 'G' }
  ],
  notificacoes: [
    { id: 'not1', title: 'Nova Escala', message: 'Confira a nova escala de louvor.', targetGroup: 'Louvor' }
  ]
};

const ContentForm = ({ type, existingItem, onSave, onCancel }) => {
  const [formData, setFormData] = useState(existingItem || {});
  const { toast } = useToast();

  useEffect(() => {
    setFormData(existingItem || {});
  }, [existingItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let primaryFieldMissing = false;
    if (type === 'repertorio' && !formData.artist) primaryFieldMissing = true;
    else if (!formData.title && !formData.theme && !formData.ministerio) primaryFieldMissing = true;
    
    if(primaryFieldMissing) {
      toast({ variant: "destructive", title: "Erro", description: "O campo principal (Título/Tema/Ministério/Artista) é obrigatório."});
      return;
    }
    onSave({ ...formData, id: existingItem?.id || Date.now().toString() });
  };

  const commonFields = (
    <>
      {(type !== 'liturgia' && type !== 'repertorio' && type !== 'notificacoes') && (
        <div className="space-y-1.5">
          <Label htmlFor="title" className="text-xs text-slate-700">Título</Label>
          <Input id="title" name="title" value={formData.title || ''} onChange={handleChange} className="h-9 text-sm border-slate-300 focus:ring-primary focus:border-primary" />
        </div>
      )}
      {type === 'avisos' && (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-xs text-slate-700">Categoria</Label>
            <Input id="category" name="category" value={formData.category || ''} onChange={handleChange} className="h-9 text-sm border-slate-300 focus:ring-primary focus:border-primary" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="content" className="text-xs text-slate-700">Conteúdo</Label>
            <Textarea id="content" name="content" value={formData.content || ''} onChange={handleChange} className="text-sm min-h-[80px] border-slate-300 focus:ring-primary focus:border-primary" />
          </div>
        </>
      )}
       {type === 'ebd' && (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="professor" className="text-xs text-slate-700">Professor</Label>
            <Input id="professor" name="professor" value={formData.professor || ''} onChange={handleChange} className="h-9 text-sm border-slate-300 focus:ring-primary focus:border-primary" />
          </div>
           <div className="space-y-1.5">
            <Label htmlFor="series" className="text-xs text-slate-700">Série</Label>
            <Input id="series" name="series" value={formData.series || ''} onChange={handleChange} className="h-9 text-sm border-slate-300 focus:ring-primary focus:border-primary" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="content" className="text-xs text-slate-700">Conteúdo Detalhado</Label>
            <Textarea id="content" name="content" value={formData.content || ''} onChange={handleChange} className="text-sm min-h-[80px] border-slate-300 focus:ring-primary focus:border-primary" />
          </div>
        </>
      )}
      {(type === 'liturgia' || type === 'escalas') && (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-xs text-slate-700">Data</Label>
            <Input id="date" name="date" type="date" value={formData.date || ''} onChange={handleChange} className="h-9 text-sm border-slate-300 focus:ring-primary focus:border-primary" />
          </div>
        </>
      )}
      {type === 'liturgia' && (
         <div className="space-y-1.5">
          <Label htmlFor="theme" className="text-xs text-slate-700">Tema do Culto</Label>
          <Input id="theme" name="theme" value={formData.theme || ''} onChange={handleChange} className="h-9 text-sm border-slate-300 focus:ring-primary focus:border-primary" />
        </div>
      )}
       {type === 'escalas' && (
         <div className="space-y-1.5">
          <Label htmlFor="ministerio" className="text-xs text-slate-700">Ministério</Label>
          <Input id="ministerio" name="ministerio" value={formData.ministerio || ''} onChange={handleChange} className="h-9 text-sm border-slate-300 focus:ring-primary focus:border-primary" />
        </div>
      )}
      {type === 'repertorio' && (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs text-slate-700">Título da Música</Label>
            <Input id="title" name="title" value={formData.title || ''} onChange={handleChange} className="h-9 text-sm border-slate-300 focus:ring-primary focus:border-primary" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="artist" className="text-xs text-slate-700">Artista</Label>
            <Input id="artist" name="artist" value={formData.artist || ''} onChange={handleChange} className="h-9 text-sm border-slate-300 focus:ring-primary focus:border-primary" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tone" className="text-xs text-slate-700">Tom</Label>
            <Input id="tone" name="tone" value={formData.tone || ''} onChange={handleChange} className="h-9 text-sm border-slate-300 focus:ring-primary focus:border-primary" />
          </div>
        </>
      )}
      {type === 'notificacoes' && (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs text-slate-700">Título da Notificação</Label>
            <Input id="title" name="title" value={formData.title || ''} onChange={handleChange} className="h-9 text-sm border-slate-300 focus:ring-primary focus:border-primary" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-xs text-slate-700">Mensagem</Label>
            <Textarea id="message" name="message" value={formData.message || ''} onChange={handleChange} className="text-sm min-h-[60px] border-slate-300 focus:ring-primary focus:border-primary" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="targetGroup" className="text-xs text-slate-700">Grupo Alvo (Opcional)</Label>
            <Input id="targetGroup" name="targetGroup" value={formData.targetGroup || ''} onChange={handleChange} className="h-9 text-sm border-slate-300 focus:ring-primary focus:border-primary" />
          </div>
        </>
      )}
    </>
  );
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      {commonFields}
      <div className="flex justify-end space-x-2.5 pt-3">
        <Button type="button" variant="outline" onClick={onCancel} className="h-9 text-sm border-slate-300 hover:bg-slate-100">Cancelar</Button>
        <Button type="submit" className="h-9 text-sm bg-primary hover:bg-primary/90 text-primary-foreground">{existingItem ? 'Salvar Alterações' : 'Criar Novo'}</Button>
      </div>
    </form>
  );
};

const ContentList = ({ items, type, onEdit, onRemove }) => {
  if (!items || items.length === 0) {
    return <p className="text-sm text-slate-500 py-6 text-center">Nenhum item cadastrado para esta categoria.</p>;
  }

  const renderItemDetails = (item) => {
    switch(type) {
      case 'avisos': return `${item.category} - ${item.date}`;
      case 'ebd': return `${item.professor} - ${item.series}`;
      case 'liturgia': return `${item.theme} - ${item.date}`;
      case 'escalas': return `${item.ministerio} - ${item.date}`;
      case 'repertorio': return `${item.artist} - Tom: ${item.tone}`;
      case 'notificacoes': return `Para: ${item.targetGroup || 'Todos'}`;
      default: return '';
    }
  }

  return (
    <div className="space-y-2.5">
      {items.map(item => (
        <div key={item.id} className="flex items-center justify-between p-3 border border-slate-200/80 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors aspect-[16/2] sm:aspect-[16/1.5]">
          <div className="flex-grow overflow-hidden">
            <p className="text-sm font-medium text-slate-800 truncate">{item.title || item.theme || item.ministerio}</p>
            <p className="text-xs text-slate-500 truncate">{renderItemDetails(item)}</p>
          </div>
          <div className="flex space-x-1.5 flex-shrink-0 ml-2">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-600 hover:text-primary hover:bg-primary/10" onClick={() => onEdit(item)}><Edit3 size={14} /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onRemove(item.id)}><Trash2 size={14} /></Button>
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminManageContentPage = () => {
  const [content, setContent] = useState(mockContent);
  const [currentForm, setCurrentForm] = useState({ type: null, item: null });
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.state?.defaultTab || "avisos");

  useEffect(() => {
    if (location.state?.defaultTab) {
      setActiveTab(location.state.defaultTab);
      navigate(location.pathname, { replace: true, state: {} }); 
    }
  }, [location.state, navigate, location.pathname]);

  const handleSave = (type, itemData) => {
    setContent(prev => {
      const typeContent = prev[type] || [];
      const existingIndex = typeContent.findIndex(i => i.id === itemData.id);
      let updatedContent;
      if (existingIndex > -1) {
        updatedContent = [...typeContent];
        updatedContent[existingIndex] = itemData;
      } else {
        updatedContent = [...typeContent, itemData];
      }
      return { ...prev, [type]: updatedContent };
    });
    toast({ title: "Sucesso!", description: `${type.charAt(0).toUpperCase() + type.slice(1)} salvo com sucesso.`, className: "bg-green-500 text-white" });
    setCurrentForm({ type: null, item: null });
  };
  
  const handleRemove = (type, itemId) => {
    setContent(prev => ({
      ...prev,
      [type]: prev[type].filter(i => i.id !== itemId)
    }));
    toast({ title: "Removido", description: "Item removido com sucesso." });
  };

  const tabConfig = [
    { value: "avisos", label: "Avisos", icon: Megaphone, data: content.avisos },
    { value: "ebd", label: "EBD", icon: BookOpen, data: content.ebd },
    { value: "liturgia", label: "Liturgia", icon: CalendarRange, data: content.liturgia },
    { value: "escalas", label: "Escalas", icon: ClipboardList, data: content.escalas },
    { value: "repertorio", label: "Repertório", icon: Music2, data: content.repertorio },
    { value: "notificacoes", label: "Notificações", icon: Bell, data: content.notificacoes },
  ];

  const currentTabData = tabConfig.find(tab => tab.value === activeTab)?.data || [];
  const CurrentIcon = tabConfig.find(tab => tab.value === activeTab)?.icon || List;

  return (
    <motion.div
      className="page-container full-height-page bg-slate-100"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
       <div className="w-full max-w-5xl mx-auto p-3 sm:p-5">
        <Card className="shadow-xl bg-card rounded-2xl overflow-hidden border border-border/60">
          <CardHeader className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground p-4 sm:p-5">
             <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/dashboard')} className="mr-2 sm:mr-3 text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9 sm:h-10 sm:w-10">
                  <ArrowLeft size={18} />
                </Button>
                <CardTitle className="text-lg sm:text-xl font-bold">Gerenciar Conteúdo</CardTitle>
              </div>
              <CurrentIcon size={24} className="text-primary-foreground/70" />
            </div>
            <CardDescription className="text-primary-foreground/80 mt-1 ml-11 sm:ml-12 text-xs sm:text-sm">
              Adicione, edite ou remova conteúdos das seções do aplicativo.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto rounded-none bg-slate-100 p-1 gap-0.5">
                {tabConfig.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value} className="py-2 text-[0.65rem] sm:text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md flex-col sm:flex-row items-center gap-1 sm:gap-1.5 h-12 sm:h-10">
                    <tab.icon size={14} className="sm:mr-0" /> {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabConfig.map(tab => (
                <TabsContent key={tab.value} value={tab.value} className="p-3 sm:p-5">
                   <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">{tab.label}</h3>
                    <Button onClick={() => setCurrentForm({ type: tab.value, item: null })} className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 text-xs sm:text-sm px-3">
                      <PlusCircle size={15} className="mr-1.5" /> Adicionar
                    </Button>
                  </div>

                  {currentForm.type === tab.value ? (
                     <motion.div initial={{ opacity: 0, y:10 }} animate={{ opacity: 1, y:0 }} className="mb-5 p-3 sm:p-4 border border-border/70 rounded-lg bg-background shadow-sm">
                      <h4 className="text-sm sm:text-base font-semibold text-foreground mb-2.5">{currentForm.item ? `Editando ${tab.label}` : `Novo ${tab.label}`}</h4>
                      <ContentForm 
                        type={tab.value}
                        existingItem={currentForm.item}
                        onSave={(itemData) => handleSave(tab.value, itemData)}
                        onCancel={() => setCurrentForm({ type: null, item: null })}
                      />
                    </motion.div>
                  ) : (
                    <ContentList 
                      items={currentTabData} 
                      type={tab.value}
                      onEdit={(item) => setCurrentForm({ type: tab.value, item: item })}
                      onRemove={(itemId) => handleRemove(tab.value, itemId)}
                    />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AdminManageContentPage;