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
        symbol-cell rounded-lg flex items-center justify-center aspect-square overflow-hidden p-0.5
        ${isWinning && !isExploding ? 'winning pulse-glow' : ''}
        ${isExploding && isWinning ? 'explode' : ''}
      `}
    >
      <img
        src={symbol.image}
        alt={symbol.name}
        className="w-full h-full object-contain select-none pointer-events-none"
        draggable={false}
      />
    </motion.div>
  );
}
