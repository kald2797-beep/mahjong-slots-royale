interface TopBarProps {
  balance: number;
  bet: number;
  totalWin: number;
  multiplier: number;
  cascadeCount: number;
}

export function TopBar({ balance, bet, totalWin, multiplier, cascadeCount }: TopBarProps) {
  return (
    <div className="game-panel rounded-xl px-3 py-2 sm:px-4 sm:py-3">
      {/* Title */}
      <h1 className="font-display text-center text-lg sm:text-xl font-bold text-primary glow-gold-text mb-2">
        🀄 Mahjong Ways
      </h1>

      {/* Stats row */}
      <div className="flex justify-between items-center text-xs sm:text-sm">
        <div className="text-center">
          <div className="text-muted-foreground uppercase tracking-wider text-[10px]">Balance</div>
          <div className="font-bold text-foreground">${balance.toFixed(2)}</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground uppercase tracking-wider text-[10px]">Bet</div>
          <div className="font-bold text-primary">${bet.toFixed(2)}</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground uppercase tracking-wider text-[10px]">Win</div>
          <div className={`font-bold ${totalWin > 0 ? 'text-accent glow-gold-text' : 'text-foreground'}`}>
            ${totalWin.toFixed(2)}
          </div>
        </div>
        {cascadeCount > 0 && (
          <div className="text-center">
            <div className="text-muted-foreground uppercase tracking-wider text-[10px]">Multi</div>
            <div className="font-bold text-neon-green">x{multiplier}</div>
          </div>
        )}
      </div>
    </div>
  );
}
