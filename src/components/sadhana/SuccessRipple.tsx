import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export const SuccessRipple = () => (
  <div className="relative flex justify-center items-center w-24 h-24 mx-auto mb-4">
    <motion.div
      initial={{ scale: 0.8, opacity: 0.5 }}
      animate={{ scale: 1.5, opacity: 0 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
      className="absolute w-12 h-12 bg-green-500 rounded-full"
    />
    <div className="bg-slate-900 rounded-full relative z-10 p-1">
      <CheckCircle2 size={48} className="text-green-500" />
    </div>
  </div>
);
