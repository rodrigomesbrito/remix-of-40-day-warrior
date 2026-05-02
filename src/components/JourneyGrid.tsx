import { useMemo, useState } from "react";
import { useProtocol } from "@/hooks/useProtocol";
import { PROTOCOL_LENGTH } from "@/lib/protocol";
import { cn } from "@/lib/utils";
import { DayDetailDialog } from "./DayDetailDialog";
import { Check, Lock, XCircle } from "lucide-react";

const WEEK_SIZE = 8;

function addDays(iso: string, n: number) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function shortDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
}

function fullDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

type Status = "forte" | "minimo" | "perdido" | "hoje" | "futuro";

function getStatus(rec: { classificacao?: Status } | undefined, isToday: boolean): Status {
  if (rec?.classificacao === "forte") return "forte";
  if (rec?.classificacao === "minimo") return "minimo";
  if (rec?.classificacao === "perdido") return "perdido";
  if (isToday) return "hoje";
  return "futuro";
}

export function JourneyGrid() {
  const { state, dayNumber } = useProtocol();
  const [open, setOpen] = useState<number | null>(null);

  const counts = useMemo(() => {
    if (!state) return { forte: 0, minimo: 0, perdido: 0, registrados: 0 };
    let forte = 0, minimo = 0, perdido = 0;
    Object.values(state.days).forEach((d) => {
      if (d.classificacao === "forte") forte++;
      else if (d.classificacao === "minimo") minimo++;
      else if (d.classificacao === "perdido") perdido++;
    });
    return { forte, minimo, perdido, registrados: forte + minimo + perdido };
  }, [state]);

  if (!state) return null;

  const completos = counts.forte + counts.minimo;
  const progressoPct = Math.round((completos / PROTOCOL_LENGTH) * 100);

  // 5 semanas × 8 dias
  const weeks: number[][] = [];
  for (let w = 0; w < PROTOCOL_LENGTH / WEEK_SIZE; w++) {
    weeks.push(Array.from({ length: WEEK_SIZE }, (_, i) => w * WEEK_SIZE + i + 1));
  }

  return (
    <>
      {/* Header: progresso + legenda */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">
              Calendário da Jornada
            </p>
            <p className="text-display text-2xl font-bold leading-none">
              {completos}
              <span className="text-muted-foreground/60 text-lg font-semibold">
                {" "}/ {PROTOCOL_LENGTH} dias
              </span>
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <LegendDot color="success" label="Completo" />
            <LegendDot color="destructive" label="Perdido" />
            <LegendDot color="muted" label="Bloqueado" />
          </div>
        </div>

        {/* barra de progresso */}
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-ember transition-all duration-500"
            style={{ width: `${progressoPct}%` }}
          />
        </div>
      </div>

      {/* Grade por semanas */}
      <div className="space-y-5">
        {weeks.map((days, wi) => (
          <div key={wi} className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-bold">
                Semana {wi + 1}
              </span>
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-[10px] text-muted-foreground/50 tabular-nums">
                Dia {days[0]}–{days[days.length - 1]}
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-2.5">
              {days.map((n) => {
                const rec = state.days[n];
                const isFuture = n > dayNumber;
                const isToday = n === dayNumber;
                const dateISO = addDays(state.startDate, n - 1);
                const status = getStatus(rec, isToday);

                return (
                  <DayCell
                    key={n}
                    n={n}
                    dateISO={dateISO}
                    status={status}
                    isToday={isToday}
                    disabled={isFuture && !rec}
                    onClick={() => setOpen(n)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <DayDetailDialog dayNumber={open} onClose={() => setOpen(null)} />
    </>
  );
}

function LegendDot({ color, label }: { color: "success" | "destructive" | "muted"; label: string }) {
  const cls =
    color === "success"
      ? "bg-[hsl(var(--success))]"
      : color === "destructive"
      ? "bg-destructive"
      : "bg-muted-foreground/40";
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className={cn("h-2 w-2 rounded-full", cls)} />
      {label}
    </span>
  );
}

interface DayCellProps {
  n: number;
  dateISO: string;
  status: Status;
  isToday: boolean;
  disabled: boolean;
  onClick: () => void;
}

function DayCell({ n, dateISO, status, isToday, disabled, onClick }: DayCellProps) {
  const styles = {
    forte: {
      card: "bg-[hsl(var(--success))]/[0.06] border-[hsl(var(--success))]/40 hover:border-[hsl(var(--success))]/70",
      number: "text-[hsl(var(--success))]",
      icon: <Check className="h-4 w-4 text-[hsl(var(--success))]" strokeWidth={3} />,
      iconWrap: "bg-[hsl(var(--success))]/15 border-[hsl(var(--success))]/40",
    },
    minimo: {
      card: "bg-[hsl(var(--success))]/[0.06] border-[hsl(var(--success))]/40 hover:border-[hsl(var(--success))]/70",
      number: "text-[hsl(var(--success))]",
      icon: <Check className="h-4 w-4 text-[hsl(var(--success))]" strokeWidth={3} />,
      iconWrap: "bg-[hsl(var(--success))]/15 border-[hsl(var(--success))]/40",
    },
    perdido: {
      card: "bg-destructive/[0.06] border-destructive/40 hover:border-destructive/70",
      number: "text-destructive",
      icon: <XCircle className="h-4 w-4 text-destructive" strokeWidth={2.5} />,
      iconWrap: "bg-destructive/15 border-destructive/40",
    },
    hoje: {
      card: "bg-card border-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.4)] hover:border-primary",
      number: "text-primary",
      icon: null,
      iconWrap: "bg-primary/15 border-primary/50 animate-pulse",
    },
    futuro: {
      card: "bg-card/30 border-border/40 hover:border-border",
      number: "text-muted-foreground/40",
      icon: <Lock className="h-3 w-3 text-muted-foreground/40" />,
      iconWrap: "border-muted-foreground/20",
    },
  }[status];

  const aria = `Dia ${n}, ${fullDate(dateISO)}, ${
    status === "forte" || status === "minimo"
      ? "completo"
      : status === "perdido"
      ? "perdido"
      : status === "hoje"
      ? "hoje"
      : "bloqueado"
  }`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={aria}
      title={fullDate(dateISO)}
      className={cn(
        "group relative aspect-square rounded-lg border flex flex-col items-center justify-center gap-1.5 px-1 py-2 transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:hover:translate-y-0",
        styles.card,
        isToday && "ring-1 ring-primary/40",
      )}
    >
      <span className={cn("text-display text-base sm:text-lg font-bold leading-none tabular-nums", styles.number)}>
        {n}
      </span>
      <span
        className={cn(
          "h-7 w-7 rounded-full border flex items-center justify-center transition-transform",
          styles.iconWrap,
          status === "hoje" && "shadow-[0_0_12px_hsl(var(--primary)/0.5)]",
        )}
      >
        {status === "hoje" ? (
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        ) : (
          styles.icon
        )}
      </span>
      <span className="text-[9px] text-muted-foreground/50 tabular-nums leading-none">
        {shortDate(dateISO)}
      </span>
    </button>
  );
}
