import React from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';

const VerseList = ({ bibleText, selectedVerses, toggleVerseSelection, highlightColor }) => {
  if (!bibleText) return null;

  return (
    <motion.div 
      className="prose prose-sm max-w-none p-3 sm:p-4 bg-white rounded-lg shadow-inner border border-slate-200 flex-grow overflow-y-auto text-slate-700"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 border-b border-slate-200 pb-1.5 mb-2.5">
        {bibleText.reference}
      </h2>
      <div className="space-y-1">
        {bibleText.verses.map((verse) => (
          <div 
            key={verse.verse} 
            className={`p-1.5 rounded-md transition-all duration-150 ease-in-out cursor-pointer hover:bg-primary/10 ${selectedVerses[verse.verse] ? `${highlightColor} border shadow-sm` : 'border border-transparent hover:border-primary/20'}`}
            onClick={() => toggleVerseSelection(verse.verse)}
          >
            <Label htmlFor={`verse-${verse.verse}`} className="flex-grow cursor-pointer text-sm sm:text-base"> {/* Adjusted font size */}
              <sup className="font-bold text-primary/90 mr-1 text-xs sm:text-sm">{verse.verse}</sup>
              <span className="leading-relaxed text-slate-800">{verse.text}</span>
            </Label>
          </div>
        ))}
      </div>
      <p className="text-2xs text-slate-500 mt-4 pt-2 border-t border-slate-200">
        Tradução: {bibleText.translation_name} ({bibleText.translation_id.toUpperCase()})
      </p>
    </motion.div>
  );
};

export default VerseList;