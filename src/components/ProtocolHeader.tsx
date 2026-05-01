import { useProtocol } from "@/hooks/useProtocol";
import { PROTOCOL_LENGTH, TARGET_CONSISTENCY } from "@/lib/protocol";
import { Flame, Lock, Unlock } from "lucide-react";

export function ProtocolHeader() {
  const { stats, dayNumber } = useProtocol();
  if (!stats) return null;
  const dayShown = Math.min(PROTOCOL_LENGTH, Math.max(1, dayNumber));
  const consistPct = Math.round(stats.consistencia * 100);
  const onTrack = stats.consistencia >= TARGET_CONSISTENCY;

  return (
    <header className="bg-gradient-blood border-b border-border">
      <div className="px-5 sm:px-8 pt-6 pb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Protocolo</p>
            <h1 className="text-display text-3xl sm:text-4xl font-bold leading-none">
              40 Dias de Base
            </h1>
          </div>
          <div className="flex items-center gap-8">
            <Stat label="Dia" value={`${dayShown}/${PROTOCOL_LENGTH}`} />
            <StatStreak value={stats.streak} />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 bg-background/40 border border-border/60 rounded-md px-4 py-3">
          <span className="text-sm flex items-center gap-2">
            📱 <span className="font-bold uppercase tracking-wider text-sm">Missão Final:</span>{" "}
            <span className="font-bold uppercase tracking-wider">Celular Novo</span>
          </span>
          <span className="text-xs flex items-center gap-2 text-foreground/80">
            {onTrack ? (
              <Unlock className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
            ) : (
              <Lock className="h-3.5 w-3.5" />
            )}
            <span className="font-semibold uppercase tracking-wider">
              Liberado com 80% · Agora{" "}
              <strong className={onTrack ? "text-[hsl(var(--success))]" : "text-primary"}>
                {consistPct}%
              </strong>
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-[10px] uppercase tracking-widest text-foreground/60 font-bold">{label}</p>
      <p className="text-display text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function StatStreak({ value }: { value: number }) {
  return (
    <div className="text-center">
      <p className="text-[10px] uppercase tracking-widest text-foreground/60 font-bold">Streak</p>
      <p className="text-display text-2xl font-bold mt-1 inline-flex items-center gap-1.5">
        <Flame className="h-5 w-5 text-primary fill-primary/40" />
        {value}
      </p>
    </div>
  );
}
