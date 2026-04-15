import { Grid as GridType, WinCluster, COLS, ROWS, MULTIPLIER_STEPS } from '../game/types';
import { SymbolCell } from './SymbolCell';

interface SlotGridProps {
  grid: GridType;
  winClusters: WinCluster[];
  phase: string;
  cascadeCount: number;
}

export function SlotGrid({ grid, winClusters, phase, cascadeCount }: SlotGridProps) {
  const winningPositions = new Set<string>();
  winClusters.forEach(c => c.positions.forEach(([col, row]) => winningPositions.add(`${col},${row}`)));

  const isExploding = phase === 'exploding';
  const isClearing = phase === 'clearing';
  const isCascading = phase === 'cascading';

  return (
    <div className="board-panel rounded-xl p-2 sm:p-3">
      {/* Multiplier strip */}
      <div className="flex justify-center gap-1.5 mb-2">
        {MULTIPLIER_STEPS.map((m, i) => {
          const isActive = cascadeCount > 0 && i <= cascadeCount - 1;
          const isCurrent = cascadeCount > 0 && i === cascadeCount - 1;
          return (
            <div
              key={m}
              className={`
                px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wide
                transition-all duration-300
                ${isCurrent
                  ? 'bg-primary text-primary-foreground glow-gold scale-110'
                  : isActive
                    ? 'bg-primary/30 text-primary'
                    : 'bg-muted/60 text-muted-foreground'
                }
              `}
            >
              x{m}
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div
        className="grid gap-1 sm:gap-1.5 overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {Array.from({ length: ROWS }, (_, row) =>
          Array.from({ length: COLS }, (_, col) => {
            const cell = grid[col][row];
            const posKey = `${col},${row}`;
            return (
              <SymbolCell
                key={`${cell.key}-${isClearing ? 'c' : 'd'}`}
                cell={cell}
                isWinning={winningPositions.has(posKey)}
                isExploding={isExploding}
                isClearing={isClearing}
                isCascading={isCascading}
                colIndex={col}
                rowIndex={row}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
