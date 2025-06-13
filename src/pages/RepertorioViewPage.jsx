import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, AlertTriangle, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const RepertorioViewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [iframeSrc, setIframeSrc] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [iframeError, setIframeError] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(Date.now()); 

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const url = params.get('url');
    const title = params.get('title');

    if (url) {
      setIframeSrc(decodeURIComponent(url));
      setIsLoading(true); 
      setIframeError(false);
      setIframeKey(Date.now()); 
    } else {
      toast({
        variant: "destructive",
        title: "Erro ao carregar",
        description: "Nenhuma URL foi fornecida para visualização.",
      });
      navigate('/repertorio');
    }
    if (title) {
      setPageTitle(decodeURIComponent(title));
    } else {
      setPageTitle("Visualizar Conteúdo");
    }
  }, [location.search, navigate, toast]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setIframeError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setIframeError(true);
    toast({
      variant: "destructive",
      title: "Erro ao carregar conteúdo",
      description: "Não foi possível embutir este conteúdo. Tente abrir em uma nova aba ou recarregar.",
    });
  };

  const handleReloadIframe = () => {
    setIsLoading(true);
    setIframeError(false);
    setIframeKey(Date.now()); 
  };

  return (
    <motion.div
      className={`min-h-full flex flex-col ${isFullScreen ? 'fixed inset-0 z-[200] bg-white' : 'p-4 pt-6 bg-gradient-to-b from-ibabepi-blue-lightest to-ibabepi-white'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`w-full ${isFullScreen ? 'h-full flex flex-col rounded-none border-0' : 'max-w-4xl mx-auto shadow-xl rounded-xl'} bg-white overflow-hidden`}>
        <CardHeader className={`p-4 border-b border-ibabepi-blue-lighter ${isFullScreen ? 'bg-ibabepi-blue-lightest' : ''}`}>
          <div className="flex items-center justify-between gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-ibabepi-blue-dark hover:bg-ibabepi-blue-lightest">
              <ArrowLeft size={20} />
            </Button>
            <CardTitle className="text-lg sm:text-xl font-semibold text-ibabepi-blue-darkest truncate flex-1 mx-2 text-center">
              {pageTitle}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleReloadIframe} className="border-ibabepi-blue-medium text-ibabepi-blue-medium hover:bg-ibabepi-blue-lightest" title="Recarregar">
                <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setIsFullScreen(!isFullScreen)} className="border-ibabepi-blue-medium text-ibabepi-blue-medium hover:bg-ibabepi-blue-lightest" title={isFullScreen ? "Minimizar" : "Maximizar"}>
                {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => window.open(iframeSrc, '_blank')} className="border-ibabepi-blue-medium text-ibabepi-blue-medium hover:bg-ibabepi-blue-lightest" title="Abrir em nova aba">
                <ExternalLink size={18} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className={`p-0 ${isFullScreen ? 'flex-grow' : 'h-[75vh]'} relative`}>
          {isLoading && !iframeError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
              <RefreshCw className="h-10 w-10 text-ibabepi-blue-medium animate-spin mb-3" />
              <p className="text-ibabepi-blue-dark">Carregando conteúdo...</p>
            </div>
          )}
          {iframeError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-red-50">
              <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-red-700 font-semibold text-lg mb-2">Conteúdo Bloqueado</p>
              <p className="text-sm text-red-600 mb-4">
                Este conteúdo não pôde ser exibido diretamente no aplicativo.
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={handleReloadIframe}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-100"
                >
                  <RefreshCw size={16} className="mr-2"/> Tentar Novamente
                </Button>
                <Button 
                  onClick={() => window.open(iframeSrc, '_blank')}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <ExternalLink size={16} className="mr-2"/> Abrir em Nova Aba
                </Button>
              </div>
            </div>
          ) : (
            <iframe
              key={iframeKey}
              src={iframeSrc}
              title={pageTitle}
              className={`w-full h-full border-0 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RepertorioViewPage;