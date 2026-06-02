import { SymbolId, SYMBOLS, COLS, ROWS, Grid, CellState, WinCluster } from './types';
import { getRtpConfig } from './rtpConfig';

let keyCounter = 0;
const nextKey = () => ++keyCounter;

export function randomSymbol(isFreeSpins = false): SymbolId {
  const cfg = getRtpConfig();
  const weights = isFreeSpins ? cfg.freeSpinWeights : cfg.baseWeights;
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
      const symbolId = randomSymbol(isFreeSpins);
      // Mark some non-special symbols as "will be wild" — golden symbols that flip to wild before evaluation.
      // Higher chance during free spins. Never on scatters or already-wilds.
      const canBeWild = symbolId !== 8 && symbolId !== 9;
      const wildChance = isFreeSpins ? 0.05 : 0.025;
      const willBeWild = canBeWild && Math.random() < wildChance;
      column.push({ symbolId, key: nextKey(), ...(willBeWild ? { willBeWild: true } : {}) });
    }
    grid.push(column);
  }
  return grid;
}

// Flip every cell marked `willBeWild` into a golden wild (symbolId = 9).
export function revealMarkedWilds(grid: Grid): { grid: Grid; transformed: boolean } {
  let transformed = false;
  const newGrid = grid.map(col => col.map(cell => {
    if (cell.willBeWild) {
      transformed = true;
      return { ...cell, symbolId: 9 as SymbolId, isGoldenWild: true, willBeWild: false };
    }
    return cell;
  }));
  return { grid: newGrid, transformed };
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

// Left-to-right line wins.
// For each row, walk columns starting at col 0; collect a run of cells that
// match a "base" symbol (the first non-wild from the left), with wilds acting
// as substitutes. A run of length >= minLineSize pays.
export function findClusters(grid: Grid): WinCluster[] {
  const minLineSize = Math.max(3, Math.min(getRtpConfig().minClusterSize, 3));
  const payouts = getRtpConfig().payouts;
  const wins: WinCluster[] = [];

  for (let row = 0; row < ROWS; row++) {
    // Determine base symbol = first non-wild, non-scatter from the left
    let base: SymbolId | -1 = -1;
    for (let col = 0; col < COLS; col++) {
      const s = grid[col][row].symbolId;
      if (SYMBOLS[s].isScatter) break;
      if (!SYMBOLS[s].isWild) { base = s; break; }
    }

    // All wilds from the left also count: treat base as wild (id 9)
    const positions: [number, number][] = [];
    let runSymbol: SymbolId | -1 = base;
    for (let col = 0; col < COLS; col++) {
      const s = grid[col][row].symbolId;
      if (SYMBOLS[s].isScatter) break;
      if (runSymbol === -1) {
        if (SYMBOLS[s].isWild) { positions.push([col, row]); runSymbol = 9 as SymbolId; continue; }
        break;
      }
      if (s === runSymbol || SYMBOLS[s].isWild) {
        positions.push([col, row]);
      } else {
        break;
      }
    }

    if (positions.length >= minLineSize && runSymbol !== -1 && runSymbol !== 9) {
      wins.push({
        positions,
        symbolId: runSymbol,
        payout: positions.length * payouts[runSymbol],
      });
    }
  }

  return wins;
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
  const cfg = getRtpConfig();
  const steps = isFreeSpins ? cfg.freeSpinMultiplierSteps : cfg.multiplierSteps;
  const idx = Math.min(cascadeCount, steps.length - 1);
  return steps[idx];
}

export function calculateWin(clusters: WinCluster[], bet: number, multiplier: number): number {
  const totalPayout = clusters.reduce((sum, c) => sum + c.payout, 0);
  return totalPayout * bet * multiplier * getRtpConfig().payoutFactor;
}

export function getFreeSpinCount(scatterCount: number): number {
  for (const t of getRtpConfig().freeSpinTrigger) {
    if (scatterCount >= t.count) return t.spins;
  }
  return 0;
}

export function getRetriggerSpins(scatterCount: number): number {
  for (const t of getRtpConfig().retriggerTable) {
    if (scatterCount >= t.count) return t.spins;
  }
  return 0;
}
