import { JourneyGrid } from "./JourneyGrid";
import { useProtocol } from "@/hooks/useProtocol";
import { PROTOCOL_LENGTH } from "@/lib/protocol";
import { Check, Flame, XCircle, Zap } from "lucide-react";

export function Journey() {
  const { state, stats, dayNumber } = useProtocol();
  if (!state || !stats) return null;

  const dayClamped = Math.max(0, Math.min(PROTOCOL_LENGTH, dayNumber));
  const pct = Math.round((dayClamped / PROTOCOL_LENGTH) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HERO */}
      <header className="space-y-4">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-primary text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5">
              Jornada · 40 Dias de Base
            </p>
            <h1 className="text-display text-3xl sm:text-4xl font-bold leading-none">
              Sua trilha
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              Dia atual
            </p>
            <p className="text-display text-3xl font-bold tabular-nums leading-none mt-1">
              <span className="text-primary">{dayClamped}</span>
              <span className="text-muted-foreground/50">/{PROTOCOL_LENGTH}</span>
            </p>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="space-y-1.5">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-ember transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground/70 font-bold">
            <span>{pct}% concluído</span>
            <span>{Math.max(0, PROTOCOL_LENGTH - dayClamped)} dias restantes</span>
          </div>
        </div>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          icon={<Zap className="h-4 w-4" />}
          label="Fortes"
          value={stats.fortes}
          tone="success"
        />
        <KpiCard
          icon={<Check className="h-4 w-4" />}
          label="Mínimos"
          value={stats.minimos}
          tone="accent"
        />
        <KpiCard
          icon={<XCircle className="h-4 w-4" />}
          label="Perdidos"
          value={stats.perdidos}
          tone="primary"
        />
        <KpiCard
          icon={<Flame className="h-4 w-4" />}
          label="Streak"
          value={stats.streak}
          tone="ember"
        />
      </section>

      {/* Calendário */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-[10px] uppercase tracking-widest text-foreground/60 font-bold">
            Calendário
          </h2>
          <Legend />
        </div>
        <JourneyGrid />
      </section>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "success" | "accent" | "primary" | "ember";
}) {
  const toneMap = {
    success: "text-[hsl(var(--success))] bg-[hsl(var(--success))]/10 border-[hsl(var(--success))]/30",
    accent: "text-accent bg-accent/10 border-accent/30",
    primary: "text-primary bg-primary/10 border-primary/30",
    ember: "text-primary bg-gradient-ember/10 border-primary/30",
  } as const;

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
          {label}
        </p>
        <span className={`h-7 w-7 rounded-full border flex items-center justify-center ${toneMap[tone]}`}>
          {icon}
        </span>
      </div>
      <p className="text-display text-3xl font-bold tabular-nums leading-none">{value}</p>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-3 flex-wrap text-[10px] uppercase tracking-widest font-bold">
      <LegendItem color="bg-[hsl(var(--success))]" label="Completo" />
      <LegendItem color="bg-destructive" label="Perdido" />
      <LegendItem color="bg-muted-foreground/40" label="Futuro" />
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground/70">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}
