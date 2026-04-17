import { Grid, SymbolId, COLS, ROWS, CellState } from './types';

let keyCounter = 100000;
const nextKey = () => ++keyCounter;

export type DevForceMode =
  | 'freespin'      // 4 scatters → trigger free spins
  | 'bigwin'        // huge cluster of red dragon (id 0)
  | 'smallwin'      // small cluster of low-payout symbol
  | 'chain1'        // single cascade
  | 'chain2'        // two cascades
  | 'chain3'        // three cascades
  | 'teaserHit'     // 2 scatters in cols 0-3 + 1 in col 4 → teaser HITS
  | 'teaserMiss';   // 2 scatters in cols 0-3, none in col 4 → teaser MISS

function makeCell(symbolId: SymbolId): CellState {
  return { symbolId, key: nextKey() };
}

// Helper to fill a grid with a base symbol, then override specific cells
function buildGrid(base: SymbolId, overrides: Array<[number, number, SymbolId]>): Grid {
  const grid: Grid = [];
  for (let col = 0; col < COLS; col++) {
    const column: CellState[] = [];
    for (let row = 0; row < ROWS; row++) {
      column.push(makeCell(base));
    }
    grid.push(column);
  }
  // Apply overrides
  for (const [c, r, s] of overrides) {
    grid[c][r] = makeCell(s);
  }
  return grid;
}

// Avoid forming clusters with the base symbol by using alternating "noise" symbols
function buildNoiseGrid(overrides: Array<[number, number, SymbolId]>): Grid {
  const noise: SymbolId[] = [1, 3, 5, 7]; // alternate to avoid 5+ clusters naturally
  const grid: Grid = [];
  for (let col = 0; col < COLS; col++) {
    const column: CellState[] = [];
    for (let row = 0; row < ROWS; row++) {
      // Alternate so neighbors differ
      const sym = noise[(col + row * 2) % noise.length];
      column.push(makeCell(sym));
    }
    grid.push(column);
  }
  for (const [c, r, s] of overrides) {
    grid[c][r] = makeCell(s);
  }
  return grid;
}

export function buildForcedGrid(mode: DevForceMode): Grid {
  switch (mode) {
    case 'freespin': {
      // Place 4 scatters (id 8) spread out
      return buildNoiseGrid([
        [0, 0, 8],
        [2, 1, 8],
        [4, 2, 8],
        [1, 4, 8],
      ]);
    }
    case 'bigwin': {
      // Massive cluster of Red Dragon (id 0) — payout 5, ~12 cells
      return buildNoiseGrid([
        [0, 0, 0], [1, 0, 0], [2, 0, 0],
        [0, 1, 0], [1, 1, 0], [2, 1, 0],
        [0, 2, 0], [1, 2, 0], [2, 2, 0],
        [3, 1, 0], [3, 2, 0], [4, 2, 0],
      ]);
    }
    case 'smallwin': {
      // Minimum cluster (5 cells) of low-payout Card (id 7)
      return buildNoiseGrid([
        [0, 0, 7], [1, 0, 7], [2, 0, 7], [0, 1, 7], [1, 1, 7],
      ]);
    }
    case 'chain1': {
      // One cluster, no follow-up
      return buildNoiseGrid([
        [0, 4, 6], [1, 4, 6], [2, 4, 6], [3, 4, 6], [4, 4, 6],
      ]);
    }
    case 'chain2': {
      // First cluster on bottom row; symbols above are arranged so when they drop, a 2nd cluster forms
      // Bottom row: 5x cluster of id 6
      // Row above bottom: prearrange id 4 in same columns so they fall and form cluster
      return buildNoiseGrid([
        // Bottom cluster (will explode first)
        [0, 4, 6], [1, 4, 6], [2, 4, 6], [3, 4, 6], [4, 4, 6],
        // Row 3: id 4 across — after bottom removed, these drop to bottom; combined with row2 forms cluster
        [0, 3, 4], [1, 3, 4], [2, 3, 4], [3, 3, 4], [4, 3, 4],
      ]);
    }
    case 'chain3': {
      // Three stacked rows that will cascade in sequence
      return buildNoiseGrid([
        [0, 4, 6], [1, 4, 6], [2, 4, 6], [3, 4, 6], [4, 4, 6],
        [0, 3, 4], [1, 3, 4], [2, 3, 4], [3, 3, 4], [4, 3, 4],
        [0, 2, 2], [1, 2, 2], [2, 2, 2], [3, 2, 2], [4, 2, 2],
      ]);
    }
    case 'teaserHit': {
      return buildNoiseGrid([
        [0, 1, 8],
        [2, 3, 8],
        [4, 2, 8],
      ]);
    }
    case 'teaserMiss': {
      return buildNoiseGrid([
        [0, 1, 8],
        [3, 3, 8],
      ]);
    }
  }
}
