import { useProtocol } from "@/hooks/useProtocol";
import { JourneyGrid } from "./JourneyGrid";
import { PROTOCOL_LENGTH } from "@/lib/protocol";
import { Trophy, BarChart3, Calendar, HelpCircle, Flame } from "lucide-react";

export function Journey() {
  const { stats, dayNumber } = useProtocol();
  if (!stats) return null;

  const concluidos = stats.fortes + stats.minimos;
  const restantes = Math.max(0, PROTOCOL_LENGTH - concluidos);
  const pctConcl = Math.round((concluidos / PROTOCOL_LENGTH) * 100);
  const pctRest = 100 - pctConcl;
  const pctPerd = Math.round((stats.perdidos / PROTOCOL_LENGTH) * 100);

  return (
    <div className="space-y-6">
      {/* Stats com barras */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBar label="Dias Concluídos" value={concluidos} pct={pctConcl} barClass="bg-[hsl(var(--success))]" valueClass="text-[hsl(var(--success))]" />
        <StatBar label="Dias Restantes" value={restantes} pct={pctRest} barClass="bg-accent" valueClass="text-accent" />
        <StatBar label="Dias Perdidos" value={stats.perdidos} pct={pctPerd} barClass="bg-destructive" valueClass="text-destructive" />
        <div className="bg-card border border-border rounded-xl p-4 shadow-card">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">Melhor Streak</p>
          <div className="flex items-baseline gap-2">
            <Flame className="h-6 w-6 text-primary" strokeWidth={2.5} />
            <span className="text-display text-4xl font-bold text-primary leading-none">{stats.streak}</span>
            <span className="text-display text-sm text-primary">dias</span>
          </div>
        </div>
      </div>

      {/* Banner de status */}
      <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4 shadow-card">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[hsl(var(--success))]/15 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-[hsl(var(--success))]" />
          </div>
          <div>
            <p className="font-semibold text-sm">
              {concluidos === 0 ? "Sua jornada começa agora" : concluidos < 5 ? "Excelente começo!" : "Você está construindo consistência"}
            </p>
            <p className="text-xs text-muted-foreground">
              Você já completou {concluidos} {concluidos === 1 ? "dia" : "dias"}. Mantenha o foco e a consistência.
            </p>
          </div>
        </div>
        <button className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground border border-border rounded-md px-3 py-2 hover:bg-secondary/50 transition-colors">
          <BarChart3 className="h-3.5 w-3.5" />
          Ver estatísticas
        </button>
      </div>

      {/* Calendário */}
      <div>
        <h3 className="text-display text-sm font-semibold mb-3 tracking-widest text-muted-foreground">Calendário da Jornada</h3>
        <JourneyGrid />
      </div>

      {/* Rodapé */}
      <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4 shadow-card">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm">Novos dias são liberados diariamente à 00:00.</p>
            <p className="text-xs text-muted-foreground">Um dia de cada vez. Um passo de cada vez.</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          <div className="text-right">
            <p className="text-sm">Como funciona?</p>
            <p className="text-xs text-muted-foreground">Entenda as regras da jornada</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBar({ label, value, pct, barClass, valueClass }: { label: string; value: number; pct: number; barClass: string; valueClass: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-card">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">{label}</p>
      <p className={`text-display text-4xl font-bold ${valueClass} leading-none mb-3`}>{value}</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className={`h-full ${barClass} rounded-full transition-all`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[10px] text-muted-foreground font-medium w-8 text-right">{pct}%</span>
      </div>
    </div>
  );
}
