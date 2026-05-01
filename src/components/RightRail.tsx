import { Bell, ChevronRight, Flame, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProtocol } from "@/hooks/useProtocol";
import { PROTOCOL_LENGTH, TARGET_CONSISTENCY, classifyDay, emptyDay } from "@/lib/protocol";

interface Props {
  onGoJornada: () => void;
}

export function RightRail({ onGoJornada }: Props) {
  const { state, stats, dayNumber } = useProtocol();
  if (!state || !stats) return null;

  const dayShown = Math.min(PROTOCOL_LENGTH, Math.max(1, dayNumber));
  const pct = Math.round((dayShown / PROTOCOL_LENGTH) * 100);
  const today = state.days[dayNumber] ?? emptyDay();
  const cls = classifyDay(today);
  const bestStreak = computeBestStreak(state);
  const consistPct = Math.round(stats.consistencia * 100);
  const onTrack = stats.consistencia >= TARGET_CONSISTENCY;

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

      {/* Recompensa — destaque */}
      <div
        className="relative overflow-hidden rounded-xl border border-primary/30 p-5 shadow-card"
        style={{
          backgroundImage:
            "linear-gradient(135deg, hsl(0 70% 18% / 0.6) 0%, hsl(0 0% 9% / 0.95) 65%)",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full"
          style={{ background: "radial-gradient(circle, hsl(0 85% 55% / 0.35), transparent 70%)" }}
        />
        <div className="relative">
          <Label>Recompensa</Label>
          <div className="flex items-center gap-3 mt-3">
            <div className="h-10 w-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-xl">
              📱
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider leading-none">Celular Novo</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Missão Final</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold mb-1.5">
              <span className="text-muted-foreground">Consistência</span>
              <span className={onTrack ? "text-[hsl(var(--success))]" : "text-primary"}>
                {consistPct}% / {Math.round(TARGET_CONSISTENCY * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full transition-all ${onTrack ? "bg-[hsl(var(--success))]" : "bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))]"}`}
                style={{ width: `${Math.min(100, consistPct)}%` }}
              />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px]">
            {onTrack ? (
              <>
                <Unlock className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
                <span className="font-semibold uppercase tracking-wider text-[hsl(var(--success))]">
                  Recompensa liberada
                </span>
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5 text-primary" />
                <span className="font-semibold uppercase tracking-wider text-foreground/70">
                  Faltam {Math.max(0, Math.round(TARGET_CONSISTENCY * 100) - consistPct)}% para liberar
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Lembrete */}
      <Card>
        <div className="flex items-center justify-between">
          <Label>Lembrete</Label>
          <Bell className="h-4 w-4 text-primary" />
        </div>
        <p className="text-sm mt-3 leading-snug text-foreground/85">
          O que você faz todos os dias, define quem você se torna.
        </p>
        <p className="text-sm text-primary font-bold mt-2">Não quebre a corrente.</p>
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