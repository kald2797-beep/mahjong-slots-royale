import { motion } from 'framer-motion';
import { SYMBOLS, CellState } from '../game/types';

interface SymbolCellProps {
  cell: CellState;
  isWinning: boolean;
  isExploding: boolean;
  colIndex: number;
  rowIndex: number;
}

export function SymbolCell({ cell, isWinning, isExploding, colIndex, rowIndex }: SymbolCellProps) {
  const symbol = SYMBOLS[cell.symbolId];

  return (
    <motion.div
      key={cell.key}
      layout
      initial={{ y: -80, opacity: 0, scale: 0.5 }}
      animate={{
        y: 0,
        opacity: isExploding && isWinning ? 0 : 1,
        scale: isExploding && isWinning ? 1.4 : isWinning ? 1.08 : 1,
      }}
      transition={{
        y: { type: 'spring', stiffness: 300, damping: 25, delay: colIndex * 0.05 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.2 },
      }}
      className={`
        symbol-cell rounded-lg flex items-center justify-center aspect-square
        ${isWinning && !isExploding ? 'winning pulse-glow' : ''}
        ${isExploding && isWinning ? 'explode' : ''}
      `}
    >
      <span className="text-2xl sm:text-3xl md:text-4xl select-none" role="img" aria-label={symbol.name}>
        {symbol.emoji}
      </span>
    </motion.div>
  );
}
