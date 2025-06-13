import React from 'react';
import { motion } from 'framer-motion';

const LiturgiaProgress = ({ liturgy }) => {
  const progress = liturgy && liturgy.length > 0 ? (liturgy.filter(item => item.completed).length / liturgy.length) * 100 : 0;

  return (
    <div className="mb-2">
      <div className="flex justify-between items-center text-xs text-muted-foreground mb-0.5">
        <span>Progresso</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-1.5">
        <motion.div
          className="bg-primary h-1.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export default LiturgiaProgress;