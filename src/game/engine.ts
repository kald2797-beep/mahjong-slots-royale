import { SymbolId, SYMBOLS, COLS, ROWS, Grid, CellState, WinCluster, MULTIPLIER_STEPS, FREE_SPIN_MULTIPLIER_STEPS } from './types';

let keyCounter = 0;
const nextKey = () => ++keyCounter;

export function randomSymbol(isFreeSpins = false): SymbolId {
  if (isFreeSpins) {
    // Higher chance of high-value symbols, no scatter in free spins grid fill
    const weights = [5, 7, 6, 10, 12, 14, 14, 16, 0, 2]; // wild can appear
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i];
      if (r <= 0) return i as SymbolId;
    }
    return 7;
  }
  // Base game weights — scatter (8) has small chance
  const weights = [3, 5, 4, 8, 10, 14, 16, 20, 1.5, 0]; // no wild in base
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i as SymbolId;
  }
  return 7;
}

export function createGrid(isFreeSpins = false): Grid {
  const grid: Grid = [];
  for (let col = 0; col < COLS; col++) {
    const column: CellState[] = [];
    for (let row = 0; row < ROWS; row++) {
      column.push({ symbolId: randomSymbol(isFreeSpins), key: nextKey() });
    }
    grid.push(column);
  }
  return grid;
}

export function countScatters(grid: Grid): [number, number][] {
  const positions: [number, number][] = [];
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      if (grid[col][row].symbolId === 8) {
        positions.push([col, row]);
      }
    }
  }
  return positions;
}

export function findClusters(grid: Grid): WinCluster[] {
  const visited = Array.from({ length: COLS }, () => Array(ROWS).fill(false));
  const clusters: WinCluster[] = [];

  // Mark scatter positions as visited (they don't form clusters)
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      if (SYMBOLS[grid[col][row].symbolId].isScatter) {
        visited[col][row] = true;
      }
    }
  }

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      if (visited[col][row]) continue;
      const cell = grid[col][row];
      const symbolId = cell.symbolId;
      const isWild = SYMBOLS[symbolId].isWild;
      
      // Wilds don't form their own clusters, they join others
      if (isWild) {
        visited[col][row] = true;
        continue;
      }

      const positions: [number, number][] = [];
      const queue: [number, number][] = [[col, row]];
      visited[col][row] = true;

      while (queue.length > 0) {
        const [c, r] = queue.shift()!;
        positions.push([c, r]);

        const neighbors: [number, number][] = [[c-1,r],[c+1,r],[c,r-1],[c,r+1]];
        for (const [nc, nr] of neighbors) {
          if (nc >= 0 && nc < COLS && nr >= 0 && nr < ROWS && !visited[nc][nr]) {
            const neighborSym = grid[nc][nr].symbolId;
            if (neighborSym === symbolId || SYMBOLS[neighborSym].isWild) {
              visited[nc][nr] = true;
              queue.push([nc, nr]);
            }
          }
        }
      }

      if (positions.length >= 5) {
        const sym = SYMBOLS[symbolId];
        clusters.push({
          positions,
          symbolId,
          payout: positions.length * sym.payout,
        });
      }
    }
  }

  return clusters;
}

export function removeWinning(grid: Grid, clusters: WinCluster[], isFreeSpins = false): Grid {
  const newGrid = grid.map(col => [...col]);
  const toRemove = new Set<string>();

  for (const cluster of clusters) {
    for (const [c, r] of cluster.positions) {
      toRemove.add(`${c},${r}`);
    }
  }

  for (let col = 0; col < COLS; col++) {
    const remaining: CellState[] = [];
    for (let row = 0; row < ROWS; row++) {
      if (!toRemove.has(`${col},${row}`)) {
        remaining.push({ ...newGrid[col][row], fromRow: row });
      }
    }
    const fillCount = ROWS - remaining.length;
    const newCells: CellState[] = Array.from({ length: fillCount }, (_, i) => ({
      symbolId: randomSymbol(isFreeSpins),
      key: nextKey(),
      fromRow: -(fillCount - i),
    }));
    newGrid[col] = [...newCells, ...remaining];
  }

  return newGrid;
}

// Transform random winning-adjacent cells to golden wilds during free spins
export function transformToGoldenWilds(grid: Grid, clusters: WinCluster[]): Grid {
  const newGrid = grid.map(col => col.map(cell => ({ ...cell })));
  const winPositions = new Set<string>();
  
  for (const cluster of clusters) {
    for (const [c, r] of cluster.positions) {
      winPositions.add(`${c},${r}`);
    }
  }

  // Find cells adjacent to wins that aren't already winning
  const candidates: [number, number][] = [];
  for (const cluster of clusters) {
    for (const [c, r] of cluster.positions) {
      const neighbors: [number, number][] = [[c-1,r],[c+1,r],[c,r-1],[c,r+1]];
      for (const [nc, nr] of neighbors) {
        const key = `${nc},${nr}`;
        if (nc >= 0 && nc < COLS && nr >= 0 && nr < ROWS && !winPositions.has(key)) {
          if (!SYMBOLS[newGrid[nc][nr].symbolId].isScatter && !SYMBOLS[newGrid[nc][nr].symbolId].isWild) {
            candidates.push([nc, nr]);
          }
        }
      }
    }
  }

  // Transform 1-2 random adjacent cells to wilds
  const unique = [...new Map(candidates.map(p => [`${p[0]},${p[1]}`, p])).values()];
  const count = Math.min(Math.floor(Math.random() * 2) + 1, unique.length);
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * unique.length);
    const [c, r] = unique.splice(idx, 1)[0];
    newGrid[c][r] = { ...newGrid[c][r], symbolId: 9 as SymbolId, isGoldenWild: true };
  }

  return newGrid;
}

export function getMultiplier(cascadeCount: number, isFreeSpins = false): number {
  const steps = isFreeSpins ? FREE_SPIN_MULTIPLIER_STEPS : MULTIPLIER_STEPS;
  const idx = Math.min(cascadeCount, steps.length - 1);
  return steps[idx];
}

export function calculateWin(clusters: WinCluster[], bet: number, multiplier: number): number {
  const totalPayout = clusters.reduce((sum, c) => sum + c.payout, 0);
  return totalPayout * bet * multiplier * 0.1;
}

export function getFreeSpinCount(scatterCount: number): number {
  if (scatterCount >= 5) return 15;
  if (scatterCount >= 4) return 12;
  if (scatterCount >= 3) return 10;
  return 0;
}

export function getRetriggerSpins(scatterCount: number): number {
  if (scatterCount >= 3) return 5;
  if (scatterCount >= 2) return 3;
  return 0;
}
