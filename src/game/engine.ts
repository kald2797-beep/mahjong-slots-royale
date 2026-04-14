import { SymbolId, SYMBOLS, COLS, ROWS, Grid, CellState, WinCluster, MULTIPLIER_STEPS } from './types';

let keyCounter = 0;
const nextKey = () => ++keyCounter;

export function randomSymbol(): SymbolId {
  // Weighted: higher payout symbols are rarer
  const weights = [3, 5, 4, 8, 10, 14, 16, 20];
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i as SymbolId;
  }
  return 7;
}

export function createGrid(): Grid {
  const grid: Grid = [];
  for (let col = 0; col < COLS; col++) {
    const column: CellState[] = [];
    for (let row = 0; row < ROWS; row++) {
      column.push({ symbolId: randomSymbol(), key: nextKey() });
    }
    grid.push(column);
  }
  return grid;
}

export function findClusters(grid: Grid): WinCluster[] {
  const visited = Array.from({ length: COLS }, () => Array(ROWS).fill(false));
  const clusters: WinCluster[] = [];

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      if (visited[col][row]) continue;
      const symbolId = grid[col][row].symbolId;
      const positions: [number, number][] = [];
      
      // BFS
      const queue: [number, number][] = [[col, row]];
      visited[col][row] = true;
      
      while (queue.length > 0) {
        const [c, r] = queue.shift()!;
        positions.push([c, r]);
        
        const neighbors: [number, number][] = [[c-1,r],[c+1,r],[c,r-1],[c,r+1]];
        for (const [nc, nr] of neighbors) {
          if (nc >= 0 && nc < COLS && nr >= 0 && nr < ROWS && !visited[nc][nr] && grid[nc][nr].symbolId === symbolId) {
            visited[nc][nr] = true;
            queue.push([nc, nr]);
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

export function removeWinning(grid: Grid, clusters: WinCluster[]): Grid {
  const newGrid = grid.map(col => [...col]);
  const toRemove = new Set<string>();
  
  for (const cluster of clusters) {
    for (const [c, r] of cluster.positions) {
      toRemove.add(`${c},${r}`);
    }
  }
  
  for (let col = 0; col < COLS; col++) {
    const remaining = newGrid[col].filter((_, row) => !toRemove.has(`${col},${row}`));
    const fillCount = ROWS - remaining.length;
    const newCells: CellState[] = Array.from({ length: fillCount }, () => ({
      symbolId: randomSymbol(),
      key: nextKey(),
    }));
    newGrid[col] = [...newCells, ...remaining];
  }
  
  return newGrid;
}

export function getMultiplier(cascadeCount: number): number {
  const idx = Math.min(cascadeCount, MULTIPLIER_STEPS.length - 1);
  return MULTIPLIER_STEPS[idx];
}

export function calculateWin(clusters: WinCluster[], bet: number, multiplier: number): number {
  const totalPayout = clusters.reduce((sum, c) => sum + c.payout, 0);
  return totalPayout * bet * multiplier * 0.1;
}
