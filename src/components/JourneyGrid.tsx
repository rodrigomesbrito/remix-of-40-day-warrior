import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Zap, Circle, XCircle } from "lucide-react";
import { useProtocol } from "@/hooks/useProtocol";
import { PROTOCOL_LENGTH } from "@/lib/protocol";
import { cn } from "@/lib/utils";
import { DayDetailDialog } from "./DayDetailDialog";

const WEEKDAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function startOfMonth(y: number, m: number) {
  return new Date(y, m, 1);
}
function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}
function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

export function JourneyGrid() {
  const { state, dayNumber } = useProtocol();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [cursor, setCursor] = useState<{ y: number; m: number }>(() => ({
    y: today.getFullYear(),
    m: today.getMonth(),
  }));
  const [open, setOpen] = useState<number | null>(null);

  // Mapa: ISO date -> protocol day number
  const dateToDayNum = useMemo(() => {
    const map = new Map<string, number>();
    if (!state) return map;
    const start = new Date(state.startDate + "T00:00:00");
    for (let i = 1; i <= PROTOCOL_LENGTH; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + (i - 1));
      map.set(ymd(d), i);
    }
    return map;
  }, [state]);

  if (!state) return null;

  const first = startOfMonth(cursor.y, cursor.m);
  const leadingBlank = first.getDay(); // 0 = Sun
  const total = daysInMonth(cursor.y, cursor.m);
  const cells: Array<{ date: Date; inMonth: boolean }> = [];

  // leading days from previous month
  const prevTotal = daysInMonth(cursor.m === 0 ? cursor.y - 1 : cursor.y, cursor.m === 0 ? 11 : cursor.m - 1);
  for (let i = leadingBlank - 1; i >= 0; i--) {
    const d = new Date(cursor.y, cursor.m - 1, prevTotal - i);
    cells.push({ date: d, inMonth: false });
  }
  for (let i = 1; i <= total; i++) {
    cells.push({ date: new Date(cursor.y, cursor.m, i), inMonth: true });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const last = cells[cells.length - 1].date;
    const next = new Date(last);
    next.setDate(last.getDate() + 1);
    cells.push({ date: next, inMonth: next.getMonth() === cursor.m });
    if (cells.length >= 42) break;
  }

  const goPrev = () => setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }));
  const goNext = () => setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }));
  const goToday = () => setCursor({ y: today.getFullYear(), m: today.getMonth() });

  return (
    <>
      <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-display text-xl">Sua Jornada</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Acompanhe sua consistência diária</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:bg-secondary transition-colors"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="h-9 px-4 inline-flex items-center justify-center rounded-md border border-border min-w-[160px] text-sm font-semibold">
              {MONTHS[cursor.m]} {cursor.y}
            </div>
            <button
              onClick={goNext}
              className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:bg-secondary transition-colors"
              aria-label="Próximo mês"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={goToday}
              className="h-9 px-4 inline-flex items-center justify-center rounded-md border border-border hover:bg-secondary transition-colors text-xs font-semibold tracking-wider uppercase"
            >
              Hoje
            </button>
          </div>
        </div>

        {/* Weekday header */}
        <div className="grid grid-cols-7 border-b border-border">
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="px-3 py-2 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase"
            >
              {w}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7">
          {cells.map((cell, idx) => {
            const iso = ymd(cell.date);
            const protoDay = dateToDayNum.get(iso);
            const rec = protoDay ? state.days[protoDay] : undefined;
            const isToday = cell.date.getTime() === today.getTime();
            const isFuture = cell.date.getTime() > today.getTime();

            const klass = rec?.classificacao;
            const tone =
              klass === "forte"
                ? "text-[hsl(var(--success))]"
                : klass === "minimo"
                ? "text-accent"
                : klass === "perdido"
                ? "text-destructive"
                : "text-muted-foreground";

            const bgClass =
              klass === "forte"
                ? "bg-[hsl(var(--success)/0.1)]"
                : klass === "minimo"
                ? "bg-accent/10"
                : klass === "perdido"
                ? "bg-destructive/10"
                : "";

            return (
              <button
                key={idx}
                onClick={() => protoDay && setOpen(protoDay)}
                disabled={!protoDay || (isFuture && !rec)}
                className={cn(
                  "relative h-24 border-r border-b border-border p-2 text-left transition-colors",
                  "hover:bg-secondary/40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
                  (idx + 1) % 7 === 0 && "border-r-0",
                  idx >= cells.length - 7 && "border-b-0",
                  !cell.inMonth && "opacity-40",
                  bgClass,
                  isToday && "ring-2 ring-accent ring-inset"
                )}
              >
                <span
                  className={cn(
                    "text-sm font-semibold",
                    cell.inMonth ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {cell.date.getDate()}
                </span>

                {rec && (
                  <div className="absolute inset-x-0 bottom-2 flex flex-col items-center gap-0.5">
                    {klass === "forte" && <Zap className="h-3.5 w-3.5 text-[hsl(var(--success))]" strokeWidth={2.5} />}
                    {klass === "minimo" && <Circle className="h-3 w-3 text-accent fill-accent" />}
                    {klass === "perdido" && <XCircle className="h-3.5 w-3.5 text-destructive" strokeWidth={2.5} />}
                    <span className={cn("text-[9px] font-bold tracking-wider uppercase", tone)}>
                      {klass === "forte" ? "Dia Forte" : klass === "minimo" ? "Dia Mínimo" : "Dia Perdido"}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 py-3 border-t border-border text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-[hsl(var(--success))]" strokeWidth={2.5} /> Dia forte
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Circle className="h-3 w-3 text-accent fill-accent" /> Dia mínimo
          </span>
          <span className="inline-flex items-center gap-1.5">
            <XCircle className="h-3.5 w-3.5 text-destructive" strokeWidth={2.5} /> Dia perdido
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Circle className="h-3 w-3 text-muted-foreground" /> Não registrado
          </span>
        </div>
      </div>

      <DayDetailDialog dayNumber={open} onClose={() => setOpen(null)} />
    </>
  );
}
