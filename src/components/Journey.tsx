import { useProtocol } from "@/hooks/useProtocol";
import { JourneyGrid } from "./JourneyGrid";
import { TARGET_CONSISTENCY } from "@/lib/protocol";
import { Progress } from "@/components/ui/progress";

export function Journey() {
  const { stats } = useProtocol();
  if (!stats) return null;

  const pct = Math.round(stats.consistencia * 100);
  const onTrack = stats.consistencia >= TARGET_CONSISTENCY;
  const validos = stats.fortes + stats.minimos;
  const decorridos = Math.max(1, stats.diasDecorridos);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Dias Fortes" value={stats.fortes} accent="text-[hsl(var(--success))]" />
        <Stat label="Dias Mínimos" value={stats.minimos} accent="text-accent" />
        <Stat label="Dias Perdidos" value={stats.perdidos} accent="text-destructive-foreground" />
        <Stat label="🔥 Streak" value={`${stats.streak}d`} accent="text-primary" />
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
          {validos}/{decorridos} dias válidos · meta {Math.round(TARGET_CONSISTENCY * 100)}% para liberar a recompensa 📱
        </p>
      </div>

      <div className="bg-gradient-blood border border-primary/40 rounded-lg p-5 shadow-deep">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-display text-lg font-bold tracking-wide">🏁 MISSÃO FINAL</h3>
          <span
            className={`text-display text-xs px-2 py-1 rounded ${
              onTrack
                ? "bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]"
                : "bg-accent/20 text-accent"
            }`}
          >
            {onTrack ? "🔓 No caminho" : "🔒 Em progresso"}
          </span>
        </div>
        <p className="text-display text-2xl font-bold mb-1">📱 Celular novo</p>
        <p className="text-sm text-foreground/80 mb-4">
          Meta: <strong>{Math.round(TARGET_CONSISTENCY * 100)}%</strong> de consistência ·
          progresso: <strong>{pct}%</strong>
        </p>
        <Progress value={pct} className="h-3" />
        <p className="text-xs text-foreground/70 mt-3 italic">
          💰 Preferencialmente pago com o dinheiro gerado durante o protocolo.
        </p>
      </div>

      <div>
        <h3 className="text-display text-xl font-semibold mb-3">Jornada</h3>
        <JourneyGrid />
        <p className="text-xs text-muted-foreground mt-3">
          Toque em um dia para revisar sua execução.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number | string; accent: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-card">
      <p className="text-display text-xs text-muted-foreground">{label}</p>
      <p className={`text-display text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}
