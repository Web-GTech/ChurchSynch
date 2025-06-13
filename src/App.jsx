import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import FooterNav from '@/components/layout/FooterNav';
import WelcomePage from '@/pages/WelcomePage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import LiturgiaPage from '@/pages/LiturgiaPage';
import RepertorioPage from '@/pages/RepertorioPage';
import RepertorioViewPage from '@/pages/RepertorioViewPage';
import EscalaPage from '@/pages/EscalaPage';
import BibliaPage from '@/pages/BibliaPage';
import EbdPage from '@/pages/EbdPage';
// AdminRegistrationPage import is removed
import UserProfilePage from '@/pages/UserProfilePage';
import ProfileCompletionModal from '@/components/ProfileCompletionModal';
import MuralAvisosPage from '@/pages/MuralAvisosPage';
import SettingsPage from '@/pages/SettingsPage'; 
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AdminManageContentPage from '@/pages/AdminManageContentPage';
import AdminManageUsersPage from '@/pages/AdminManageUsersPage';
import AdminAppSettingsPage from '@/pages/AdminAppSettingsPage';
import NotificationsPage from '@/pages/NotificationsPage';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -10 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

function AnimatedRoutes() {
  const { user, isProfileComplete } = useAuth();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const nonAuthPages = ['/login', '/register', '/welcome']; // Removed '/admin-register'
    if (user && !isProfileComplete() && !nonAuthPages.includes(location.pathname)) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [user, isProfileComplete, location.pathname]);

  const commonProps = { user, isProfileComplete, setIsModalOpen };
  
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/welcome" element={!user ? <MotionPage><WelcomePage /></MotionPage> : <Navigate to="/" />} />
          <Route path="/login" element={<MotionPage><LoginPage /></MotionPage>} />
          <Route path="/register" element={<MotionPage><RegisterPage /></MotionPage>} />
          {/* AdminRegistrationPage route is removed */}
          
          <Route path="/" element={user ? <MotionPage><HomePage {...commonProps} /></MotionPage> : <Navigate to="/welcome" />} />
          <Route path="/liturgia" element={user ? <MotionPage><LiturgiaPage {...commonProps} /></MotionPage> : <Navigate to="/login" />} />
          <Route path="/repertorio" element={user ? <MotionPage><RepertorioPage {...commonProps} /></MotionPage> : <Navigate to="/login" />} />
          <Route path="/repertorio/view" element={user ? <MotionPage><RepertorioViewPage /></MotionPage> : <Navigate to="/login" />} />
          <Route path="/escala" element={user ? <MotionPage><EscalaPage {...commonProps} /></MotionPage> : <Navigate to="/login" />} />
          <Route path="/biblia" element={user ? <MotionPage><BibliaPage {...commonProps} /></MotionPage> : <Navigate to="/login" />} />
          <Route path="/ebd" element={user ? <MotionPage><EbdPage {...commonProps} /></MotionPage> : <Navigate to="/login" />} />
          <Route path="/perfil" element={user ? <MotionPage><UserProfilePage {...commonProps} /></MotionPage> : <Navigate to="/login" />} />
          <Route path="/mural-avisos" element={user ? <MotionPage><MuralAvisosPage {...commonProps} /></MotionPage> : <Navigate to="/login" />} />
          <Route path="/mural-avisos/:id" element={user ? <MotionPage><MuralAvisosPage {...commonProps} /></MotionPage> : <Navigate to="/login" />} /> {/* Example for specific notice */}
          <Route path="/settings" element={user ? <MotionPage><SettingsPage {...commonProps} /></MotionPage> : <Navigate to="/login" />} />
          <Route path="/notifications" element={user ? <MotionPage><NotificationsPage {...commonProps} /></MotionPage> : <Navigate to="/login" />} />
          
          <Route path="/admin/dashboard" element={user && user.role === 'admin' ? <MotionPage><AdminDashboardPage {...commonProps} /></MotionPage> : <Navigate to="/" />} />
          <Route path="/admin/manage-content" element={user && user.role === 'admin' ? <MotionPage><AdminManageContentPage {...commonProps} /></MotionPage> : <Navigate to="/" />} />
          <Route path="/admin/manage-users" element={user && user.role === 'admin' ? <MotionPage><AdminManageUsersPage {...commonProps} /></MotionPage> : <Navigate to="/" />} />
          <Route path="/admin/app-settings" element={user && user.role === 'admin' ? <MotionPage><AdminAppSettingsPage {...commonProps} /></MotionPage> : <Navigate to="/" />} />


          <Route path="*" element={<Navigate to={user ? "/" : "/welcome"} />} />
        </Routes>
      </AnimatePresence>
      {user && <ProfileCompletionModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />}
    </>
  );
}

const MotionPage = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    className="flex-grow w-full flex flex-col" 
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const { user } = useAuth();
  const isWelcomePage = location.pathname === '/welcome';
  const isAuthPage = ['/login', '/register'].includes(location.pathname); // Removed '/admin-register'
  const isRepertorioViewPage = location.pathname.startsWith('/repertorio/view');
  
  const showHeaderAndFooter = user && !isWelcomePage && !isAuthPage && !isRepertorioViewPage;

  useEffect(() => {
    const root = document.documentElement;
    if (showHeaderAndFooter) {
      root.style.setProperty('--header-height', '64px'); 
      root.style.setProperty('--footer-height', '70px'); 
    } else {
      root.style.setProperty('--header-height', '0px');
      root.style.setProperty('--footer-height', '0px');
    }
  }, [showHeaderAndFooter]);

  return (
    <div className="flex flex-col h-screen bg-background antialiased">
      {showHeaderAndFooter && <Header />}
      <main 
        className={`flex-grow w-full flex flex-col overflow-y-auto overflow-x-hidden 
                    ${showHeaderAndFooter ? 'content-wrapper' : 'h-full'}`}
      >
        <AnimatedRoutes />
      </main>
      {showHeaderAndFooter && <FooterNav />}
      <Toaster />
    </div>
  );
}

export default App;