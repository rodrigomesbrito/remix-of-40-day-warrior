import { useState } from "react";
import { useProtocol } from "@/hooks/useProtocol";
import { PROTOCOL_LENGTH } from "@/lib/protocol";
import { cn } from "@/lib/utils";
import { DayDetailDialog } from "./DayDetailDialog";
import { Check, Lock, XCircle } from "lucide-react";

function fmtBR(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y.slice(2)}`;
}

function addDays(iso: string, n: number) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function JourneyGrid() {
  const { state, dayNumber } = useProtocol();
  const [open, setOpen] = useState<number | null>(null);

  if (!state) return null;

  return (
    <>
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
        {Array.from({ length: PROTOCOL_LENGTH }, (_, i) => {
          const n = i + 1;
          const rec = state.days[n];
          const isFuture = n > dayNumber;
          const isToday = n === dayNumber;
          const dateISO = addDays(state.startDate, i);

          // Defaults: dia futuro (bloqueado, sem texto)
          let badge = (
            <span className="h-9 w-9 rounded-full border border-muted-foreground/30 flex items-center justify-center">
              <Lock className="h-4 w-4 text-muted-foreground/60" />
            </span>
          );
          let label: string | null = null;
          let labelClass = "";
          let numberClass = "text-muted-foreground/40";
          let cardClass = "bg-card/40 border-border/60";

          if (rec?.classificacao === "forte" || rec?.classificacao === "minimo") {
            badge = (
              <span className="h-9 w-9 rounded-full bg-[hsl(var(--success))]/15 border border-[hsl(var(--success))]/50 flex items-center justify-center">
                <Check className="h-5 w-5 text-[hsl(var(--success))]" strokeWidth={3} />
              </span>
            );
            label = "Completo";
            labelClass = "text-[hsl(var(--success))]";
            numberClass = "text-[hsl(var(--success))]";
            cardClass = "bg-card border-[hsl(var(--success))]/40";
          } else if (rec?.classificacao === "perdido") {
            badge = (
              <span className="h-9 w-9 rounded-full bg-destructive/15 border border-destructive/50 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-destructive" strokeWidth={2.5} />
              </span>
            );
            label = "Perdido";
            labelClass = "text-destructive";
            numberClass = "text-destructive";
            cardClass = "bg-card border-destructive/50";
          }

          if (isToday && !rec) {
            badge = (
              <span className="h-9 w-9 rounded-full bg-destructive/15 border border-destructive/60 flex items-center justify-center">
                <Lock className="h-4 w-4 text-destructive" />
              </span>
            );
            label = "Hoje";
            labelClass = "text-destructive font-semibold";
            numberClass = "text-destructive";
            cardClass = "bg-card border-destructive";
          }

          return (
            <button
              key={n}
              onClick={() => setOpen(n)}
              disabled={isFuture && !rec}
              className={cn(
                "relative rounded-lg border p-3 pt-2 flex flex-col items-center justify-between gap-2 transition-all hover:scale-[1.02] hover:border-primary/40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-border/60",
                cardClass,
                isToday && "ring-1 ring-destructive/60"
              )}
            >
              <span className={cn("absolute top-1.5 left-2 text-display text-lg font-bold leading-none", numberClass)}>
                {n}
              </span>
              {badge}
              <span className="flex flex-col items-center gap-0.5">
                {label && <p className={cn("text-xs font-medium", labelClass)}>{label}</p>}
                <p className="text-[10px] text-muted-foreground/60">{fmtBR(dateISO)}</p>
              </span>
            </button>
          );
        })}
      </div>

      <DayDetailDialog dayNumber={open} onClose={() => setOpen(null)} />
    </>
  );
}
