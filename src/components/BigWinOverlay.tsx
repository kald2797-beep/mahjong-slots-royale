import { motion, AnimatePresence } from 'framer-motion';

interface BigWinOverlayProps {
  amount: number;
  visible: boolean;
}

export function BigWinOverlay({ amount, visible }: BigWinOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="text-center">
            <div className="font-display text-4xl sm:text-5xl font-black text-primary glow-gold-text">
              BIG WIN!
            </div>
            <div className="font-display text-3xl sm:text-4xl font-bold text-accent mt-2">
              ${amount.toFixed(2)}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
