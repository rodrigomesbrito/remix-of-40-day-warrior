import { ChevronRight, Flame, Trophy, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProtocol } from "@/hooks/useProtocol";
import { PROTOCOL_LENGTH, TARGET_CONSISTENCY, classifyDay, emptyDay } from "@/lib/protocol";
import { useMeta } from "@/hooks/useMeta";
import { usePendencias } from "@/hooks/usePendencias";
import { Progress } from "@/components/ui/progress";

interface Props {
  onGoJornada: () => void;
  onGoMeta: () => void;
  onGoPendencias: () => void;
}

export function RightRail({ onGoJornada, onGoMeta, onGoPendencias }: Props) {
  const { state, stats, dayNumber } = useProtocol();
  const { meta } = useMeta();
  const { items: pend } = usePendencias();
  if (!state || !stats) return null;

  const dayShown = Math.min(PROTOCOL_LENGTH, Math.max(1, dayNumber));
  const pct = Math.round((dayShown / PROTOCOL_LENGTH) * 100);
  const today = state.days[dayNumber] ?? emptyDay();
  const cls = classifyDay(today);
  const bestStreak = computeBestStreak(state);
  const consistPct = Math.round(stats.consistencia * 100);
  const onTrack = stats.consistencia >= TARGET_CONSISTENCY;
  const metaPct = Math.min(100, Math.round((meta.atual / Math.max(1, meta.alvo)) * 100));
  const abertas = pend.filter((p) => !p.feita);
  const topAbertas = [...abertas]
    .sort((a, b) => {
      const order: Record<string, number> = { alta: 0, media: 1, baixa: 2 };
      return order[a.prioridade] - order[b.prioridade];
    })
    .slice(0, 3);

  return (
    <aside className="hidden xl:flex flex-col gap-4 w-[320px] shrink-0">
      {/* Progresso geral */}
      <Card>
        <Label>Progresso Geral</Label>
        <div className="flex items-center gap-4 mt-3">
          <Donut value={pct} />
          <div className="text-sm">
            <p className="text-[hsl(var(--success))] font-semibold">
              {dayShown} de {PROTOCOL_LENGTH} dias
            </p>
            <p className="text-muted-foreground text-xs leading-snug mt-1">
              Meta: {Math.round(TARGET_CONSISTENCY * 100)}% para liberar<br />sua missão final.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full mt-4 justify-between" onClick={onGoJornada}>
          Ver Jornada <ChevronRight className="h-4 w-4" />
        </Button>
      </Card>

      {/* Sequência atual */}
      <Card>
        <Label>Sequência Atual</Label>
        <div className="flex items-center gap-3 mt-3">
          <Flame className="h-10 w-10 text-primary fill-primary/30" />
          <span className="text-display text-4xl font-bold">{stats.streak}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Melhor sequência: {bestStreak} dia{bestStreak === 1 ? "" : "s"}
        </p>
      </Card>

      {/* Missão Final (recompensa) */}
      <Card>
        <div className="flex items-center justify-between">
          <Label>Missão Final</Label>
          <Trophy className="h-4 w-4 text-accent" />
        </div>
        <p className="text-display text-xl font-bold mt-3 leading-tight">📱 Celular novo</p>
        <p className="text-xs text-muted-foreground mt-1">
          Liberado com {Math.round(TARGET_CONSISTENCY * 100)}% de consistência
        </p>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Consistência</span>
            <span className={onTrack ? "text-[hsl(var(--success))] font-bold" : "text-accent font-bold"}>
              {consistPct}%
            </span>
          </div>
          <Progress value={consistPct} className="h-2" />
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Meta de produção</span>
            <span className="text-foreground/90 font-bold">{metaPct}%</span>
          </div>
          <Progress value={metaPct} className="h-2" />
        </div>
        <Button variant="outline" size="sm" className="w-full mt-4 justify-between" onClick={onGoMeta}>
          Ver Meta <ChevronRight className="h-4 w-4" />
        </Button>
      </Card>

      {/* Pendências (resumo leve) */}
      <Card>
        <div className="flex items-center justify-between">
          <Label>Pendências</Label>
          <ClipboardList className="h-4 w-4 text-primary" />
        </div>
        {abertas.length === 0 ? (
          <p className="text-sm mt-3 text-muted-foreground">Nenhuma pendência aberta. ⚔️</p>
        ) : (
          <>
            <p className="text-display text-3xl font-bold mt-2 text-primary leading-none">
              {abertas.length}
              <span className="text-sm text-muted-foreground font-normal ml-2">aberta{abertas.length === 1 ? "" : "s"}</span>
            </p>
            <ul className="mt-3 space-y-1.5">
              {topAbertas.map((p) => (
                <li key={p.id} className="flex items-center gap-2 text-xs text-foreground/85">
                  <span
                    className={
                      "inline-block h-1.5 w-1.5 rounded-full shrink-0 " +
                      (p.prioridade === "alta"
                        ? "bg-primary"
                        : p.prioridade === "media"
                        ? "bg-accent"
                        : "bg-muted-foreground")
                    }
                  />
                  <span className="truncate">{p.titulo}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        <Button variant="outline" size="sm" className="w-full mt-4 justify-between" onClick={onGoPendencias}>
          Ver Pendências <ChevronRight className="h-4 w-4" />
        </Button>
      </Card>

      {cls && null}
    </aside>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">{children}</div>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{children}</p>
  );
}

function Donut({ value }: { value: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative h-[72px] w-[72px]">
      <svg viewBox="0 0 72 72" className="-rotate-90 h-full w-full">
        <circle cx="36" cy="36" r={r} stroke="hsl(var(--secondary))" strokeWidth="6" fill="none" />
        <circle
          cx="36" cy="36" r={r}
          stroke="hsl(var(--success))"
          strokeWidth="6" fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-display text-base font-bold">
        {value}%
      </span>
    </div>
  );
}

function computeBestStreak(state: ReturnType<typeof useProtocol>["state"]): number {
  if (!state) return 0;
  let best = 0, cur = 0;
  for (let i = 1; i <= PROTOCOL_LENGTH; i++) {
    const d = state.days[i];
    if (d && d.classificacao !== "perdido") {
      cur++;
      if (cur > best) best = cur;
    } else if (d) {
      cur = 0;
    }
  }
  return best;
}