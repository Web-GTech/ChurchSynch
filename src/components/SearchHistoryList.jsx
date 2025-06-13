import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchHistoryList = ({ history, onClearHistory, onRemoveItem, onHistoryItemClick }) => {
  if (!history || history.length === 0) {
    return (
      <motion.section 
        className="mt-10 w-full max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white shadow-lg rounded-xl border-ibabepi-blue-lighter">
          <CardHeader className="pb-3 pt-4 px-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold text-ibabepi-blue-dark flex items-center">
                <History className="mr-2 h-5 w-5 text-ibabepi-blue-medium" />
                Histórico de Buscas
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-center text-ibabepi-gray-dark py-3">Seu histórico de buscas está vazio.</p>
          </CardContent>
        </Card>
      </motion.section>
    );
  }

  return (
    <motion.section 
      className="mt-10 w-full max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="bg-white shadow-lg rounded-xl border-ibabepi-blue-lighter">
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-ibabepi-blue-dark flex items-center">
              <History className="mr-2 h-5 w-5 text-ibabepi-blue-medium" />
              Histórico de Buscas
            </CardTitle>
            {history.length > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearHistory} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="mr-1.5 h-4 w-4" /> Limpar Tudo
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <ul className="space-y-2">
            <AnimatePresence>
              {history.map((item, index) => (
                <motion.li
                  key={item.id || index}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-ibabepi-blue-lightest hover:bg-ibabepi-blue-lighter rounded-lg group cursor-pointer"
                  onClick={() => onHistoryItemClick(item.artist, item.song, item.tone)}
                >
                  <div className="truncate">
                    <span className="font-medium text-ibabepi-blue-darkest">{item.song}</span>
                    <span className="text-xs text-ibabepi-gray-dark ml-2">{item.artist}</span>
                    {item.tone && item.tone !== 'N/A' && <span className="text-xs text-ibabepi-gray-dark ml-2">(Tom: {item.tone})</span>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-ibabepi-gray hover:text-red-500 opacity-50 group-hover:opacity-100 ml-2"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      onRemoveItem(item.id);
                    }}
                  >
                    <X size={16} />
                  </Button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </CardContent>
      </Card>
    </motion.section>
  );
};

export default SearchHistoryList;