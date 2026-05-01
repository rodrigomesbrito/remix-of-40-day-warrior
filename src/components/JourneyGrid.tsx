import { useState } from "react";
import { useProtocol } from "@/hooks/useProtocol";
import { PROTOCOL_LENGTH } from "@/lib/protocol";
import { cn } from "@/lib/utils";
import { DayDetailDialog } from "./DayDetailDialog";

const COLOR: Record<string, string> = {
  forte: "bg-[hsl(var(--success))] text-white border-transparent",
  minimo: "bg-accent text-accent-foreground border-transparent",
  perdido: "bg-destructive text-destructive-foreground border-transparent",
};

export function JourneyGrid() {
  const { state, dayNumber } = useProtocol();
  const [open, setOpen] = useState<number | null>(null);

  if (!state) return null;

  return (
    <>
      <div className="grid grid-cols-8 gap-2">
        {Array.from({ length: PROTOCOL_LENGTH }, (_, i) => {
          const n = i + 1;
          const rec = state.days[n];
          const isFuture = n > dayNumber;
          const isToday = n === dayNumber;
          const colorCls = rec ? COLOR[rec.classificacao] : "bg-card text-muted-foreground border-border";
          return (
            <button
              key={n}
              onClick={() => setOpen(n)}
              disabled={isFuture && !rec}
              className={cn(
                "aspect-square rounded-md border text-display font-semibold text-sm flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed",
                colorCls,
                isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background"
              )}
            >
              {n}
            </button>
          );
        })}
      </div>

      <DayDetailDialog dayNumber={open} onClose={() => setOpen(null)} />
    </>
  );
}
