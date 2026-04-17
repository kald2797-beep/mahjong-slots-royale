import { useState, useCallback, useRef } from 'react';
import { GameState, Grid, WinCluster, FreeSpinState } from './types';
import { createGrid, findClusters, removeWinning, getMultiplier, calculateWin, countScatters, getFreeSpinCount, getRetriggerSpins, transformToGoldenWilds } from './engine';
import { buildForcedGrid, DevForceMode } from './devForce';
import { useAudio } from './useAudio';

const INITIAL_BALANCE = 1000;
const BET_OPTIONS = [0.5, 1, 2, 5, 10, 20];

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const INITIAL_FREE_SPIN: FreeSpinState = {
  active: false,
  totalSpins: 0,
  remainingSpins: 0,
  totalWin: 0,
  multiplier: 1,
  phase: 'inactive',
};

export function useGameState() {
  const [state, setState] = useState<GameState>({
    grid: createGrid(),
    balance: INITIAL_BALANCE,
    bet: 1,
    totalWin: 0,
    currentWin: 0,
    multiplier: 1,
    cascadeCount: 0,
    isSpinning: false,
    isAutoSpin: false,
    winClusters: [],
    phase: 'idle',
    freeSpin: INITIAL_FREE_SPIN,
    scatterPositions: [],
    teaserActive: false,
    teaserHit: false,
  });

  const autoSpinRef = useRef(false);
  const { play } = useAudio();

  const runCascadeLoop = useCallback(async (
    grid: Grid, bet: number, cascadeCount: number, accumulatedWin: number, isFreeSpins: boolean, fsMultiplier: number
  ) => {
    const clusters = findClusters(grid);

    if (clusters.length === 0) {
      return { grid, totalWin: accumulatedWin, cascadeCount, fsMultiplier };
    }

    const multiplier = isFreeSpins
      ? fsMultiplier
      : getMultiplier(cascadeCount);
    const win = calculateWin(clusters, bet, multiplier);

    // Show winning clusters
    setState(s => ({ ...s, winClusters: clusters, phase: 'revealing', multiplier, currentWin: win }));
    play(win > bet * 10 ? 'bigWin' : 'win');
    await delay(800);

    // During free spins, transform adjacent cells to golden wilds
    let transformedGrid = grid;
    if (isFreeSpins) {
      transformedGrid = transformToGoldenWilds(grid, clusters);
      if (transformedGrid !== grid) {
        setState(s => ({ ...s, grid: transformedGrid }));
        await delay(300);
      }
    }

    // Explode
    setState(s => ({ ...s, phase: 'exploding' }));
    play('cascade');
    await delay(400);

    // Remove and cascade
    const newGrid = removeWinning(transformedGrid, clusters, isFreeSpins);
    
    // Increase free spin multiplier on each cascade
    const newFsMultiplier = isFreeSpins
      ? getMultiplier(cascadeCount + 1, true)
      : fsMultiplier;

    setState(s => ({
      ...s,
      grid: newGrid,
      winClusters: [],
      phase: 'cascading',
      totalWin: accumulatedWin + win,
      cascadeCount: cascadeCount + 1,
      ...(isFreeSpins ? {
        freeSpin: { ...s.freeSpin, totalWin: s.freeSpin.totalWin + win, multiplier: newFsMultiplier }
      } : {}),
    }));
    play('reelDrop');
    await delay(500);

    // Check for retrigger scatters during free spins
    if (isFreeSpins) {
      const scatters = countScatters(newGrid);
      if (scatters.length >= 2) {
        const extraSpins = getRetriggerSpins(scatters.length);
        if (extraSpins > 0) {
          setState(s => ({
            ...s,
            scatterPositions: scatters,
            freeSpin: {
              ...s.freeSpin,
              remainingSpins: s.freeSpin.remainingSpins + extraSpins,
              totalSpins: s.freeSpin.totalSpins + extraSpins,
            }
          }));
          play('bigWin');
          await delay(600);
          setState(s => ({ ...s, scatterPositions: [] }));
        }
      }
    }

    return runCascadeLoop(newGrid, bet, cascadeCount + 1, accumulatedWin + win, isFreeSpins, newFsMultiplier);
  }, [play]);

  const runFreeSpins = useCallback(async (totalSpins: number, bet: number) => {
    // Intro
    setState(s => ({
      ...s,
      freeSpin: {
        active: true,
        totalSpins,
        remainingSpins: totalSpins,
        totalWin: 0,
        multiplier: 2,
        phase: 'intro',
      }
    }));
    play('bigWin');
    await delay(2500);

    // Run each free spin
    let fsState: FreeSpinState = {
      active: true,
      totalSpins,
      remainingSpins: totalSpins,
      totalWin: 0,
      multiplier: 2,
      phase: 'spinning',
    };

    while (fsState.remainingSpins > 0) {
      // Update remaining
      fsState = { ...fsState, remainingSpins: fsState.remainingSpins - 1, phase: 'spinning' };
      setState(s => ({
        ...s,
        freeSpin: fsState,
        phase: 'clearing',
        totalWin: 0,
        currentWin: 0,
        cascadeCount: 0,
        winClusters: [],
        scatterPositions: [],
      }));
      play('spin');
      await delay(400);

      const newGrid = createGrid(true);
      setState(s => ({ ...s, grid: newGrid, phase: 'spinning' }));
      play('reelDrop');
      await delay(700);

      // Note: free spin multiplier does NOT reset between spins
      const result = await runCascadeLoop(newGrid, bet, 0, 0, true, fsState.multiplier);

      // Get latest freeSpin state (may have been updated by retrigger)
      let latestFs = fsState;
      setState(s => {
        latestFs = s.freeSpin;
        return s;
      });
      
      fsState = {
        ...latestFs,
        totalWin: latestFs.totalWin,
        multiplier: latestFs.multiplier, // persistent multiplier
      };

      setState(s => ({
        ...s,
        grid: result.grid,
        totalWin: result.totalWin,
        phase: 'idle',
        winClusters: [],
      }));

      await delay(600);
    }

    // Summary
    const finalWin = fsState.totalWin;
    setState(s => ({
      ...s,
      freeSpin: { ...s.freeSpin, phase: 'summary' },
    }));
    play('bigWin');
    await delay(4000);

    // Exit free spins
    setState(s => ({
      ...s,
      balance: s.balance + finalWin,
      totalWin: finalWin,
      freeSpin: INITIAL_FREE_SPIN,
      isSpinning: false,
      scatterPositions: [],
    }));
  }, [play, runCascadeLoop]);

  const spin = useCallback(async (devMode?: DevForceMode) => {
    let currentBet = 1;
    setState(s => {
      if (s.isSpinning || s.balance < s.bet) return s;
      currentBet = s.bet;
      return {
        ...s,
        isSpinning: true,
        phase: 'clearing',
        balance: s.balance - s.bet,
        totalWin: 0,
        currentWin: 0,
        multiplier: 1,
        cascadeCount: 0,
        winClusters: [],
        scatterPositions: [],
      };
    });

    play('spin');
    await delay(400);

    const newGrid = devMode ? buildForcedGrid(devMode) : createGrid();

    setState(s => {
      if (!s.isSpinning && s.phase !== 'clearing') return s;
      currentBet = s.bet;
      return { ...s, grid: newGrid, phase: 'spinning' };
    });
    play('reelDrop');
    await delay(700);

    // Check for scatters
    const scatters = countScatters(newGrid);
    if (scatters.length >= 3) {
      // Show scatter highlight
      setState(s => ({ ...s, scatterPositions: scatters }));
      play('bigWin');
      await delay(1200);

      const freeSpinCount = getFreeSpinCount(scatters.length);

      // First run cascade on current grid
      const result = await runCascadeLoop(newGrid, currentBet, 0, 0, false, 1);
      setState(s => ({
        ...s,
        grid: result.grid,
        balance: s.balance + result.totalWin,
        totalWin: result.totalWin,
        phase: 'idle',
        winClusters: [],
      }));

      // Then start free spins
      await runFreeSpins(freeSpinCount, currentBet);
      return result.totalWin;
    }

    const result = await runCascadeLoop(newGrid, currentBet, 0, 0, false, 1);

    setState(s => ({
      ...s,
      grid: result.grid,
      balance: s.balance + result.totalWin,
      totalWin: result.totalWin,
      isSpinning: false,
      phase: 'idle',
      winClusters: [],
    }));

    if (autoSpinRef.current) {
      await delay(500);
    }

    return result.totalWin;
  }, [play, runCascadeLoop, runFreeSpins]);

  const setBet = useCallback((bet: number) => {
    setState(s => s.isSpinning ? s : { ...s, bet });
  }, []);

  const toggleAutoSpin = useCallback(() => {
    setState(s => {
      const newAuto = !s.isAutoSpin;
      autoSpinRef.current = newAuto;
      return { ...s, isAutoSpin: newAuto };
    });
  }, []);

  return {
    state,
    spin,
    setBet,
    toggleAutoSpin,
    betOptions: BET_OPTIONS,
    autoSpinRef,
  };
}
