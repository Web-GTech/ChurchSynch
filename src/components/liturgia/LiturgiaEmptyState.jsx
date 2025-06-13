import React from 'react';
import { CalendarCheck2 } from 'lucide-react';

const LiturgiaEmptyState = () => (
  <div className="text-center py-8 text-slate-500 flex-grow flex flex-col justify-center items-center">
    <CalendarCheck2 size={40} className="mb-3 opacity-50" />
    <p className="font-medium">Nenhum item na liturgia ainda.</p>
    <p className="text-xs">Adicione itens para começar a montar a liturgia do culto.</p>
  </div>
);

export default LiturgiaEmptyState;