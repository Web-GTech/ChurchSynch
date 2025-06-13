import React from 'react';
import { motion } from 'framer-motion';
import LiturgiaItem from './LiturgiaItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LiturgiaEtapaCard = ({ etapaTitle, etapaIcon, items, onToggleComplete, onRemoveItem, onEditItem, userCanEdit, animationDelay }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: animationDelay }}
    >
      <Card className="shadow-md rounded-lg border border-border/70 bg-slate-50/30">
        <CardHeader className="flex flex-row items-center space-x-3 p-3 border-b border-border/60 bg-slate-100/50 rounded-t-lg">
          <div className="text-primary">
            {React.cloneElement(etapaIcon, { className: "h-5 w-5" })}
          </div>
          <CardTitle className="text-sm font-semibold text-foreground leading-none tracking-tight">{etapaTitle}</CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-2.5 space-y-1.5">
          {items.map((item, index) => (
            <LiturgiaItem
              key={item.id}
              item={item}
              index={index}
              onToggleComplete={onToggleComplete}
              onRemove={onRemoveItem}
              onEdit={onEditItem}
              userCanEdit={userCanEdit}
            />
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LiturgiaEtapaCard;