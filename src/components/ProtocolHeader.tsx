import { useProtocol } from "@/hooks/useProtocol";
import { PROTOCOL_LENGTH, TARGET_CONSISTENCY } from "@/lib/protocol";
import { Flame } from "lucide-react";

export function ProtocolHeader() {
  const { stats, dayNumber } = useProtocol();
  if (!stats) return null;
  const dayShown = Math.min(PROTOCOL_LENGTH, Math.max(1, dayNumber));

  return (
    <header
      className="border-b border-border"
      style={{
        backgroundImage:
          "linear-gradient(135deg, hsl(0 70% 32% / 0.18) 0%, hsl(0 0% 8% / 0) 70%)",
      }}
    >
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
