import { useProtocol } from "@/hooks/useProtocol";
import { JourneyGrid } from "./JourneyGrid";

export function Journey() {
  const { stats } = useProtocol();
  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Dias Fortes" value={stats.fortes} accent="text-[hsl(var(--success))]" />
        <Stat label="Dias Mínimos" value={stats.minimos} accent="text-accent" />
        <Stat label="Dias Perdidos" value={stats.perdidos} accent="text-destructive" />
        <Stat label="🔥 Streak" value={`${stats.streak}d`} accent="text-primary" />
      </div>

      <JourneyGrid />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number | string; accent: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-card">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{label}</p>
      <p className={`text-display text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}
