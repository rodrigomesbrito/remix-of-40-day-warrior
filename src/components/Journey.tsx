import { useProtocol } from "@/hooks/useProtocol";
import { JourneyGrid } from "./JourneyGrid";
import { PROTOCOL_LENGTH, TARGET_CONSISTENCY } from "@/lib/protocol";
import { Progress } from "@/components/ui/progress";

export function Journey() {
  const { stats, dayNumber } = useProtocol();
  if (!stats) return null;

  const pct = Math.round(stats.consistencia * 100);
  const onTrack = stats.consistencia >= TARGET_CONSISTENCY;
  const dayProgress = Math.min(PROTOCOL_LENGTH, Math.max(0, dayNumber)) / PROTOCOL_LENGTH * 100;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Dias Fortes" value={stats.fortes} accent="text-[hsl(var(--success))]" />
        <Stat label="Dias Mínimos" value={stats.minimos} accent="text-accent" />
        <Stat label="Dias Perdidos" value={stats.perdidos} accent="text-destructive-foreground" />
        <Stat label="Streak" value={stats.streak} accent="text-primary" />
      </div>

      <div className="bg-card border border-border rounded-lg p-5 shadow-card">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-display text-sm text-muted-foreground">Consistência</span>
          <span className={`text-display text-2xl font-bold ${onTrack ? "text-[hsl(var(--success))]" : "text-accent"}`}>
            {pct}%
          </span>
        </div>
        <Progress value={pct} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          Meta: {Math.round(TARGET_CONSISTENCY * 100)}% para liberar a recompensa final 📱
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-5 shadow-card">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-display text-sm text-muted-foreground">Progresso dos 40 dias</span>
          <span className="text-display font-semibold">{Math.min(PROTOCOL_LENGTH, dayNumber)}/{PROTOCOL_LENGTH}</span>
        </div>
        <Progress value={dayProgress} className="h-2" />
      </div>

      <div>
        <h3 className="text-display text-xl font-semibold mb-3">Jornada</h3>
        <JourneyGrid />
        <p className="text-xs text-muted-foreground mt-3">
          Toque em um dia para ver ou editar o registro.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-card">
      <p className="text-display text-xs text-muted-foreground">{label}</p>
      <p className={`text-display text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}
