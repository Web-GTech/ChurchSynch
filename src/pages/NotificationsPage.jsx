import React from 'react';
import { motion } from 'framer-motion';
import { Bell, ArrowLeft, Info, CalendarClock, BookHeart, Megaphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const mockNotifications = [
  { id: 1, type: 'escala', title: 'Nova Escala Publicada', message: 'Você foi escalado para o Louvor no próximo Domingo.', date: '2025-05-20T10:00:00Z', read: false, icon: CalendarClock, color: 'blue', link: '/escala' },
  { id: 2, type: 'aviso', title: 'Reunião de Obreiros', message: 'Lembrete: Reunião de obreiros amanhã às 19h.', date: '2025-05-21T14:30:00Z', read: true, icon: Megaphone, color: 'orange', link: '/mural-avisos/reuniao-obreiros' }, // Example specific link
  { id: 3, type: 'ebd', title: 'Novo Estudo da EBD', message: 'Material da aula "As Parábolas de Jesus" disponível.', date: '2025-05-18T09:00:00Z', read: false, icon: BookHeart, color: 'green', link: '/ebd' },
  { id: 4, type: 'geral', title: 'Atualização do App', message: 'Nova versão do Church Facilities disponível com melhorias.', date: '2025-05-15T11:00:00Z', read: true, icon: Info, color: 'purple', link: '/' },
  { id: 5, type: 'aviso', title: 'Culto de Santa Ceia', message: 'Nosso culto de Santa Ceia será neste domingo às 18h.', date: '2025-05-22T08:00:00Z', read: false, icon: Megaphone, color: 'red', link: '/mural-avisos/santa-ceia-domingo' },
];

const NotificationIcon = ({ type }) => {
  switch (type) {
    case 'escala': return <CalendarClock className="h-5 w-5 text-blue-500" />;
    case 'aviso': return <Megaphone className="h-5 w-5 text-orange-500" />;
    case 'ebd': return <BookHeart className="h-5 w-5 text-green-500" />;
    default: return <Info className="h-5 w-5 text-purple-500" />;
  }
};


const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = React.useState(mockNotifications);

  const handleNotificationClick = (notification) => {
    setNotifications(
      notifications.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
    if (notification.link) {
      navigate(notification.link);
    }
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
              <CardTitle className="text-2xl font-bold text-primary-foreground">Notificações</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                {unreadCount > 0 ? `Você tem ${unreadCount} notificações não lidas.` : 'Nenhuma notificação nova.'}
              </CardDescription>
            </div>
          </div>
           <Bell size={36} className="text-primary-foreground/70" />
        </CardHeader>
        <CardContent className="p-0 flex-grow flex flex-col overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
              <Bell size={48} className="text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">Nenhuma Notificação</p>
              <p className="text-sm text-muted-foreground">Você está em dia!</p>
            </div>
          ) : (
            <>
              {unreadCount > 0 && (
                <div className="p-4 border-b border-border">
                  <Button onClick={markAllAsRead} variant="outline" size="sm" className="w-full sm:w-auto">
                    Marcar todas como lidas
                  </Button>
                </div>
              )}
              <ul className="divide-y divide-border flex-grow">
                {notifications.map(notification => (
                  <motion.li
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`p-4 flex items-start gap-3 hover:bg-secondary/50 transition-colors cursor-pointer ${!notification.read ? 'bg-primary/5' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleNotificationClick(notification)}
                  >
                    <div className={`p-2 rounded-full bg-${notification.color}-100`}>
                       <NotificationIcon type={notification.type} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <h3 className={`font-semibold text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>{notification.title}</h3>
                        {!notification.read && <Badge variant="default" className="text-xs h-5">Nova</Badge>}
                      </div>
                      <p className={`text-xs ${!notification.read ? 'text-foreground/90' : 'text-muted-foreground'}`}>{notification.message}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        {new Date(notification.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationsPage;