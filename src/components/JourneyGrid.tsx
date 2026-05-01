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

          let icon = <Lock className="h-5 w-5 text-muted-foreground/60" />;
          let label = "Bloqueado";
          let labelClass = "text-muted-foreground/70";
          let cardClass = "bg-card/40 border-border/60";

          if (rec?.classificacao === "forte" || rec?.classificacao === "minimo") {
            icon = <Check className="h-5 w-5 text-[hsl(var(--success))]" strokeWidth={3} />;
            label = "Completo";
            labelClass = "text-[hsl(var(--success))]";
            cardClass = "bg-[hsl(var(--success))]/5 border-[hsl(var(--success))]/40";
          } else if (rec?.classificacao === "perdido") {
            icon = <XCircle className="h-5 w-5 text-destructive" strokeWidth={2.5} />;
            label = "Perdido";
            labelClass = "text-destructive";
            cardClass = "bg-destructive/5 border-destructive/40";
          }

          if (isToday && !rec) {
            icon = <Lock className="h-5 w-5 text-destructive" />;
            label = "Hoje";
            labelClass = "text-destructive font-semibold";
            cardClass = "bg-destructive/5 border-destructive";
          }

          return (
            <button
              key={n}
              onClick={() => setOpen(n)}
              disabled={isFuture && !rec}
              className={cn(
                "rounded-lg border p-3 text-left flex flex-col gap-2 transition-all hover:scale-[1.02] hover:border-primary/40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-border/60",
                cardClass,
                isToday && "ring-1 ring-destructive/60"
              )}
            >
              <span className="flex items-start justify-between">
                <span className="text-display text-lg font-bold leading-none">{n}</span>
                {icon}
              </span>
              <span className="space-y-0.5">
                <p className={cn("text-xs font-medium", labelClass)}>{label}</p>
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
