import { Grid as GridType, WinCluster, COLS, ROWS, MULTIPLIER_STEPS, FREE_SPIN_MULTIPLIER_STEPS } from '../game/types';
import { SymbolCell } from './SymbolCell';

interface SlotGridProps {
  grid: GridType;
  winClusters: WinCluster[];
  phase: string;
  cascadeCount: number;
  scatterPositions?: [number, number][];
  isFreeSpinMode?: boolean;
  teaserActive?: boolean;
  teaserHit?: boolean;
}

export function SlotGrid({ grid, winClusters, phase, cascadeCount, scatterPositions = [], isFreeSpinMode = false, teaserActive = false, teaserHit = false }: SlotGridProps) {
  const winningPositions = new Set<string>();
  winClusters.forEach(c => c.positions.forEach(([col, row]) => winningPositions.add(`${col},${row}`)));

  const scatterSet = new Set<string>();
  scatterPositions.forEach(([col, row]) => scatterSet.add(`${col},${row}`));

  const isExploding = phase === 'exploding';
  const isClearing = phase === 'clearing';
  const isCascading = phase === 'cascading';
  const isSpinning = phase === 'spinning';

  // Detect which columns currently contain visible scatter symbols (id 8) — drives per-column spotlight after they land
  const scatterCols = new Set<number>();
  grid.forEach((col, ci) => {
    const hasVisibleScatter = col.some(cell => cell.symbolId === 8 && !(cell as any)._hidden);
    if (hasVisibleScatter) scatterCols.add(ci);
  });

  const multiplierSteps = isFreeSpinMode ? FREE_SPIN_MULTIPLIER_STEPS : MULTIPLIER_STEPS;

  // Approximate per-column reveal delay matching SymbolCell stagger (colIndex * 0.18s)
  const COL_REVEAL_DELAY = 0.18;

  return (
    <div className={`board-panel rounded-xl p-2 sm:p-3 transition-all duration-500 relative ${
      isFreeSpinMode ? 'fs-board' : ''
    } ${teaserActive ? 'ring-4 ring-primary/60' : ''}`}>
      {/* Per-column gold spotlight on columns containing scatters — appears AFTER the column lands */}
      {(isSpinning || teaserActive || phase === 'idle') && Array.from(scatterCols).map(ci => {
        const isLastCol = ci === COLS - 1;
        const intense = teaserActive && isLastCol;
        return (
          <div
            key={`scatter-col-${ci}`}
            className="absolute top-10 bottom-2 pointer-events-none z-20 rounded-lg"
            style={{
              left: `calc(${(ci / COLS) * 100}% + 2px)`,
              width: `calc(${100 / COLS}% - 4px)`,
              background: 'linear-gradient(180deg, hsl(38 92% 55% / 0.18), hsl(38 92% 55% / 0.04))',
              boxShadow: `0 0 ${intense ? 60 : 35}px hsl(38 92% 55% / ${intense ? 0.85 : 0.55}), inset 0 0 25px hsl(38 92% 55% / 0.3)`,
              border: '1px solid hsl(38 92% 55% / 0.6)',
              animation: 'pulse-glow 0.9s ease-in-out infinite, fade-in 0.3s ease-out backwards',
              animationDelay: `${ci * COL_REVEAL_DELAY + 0.25}s, ${ci * COL_REVEAL_DELAY + 0.25}s`,
            }}
          />
        );
      })}

      {/* Suspense spotlight on last column during teaser (before scatter drops there) */}
      {teaserActive && !scatterCols.has(COLS - 1) && (
        <div
          className="absolute top-10 bottom-2 pointer-events-none z-20 rounded-lg"
          style={{
            left: `calc(${((COLS - 1) / COLS) * 100}% - 4px)`,
            width: `calc(${100 / COLS}% + 4px)`,
            background: 'linear-gradient(180deg, hsl(38 92% 55% / 0.15), hsl(38 92% 55% / 0.03))',
            boxShadow: `0 0 50px ${teaserHit ? 'hsl(38 92% 55% / 0.9)' : 'hsl(38 92% 55% / 0.5)'}, inset 0 0 25px hsl(38 92% 55% / 0.3)`,
            border: '1px solid hsl(38 92% 55% / 0.6)',
            animation: 'pulse-glow 0.7s ease-in-out infinite',
          }}
        />
      )}
      <div className="flex justify-center gap-1.5 mb-2">
        {multiplierSteps.map((m, i) => {
          const isActive = cascadeCount > 0 && i <= cascadeCount - 1;
          const isCurrent = cascadeCount > 0 && i === cascadeCount - 1;
          return (
            <div
              key={m}
              className={`
                px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wide
                transition-all duration-300
                ${isCurrent
                  ? isFreeSpinMode
                    ? 'bg-purple-500 text-white scale-110'
                    : 'bg-primary text-primary-foreground glow-gold scale-110'
                  : isActive
                    ? isFreeSpinMode
                      ? 'bg-purple-500/30 text-purple-300'
                      : 'bg-primary/30 text-primary'
                    : 'bg-muted/60 text-muted-foreground'
                }
              `}
              style={isCurrent && isFreeSpinMode ? { boxShadow: '0 0 12px hsl(280 80% 60% / 0.6)' } : undefined}
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
            const isScatterHighlight = scatterSet.has(posKey);
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
                isScatterHighlight={isScatterHighlight}
                isGoldenWild={cell.isGoldenWild}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
