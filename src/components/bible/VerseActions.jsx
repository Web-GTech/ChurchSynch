import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

const VerseActions = ({ copySelectedVerses, countSelectedVerses }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center sm:justify-end p-2 bg-background rounded-b-lg shadow border border-t-0 border-slate-200">
        <Button 
            onClick={copySelectedVerses} 
            variant="outline" 
            size="sm" 
            className="h-9 text-xs w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-100" 
            disabled={countSelectedVerses === 0}
        >
            <Copy className="mr-2 h-3 w-3" /> Copiar {countSelectedVerses > 0 ? `(${countSelectedVerses})` : ''}
        </Button>
    </div>
  );
};

export default VerseActions;