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
        <div className="flex items-center gap-4 mt-4">
          <Donut value={pct} />
          <div className="text-sm flex-1 min-w-0">
            <p className="text-[hsl(140_70%_55%)] font-bold text-[15px]">
              {dayShown} de {PROTOCOL_LENGTH} dias
            </p>
            <p className="text-muted-foreground text-[12px] leading-snug mt-1">
              Meta: {Math.round(TARGET_CONSISTENCY * 100)}% para liberar
              <br />
              sua missão final.
            </p>
          </div>
        </div>
        <button
          onClick={onGoJornada}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-[#0d0e12] hover:bg-[#15171c] border border-border/70 rounded-md py-2.5 text-[12px] font-extrabold uppercase tracking-[0.18em] text-foreground transition-colors"
        >
          Ver Jornada <ChevronRight className="h-4 w-4" />
        </button>
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

      {/* Recompensa */}
      <Card>
        <Label>Recompensa</Label>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xl">📱</span>
          <p className="text-sm font-bold uppercase tracking-wider">Celular Novo</p>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Missão Final</p>
        <div className="mt-4 flex items-center gap-2 text-xs">
          {onTrack ? (
            <Unlock className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
          ) : (
            <Lock className="h-3.5 w-3.5 text-primary" />
          )}
          <span className="font-semibold uppercase tracking-wider text-foreground/80">
            Liberado com {Math.round(TARGET_CONSISTENCY * 100)}% · Agora{" "}
            <strong className={onTrack ? "text-[hsl(var(--success))]" : "text-primary"}>
              {consistPct}%
            </strong>
          </span>
        </div>
      </Card>

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
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">
      {children}
    </div>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative pl-3">
      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-3 w-[3px] rounded-sm bg-primary" />
      <p className="text-[11px] uppercase tracking-[0.2em] text-foreground font-extrabold">
        {children}
      </p>
    </div>
  );
}

function Donut({ value }: { value: number }) {
  const r = 32;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative h-[84px] w-[84px] shrink-0">
      <svg viewBox="0 0 84 84" className="-rotate-90 h-full w-full">
        <circle cx="42" cy="42" r={r} stroke="hsl(var(--secondary))" strokeWidth="7" fill="none" />
        <circle
          cx="42" cy="42" r={r}
          stroke="hsl(140 70% 50%)"
          strokeWidth="7" fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-display text-[20px] font-extrabold text-foreground">
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