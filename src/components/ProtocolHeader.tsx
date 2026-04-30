import { useProtocol } from "@/hooks/useProtocol";
import { PROTOCOL_LENGTH } from "@/lib/protocol";

export function ProtocolHeader() {
  const { stats, dayNumber } = useProtocol();
  if (!stats) return null;
  const dayShown = Math.min(PROTOCOL_LENGTH, Math.max(1, dayNumber));

  return (
    <header className="bg-gradient-blood border-b border-border shadow-deep">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-display text-xs text-accent">PROTOCOLO</p>
          <h1 className="text-display text-3xl sm:text-4xl font-bold leading-none">
            40 Dias de Base
          </h1>
        </div>
        <div className="flex items-center gap-5 text-display">
          <Stat label="Dia" value={`${dayShown}/${PROTOCOL_LENGTH}`} />
          <Stat label="Streak" value={`${stats.streak}🔥`} />
          <Stat label="Consist." value={`${Math.round(stats.consistencia * 100)}%`} />
        </div>
      </div>
    </header>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <p className="text-[10px] uppercase tracking-widest text-foreground/60">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
