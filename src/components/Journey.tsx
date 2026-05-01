import { Zap, Moon, XCircle, Flame, type LucideIcon } from "lucide-react";
import { useProtocol } from "@/hooks/useProtocol";
import { PROTOCOL_LENGTH } from "@/lib/protocol";
import { cn } from "@/lib/utils";
import { JourneyGrid } from "./JourneyGrid";

export function Journey() {
  const { stats, dayNumber } = useProtocol();
  if (!stats) return null;

  const safeDay = Math.min(Math.max(dayNumber, 1), PROTOCOL_LENGTH);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Hero header — mesmo idioma visual da tela Meta */}
      <section className="bg-gradient-blood border border-primary/40 rounded-lg p-6 shadow-deep">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-accent font-semibold mb-2">
              🚩 Jornada de 40 dias
            </p>
            <h2 className="text-display text-3xl font-bold leading-none">
              Dia {safeDay}
              <span className="text-foreground/60">/{PROTOCOL_LENGTH}</span>
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-wider bg-[hsl(var(--accent)/0.18)] text-accent border-[hsl(var(--accent)/0.45)]">
            <Flame className="h-3.5 w-3.5" strokeWidth={2.5} />
            {stats.streak}d streak
          </span>
        </div>
        <p className="text-sm text-foreground/80">
          Sua consistência ao longo dos 40 dias.
        </p>
      </section>

      {/* Stats — mesmo padrão dos cards da tela Meta */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat
            Icon={Zap}
            label="Dias Fortes"
            value={stats.fortes}
            tone="success"
          />
          <Stat
            Icon={Moon}
            label="Dias Mínimos"
            value={stats.minimos}
            tone="accent"
          />
          <Stat
            Icon={XCircle}
            label="Dias Perdidos"
            value={stats.perdidos}
            tone="destructive"
          />
          <Stat
            Icon={Flame}
            label="Streak"
            value={`${stats.streak}d`}
            tone="primary"
          />
      </section>

      {/* Calendário */}
      <JourneyGrid />
    </div>
  );
}

const TONES: Record<
  "success" | "accent" | "destructive" | "primary",
  { text: string; bg: string; bar: string }
> = {
  success: {
    text: "text-[hsl(var(--success))]",
    bg: "bg-[hsl(var(--success)/0.18)]",
    bar: "bg-[hsl(var(--success))]",
  },
  accent: {
    text: "text-accent",
    bg: "bg-[hsl(var(--accent)/0.18)]",
    bar: "bg-[hsl(var(--accent))]",
  },
  destructive: {
    text: "text-[hsl(0_85%_65%)]",
    bg: "bg-[hsl(0_75%_45%/0.18)]",
    bar: "bg-[hsl(0_85%_55%)]",
  },
  primary: {
    text: "text-primary",
    bg: "bg-[hsl(var(--primary)/0.18)]",
    bar: "bg-[hsl(var(--primary))]",
  },
};

function Stat({
  Icon,
  label,
  value,
  tone,
}: {
  Icon: LucideIcon;
  label: string;
  value: number | string;
  tone: keyof typeof TONES;
}) {
  const t = TONES[tone];
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card/60 px-4 py-3">
      <span className={cn("absolute left-0 top-0 bottom-0 w-[3px]", t.bar)} />
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "shrink-0 h-9 w-9 rounded-full flex items-center justify-center",
            t.bg,
          )}
        >
          <Icon className={cn("h-4 w-4", t.text)} strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold leading-none">
            {label}
          </p>
          <p className={cn("text-display text-2xl font-bold leading-none mt-1.5", t.text)}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
