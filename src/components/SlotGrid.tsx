import { Grid as GridType, WinCluster, COLS, ROWS } from '../game/types';
import { SymbolCell } from './SymbolCell';
import { AnimatePresence } from 'framer-motion';

interface SlotGridProps {
  grid: GridType;
  winClusters: WinCluster[];
  phase: string;
}

export function SlotGrid({ grid, winClusters, phase }: SlotGridProps) {
  const winningPositions = new Set<string>();
  winClusters.forEach(c => c.positions.forEach(([col, row]) => winningPositions.add(`${col},${row}`)));

  const isExploding = phase === 'exploding';

  return (
    <div className="game-panel rounded-xl p-2 sm:p-3">
      <div
        className="grid gap-1 sm:gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        <AnimatePresence mode="popLayout">
          {/* Render column by column, row by row (grid reads col-major but displays row-major) */}
          {Array.from({ length: ROWS }, (_, row) =>
            Array.from({ length: COLS }, (_, col) => {
              const cell = grid[col][row];
              const posKey = `${col},${row}`;
              return (
                <SymbolCell
                  key={cell.key}
                  cell={cell}
                  isWinning={winningPositions.has(posKey)}
                  isExploding={isExploding}
                  colIndex={col}
                  rowIndex={row}
                />
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
