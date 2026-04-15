import { motion } from 'framer-motion';
import { SYMBOLS, CellState, ROWS } from '../game/types';
import { SymbolIcon } from './SymbolIcon';

interface SymbolCellProps {
  cell: CellState;
  isWinning: boolean;
  isExploding: boolean;
  isClearing: boolean;
  isCascading: boolean;
  colIndex: number;
  rowIndex: number;
}

const CELL_HEIGHT = 80; // approximate cell height in px

export function SymbolCell({ cell, isWinning, isExploding, isClearing, isCascading, colIndex, rowIndex }: SymbolCellProps) {
  const symbol = SYMBOLS[cell.symbolId];

  if (isClearing) {
    return (
      <motion.div
        key={`clear-${cell.key}`}
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: ROWS * CELL_HEIGHT, opacity: 0 }}
        transition={{
          duration: 0.3,
          ease: 'easeIn',
          delay: colIndex * 0.03 + rowIndex * 0.02,
        }}
        className="symbol-cell rounded-lg flex items-center justify-center aspect-square"
      >
        <SymbolIcon symbolId={cell.symbolId} />
      </motion.div>
    );
  }

  // Calculate initial Y based on where this cell came from
  let initialY: number;
  if (isCascading && cell.fromRow !== undefined) {
    if (cell.fromRow < 0) {
      // New cell dropping from above
      initialY = cell.fromRow * CELL_HEIGHT;
    } else {
      // Existing cell: animate from old position to new position
      initialY = (cell.fromRow - rowIndex) * CELL_HEIGHT;
    }
  } else {
    // Default: drop from top (initial spin)
    initialY = -(ROWS * CELL_HEIGHT);
  }

  return (
    <motion.div
      key={cell.key}
      initial={{ y: initialY, opacity: isCascading ? 1 : 0 }}
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
          delay: isCascading ? colIndex * 0.02 : rowIndex * 0.07 + colIndex * 0.025,
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
        <SymbolIcon symbolId={cell.symbolId} />
    </motion.div>
  );
}
