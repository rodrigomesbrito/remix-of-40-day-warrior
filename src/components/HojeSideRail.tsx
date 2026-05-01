import { Flag, Lock, Unlock, Target } from "lucide-react";
import { useMeta } from "@/hooks/useMeta";
import { useProtocol } from "@/hooks/useProtocol";
import { TARGET_CONSISTENCY } from "@/lib/protocol";
import { cn } from "@/lib/utils";

function fmtBRL(n: number) {
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function HojeSideRail() {
  const { meta, ready } = useMeta();
  const { stats } = useProtocol();
  if (!ready || !stats) return null;

  const consistPct = Math.round(stats.consistencia * 100);
  const onTrack = stats.consistencia >= TARGET_CONSISTENCY;
  const metaPct = Math.min(
    100,
    Math.round((meta.atual / Math.max(1, meta.alvo)) * 100),
  );

  return (
    <aside className="hidden xl:flex flex-col gap-3 w-[240px] shrink-0">
      {/* Meta — minimalista */}
      <div className="rounded-xl border border-border/60 bg-card/30 px-4 py-3">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
          <Target className="h-3 w-3" />
          Meta
        </div>
        <p className="mt-1.5 text-[15px] font-bold text-foreground/90 tabular-nums">
          {fmtBRL(meta.alvo)}
        </p>
        <p className="mt-0.5 text-[12px] text-muted-foreground tabular-nums">
          Progresso:{" "}
          <span className="text-foreground/80 font-semibold">
            {fmtBRL(meta.atual)}
          </span>
        </p>
        <div className="mt-2 h-1 w-full rounded-full bg-muted/30 overflow-hidden">
          <div
            className="h-full bg-accent/70 transition-all"
            style={{ width: `${metaPct}%` }}
          />
        </div>
      </div>

      {/* Recompensa — minimalista */}
      <div className="rounded-xl border border-border/60 bg-card/30 px-4 py-3">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
          <Flag className="h-3 w-3" />
          Missão
        </div>
        <p className="mt-1.5 text-[15px] font-bold text-foreground/90">
          Celular novo
        </p>
        <p className="mt-0.5 text-[12px] inline-flex items-center gap-1.5">
          {onTrack ? (
            <Unlock className="h-3 w-3 text-[hsl(var(--success))]" />
          ) : (
            <Lock className="h-3 w-3 text-muted-foreground/70" />
          )}
          <span
            className={cn(
              "tabular-nums font-semibold",
              onTrack ? "text-[hsl(var(--success))]" : "text-foreground/80",
            )}
          >
            {consistPct}% concluído
          </span>
        </p>
      </div>
    </aside>
  );
}
