import { useMemo } from "react";
import { CheckCard } from "./CheckCard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProtocol } from "@/hooks/useProtocol";
import { classifyDay, emptyDay, PROTOCOL_LENGTH } from "@/lib/protocol";
import { toast } from "sonner";
import { CheckCircle2, Lightbulb, Target, Info, DollarSign, Dumbbell, Brain, Flame } from "lucide-react";

const CLASS_LABEL: Record<string, { label: string; className: string }> = {
  forte: { label: "🟢 Dia Forte", className: "text-[hsl(var(--success))]" },
  minimo: { label: "🟡 Dia Mínimo", className: "text-accent" },
  perdido: { label: "🔴 Dia Perdido", className: "text-destructive-foreground" },
};

export function DailyCheckIn() {
  const { state, dayNumber, inRange, updateDay, reset } = useProtocol();

  const day = useMemo(() => {
    if (!state || !inRange) return null;
    return state.days[dayNumber] ?? emptyDay();
  }, [state, dayNumber, inRange]);

  if (!state) return null;

  if (!inRange) {
    const finished = dayNumber > PROTOCOL_LENGTH;
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center shadow-card">
        <h2 className="text-display text-3xl font-bold mb-3">
          {finished ? "Protocolo concluído" : "Aguardando início"}
        </h2>
        <p className="text-muted-foreground mb-6">
          {finished
            ? "Os 40 dias passaram. Veja sua jornada e revise o que conquistou."
            : `Seu protocolo começa em ${state.startDate}.`}
        </p>
        <Button variant="outline" onClick={reset}>
          Reiniciar protocolo
        </Button>
      </div>
    );
  }

  if (!day) return null;

  const preview = classifyDay(day);
  const meta = CLASS_LABEL[preview];
  // Antes do primeiro check, não comunicar "Dia Perdido" — evita derrota visual logo de cara.
  const isPristine = !day.producao && !day.corpo && !day.mentalidade;
  const statusLabel = isPristine ? "🎯 Dia em aberto" : meta.label;
  const statusClass = isPristine ? "text-muted-foreground" : meta.className;

  const todayDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long",
  });

  const pillars = [day.producao, day.corpo, day.mentalidade];
  const pillarsDone = pillars.filter(Boolean).length;
  const dayProgress = Math.round((dayNumber / PROTOCOL_LENGTH) * 100);

  return (
    <div className="relative bg-card/40 border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-card overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 40% at 0% 0%, hsl(0 75% 35% / 0.18), transparent 70%)",
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-5">
          <PillarRing done={pillarsDone} total={3} />
          <div>
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Hoje</p>
            <h2 className="text-display text-4xl font-bold leading-none">
              Dia {dayNumber}
              <span className="text-muted-foreground">/{PROTOCOL_LENGTH}</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-2 capitalize">{todayDate}</p>
          </div>
        </div>
        <span className={`text-[11px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card/80 ${statusClass}`}>
          <Target className="h-3.5 w-3.5" />
          {statusLabel}
        </span>
      </div>

      {/* Progress bar do protocolo */}
      <div className="relative">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1.5">
          <span>Progresso do Protocolo</span>
          <span className="text-foreground/80">{dayProgress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-[hsl(var(--accent))] transition-all"
            style={{ width: `${dayProgress}%` }}
          />
        </div>
      </div>

      <div className="relative flex items-center justify-between gap-4 bg-card/60 border border-border rounded-xl px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Label htmlFor="modo" className="text-[13px] font-extrabold uppercase tracking-wider">
              Modo Mínimo
            </Label>
            <Info className="h-3.5 w-3.5 text-muted-foreground/70" />
          </div>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            Produção 30min · Corpo 10–15min · Mentalidade 10min. Sem produção, dia perdido.
          </p>
        </div>
        <Switch
          id="modo"
          checked={day.modoMinimo}
          onCheckedChange={(v) => updateDay(dayNumber, { modoMinimo: v })}
        />
      </div>

      <div className="relative">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">
          Pilares do Dia
        </p>
        <div className="grid gap-3">
        <CheckCard
          Icon={DollarSign}
          iconColor="red"
          title="Produção"
          description={
            day.modoMinimo ? "30 min em algo que move dinheiro." : "1 avanço relevante no faturamento."
          }
          checked={day.producao}
          onToggle={() => updateDay(dayNumber, { producao: !day.producao })}
        />
        <CheckCard
          Icon={Dumbbell}
          iconColor="orange"
          title="Corpo"
          description={day.modoMinimo ? "10–15 min de movimento." : "20–40 min de treino ou caminhada."}
          checked={day.corpo}
          onToggle={() => updateDay(dayNumber, { corpo: !day.corpo })}
        />
        <CheckCard
          Icon={Brain}
          iconColor="purple"
          title="Mentalidade"
          description={
            day.modoMinimo ? "10 min de leitura ou curso." : "20–40 min de leitura/curso com intenção."
          }
          checked={day.mentalidade}
          onToggle={() => updateDay(dayNumber, { mentalidade: !day.mentalidade })}
        />
        </div>
      </div>

      <Button
        size="lg"
        onClick={() =>
          toast.success(`Dia ${dayNumber} salvo`, {
            description: isPristine ? "🔴 Dia perdido — sem produção." : meta.label,
          })
        }
        className="relative w-full h-14 text-display tracking-widest shadow-deep bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))] hover:opacity-95"
      >
        <CheckCircle2 className="!h-9 !w-9 mr-2" strokeWidth={2.5} />
        Confirmar Dia
      </Button>

      <p className="relative text-center text-xs text-muted-foreground inline-flex items-center justify-center gap-1.5 w-full">
        <Lightbulb className="h-3.5 w-3.5 text-accent" />
        <span><strong>Dica:</strong> Foque no mínimo com excelência todos os dias.</span>
      </p>
    </div>
  );
}

function PillarRing({ done, total }: { done: number; total: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const pct = done / total;
  const offset = c - pct * c;
  const color =
    done === total ? "hsl(var(--success))" : done === 0 ? "hsl(var(--muted-foreground))" : "hsl(var(--primary-glow))";
  return (
    <div className="relative h-[68px] w-[68px] shrink-0">
      <svg viewBox="0 0 68 68" className="-rotate-90 h-full w-full">
        <circle cx="34" cy="34" r={r} stroke="hsl(var(--secondary))" strokeWidth="5" fill="none" />
        <circle
          cx="34" cy="34" r={r}
          stroke={color}
          strokeWidth="5" fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 400ms ease, stroke 200ms" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-display text-base font-bold">{done}<span className="text-muted-foreground text-xs">/{total}</span></span>
        <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold mt-0.5">Pilares</span>
      </div>
    </div>
  );
}
