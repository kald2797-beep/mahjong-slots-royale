interface ControlsProps {
  onSpin: () => void;
  isSpinning: boolean;
  bet: number;
  betOptions: number[];
  onBetChange: (bet: number) => void;
  isAutoSpin: boolean;
  onToggleAutoSpin: () => void;
  canSpin: boolean;
}

export function Controls({
  onSpin,
  isSpinning,
  bet,
  betOptions,
  onBetChange,
  isAutoSpin,
  onToggleAutoSpin,
  canSpin,
}: ControlsProps) {
  const currentIdx = betOptions.indexOf(bet);

  const decreaseBet = () => {
    if (currentIdx > 0) onBetChange(betOptions[currentIdx - 1]);
  };

  const increaseBet = () => {
    if (currentIdx < betOptions.length - 1) onBetChange(betOptions[currentIdx + 1]);
  };

  return (
    <div className="game-panel rounded-xl px-3 py-3 sm:px-4 sm:py-4">
      <div className="flex items-center justify-between gap-2">
        {/* Bet controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={decreaseBet}
            disabled={isSpinning || currentIdx <= 0}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted text-foreground font-bold text-lg 
                       disabled:opacity-30 active:scale-95 transition-transform"
          >
            −
          </button>
          <div className="w-14 sm:w-16 text-center">
            <div className="text-[10px] text-muted-foreground uppercase">Bet</div>
            <div className="font-bold text-primary text-sm">${bet}</div>
          </div>
          <button
            onClick={increaseBet}
            disabled={isSpinning || currentIdx >= betOptions.length - 1}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted text-foreground font-bold text-lg
                       disabled:opacity-30 active:scale-95 transition-transform"
          >
            +
          </button>
        </div>

        {/* Spin button */}
        <button
          onClick={onSpin}
          disabled={isSpinning || !canSpin}
          className="spin-button w-16 h-16 sm:w-20 sm:h-20 rounded-full font-display font-bold 
                     text-primary-foreground text-sm sm:text-base disabled:opacity-50 
                     flex items-center justify-center"
        >
          {isSpinning ? (
            <span className="animate-spin text-xl">⟳</span>
          ) : (
            'SPIN'
          )}
        </button>

        {/* Auto spin */}
        <button
          onClick={onToggleAutoSpin}
          disabled={isSpinning && !isAutoSpin}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl font-bold text-xs uppercase tracking-wider
                     transition-all active:scale-95
                     ${isAutoSpin 
                       ? 'bg-accent text-accent-foreground glow-green' 
                       : 'bg-muted text-muted-foreground'
                     }`}
        >
          {isAutoSpin ? 'STOP' : 'AUTO'}
        </button>
      </div>
    </div>
  );
}
