import { motion } from 'framer-motion';
import { SYMBOLS, CellState, ROWS } from '../game/types';

interface SymbolCellProps {
  cell: CellState;
  isWinning: boolean;
  isExploding: boolean;
  colIndex: number;
  rowIndex: number;
}

export function SymbolCell({ cell, isWinning, isExploding, colIndex, rowIndex }: SymbolCellProps) {
  const symbol = SYMBOLS[cell.symbolId];

  // Reel-style drop: come from far above, stagger by row
  return (
    <motion.div
      key={cell.key}
      layout
      initial={{ y: -(ROWS * 70), opacity: 0 }}
      animate={{
        y: 0,
        opacity: isExploding && isWinning ? 0 : 1,
        scale: isExploding && isWinning ? 1.4 : isWinning ? 1.08 : 1,
      }}
      transition={{
        y: {
          type: 'spring',
          stiffness: 180,
          damping: 18,
          delay: rowIndex * 0.06 + colIndex * 0.02,
        },
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
