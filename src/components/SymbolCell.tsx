import { motion } from 'framer-motion';
import { SYMBOLS, CellState, ROWS } from '../game/types';

interface SymbolCellProps {
  cell: CellState;
  isWinning: boolean;
  isExploding: boolean;
  isClearing: boolean;
  colIndex: number;
  rowIndex: number;
}

export function SymbolCell({ cell, isWinning, isExploding, isClearing, colIndex, rowIndex }: SymbolCellProps) {
  const symbol = SYMBOLS[cell.symbolId];

  if (isClearing) {
    return (
      <motion.div
        key={`clear-${cell.key}`}
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: ROWS * 80, opacity: 0 }}
        transition={{
          duration: 0.3,
          ease: 'easeIn',
          delay: colIndex * 0.03 + rowIndex * 0.02,
        }}
        className="symbol-cell rounded-lg flex items-center justify-center aspect-square"
      >
        <span className="text-2xl sm:text-3xl md:text-4xl select-none" role="img" aria-label={symbol.name}>
          {symbol.emoji}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={cell.key}
      initial={{ y: -(ROWS * 80), opacity: 0 }}
      animate={{
        y: 0,
        opacity: isExploding && isWinning ? 0 : 1,
        scale: isExploding && isWinning ? 1.4 : isWinning ? 1.08 : 1,
      }}
      transition={{
        y: {
          type: 'spring',
          stiffness: 160,
          damping: 16,
          delay: rowIndex * 0.07 + colIndex * 0.025,
        },
        opacity: { duration: 0.25 },
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
