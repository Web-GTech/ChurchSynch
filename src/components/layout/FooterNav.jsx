import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookText, Music3, CalendarCheck, Church, BookHeart } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { path: '/liturgia', label: 'Liturgia', icon: BookText },
  { path: '/repertorio', label: 'Músicas', icon: Music3 },
  { path: '/', label: 'Início', icon: Church, isCentral: true },
  { path: '/escala', label: 'Escalas', icon: CalendarCheck },
  { path: '/biblia', label: 'Bíblia', icon: BookHeart },
];

const FooterNav = () => {
  const location = useLocation();
  const auth = useAuth(); 
  const user = auth ? auth.user : null;

  if (!user) {
    return null;
  }

  return (
    <motion.footer 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 25, delay: 0.3 }}
      className="fixed bottom-0 left-0 right-0 bg-card shadow-top-soft z-40 border-t border-border"
      style={{ height: 'var(--footer-height, 70px)' }}
    >
      <nav className="flex justify-around items-end h-full px-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive: active }) => cn(
                'flex flex-col items-center justify-center text-center transition-all duration-300 ease-out flex-1 h-full group',
                item.isCentral ? 'relative' : 'pb-1' 
              )}
            >
              <motion.div
                className={cn(
                  'flex flex-col items-center justify-center rounded-full transition-all duration-300 ease-out',
                  item.isCentral 
                    ? 'w-16 h-16 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg -translate-y-[22px] border-4 border-card' 
                    : 'w-12 h-12',
                  isActive && item.isCentral ? 'scale-110 shadow-xl ring-2 ring-primary/50 ring-offset-2 ring-offset-card' : '',
                  isActive && !item.isCentral ? 'bg-primary/10 rounded-2xl' : ''
                )}
                whileTap={{ scale: item.isCentral ? 1.05 : 0.95 }}
                whileHover={{ scale: item.isCentral ? 1.02 : 1.05 }}
              >
                <item.icon 
                  size={item.isCentral ? 30 : 24} 
                  className={cn(
                    'transition-colors duration-200',
                    isActive ? (item.isCentral ? 'text-primary-foreground' : 'text-primary') : 'text-muted-foreground group-hover:text-foreground/80'
                  )}
                  strokeWidth={isActive ? 2.5 : 2} 
                />
              </motion.div>
              {!item.isCentral && (
                <span className={cn(
                  'text-[10px] mt-0.5 font-medium transition-colors duration-200',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground/80'
                )}>
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </motion.footer>
  );
};

export default FooterNav;