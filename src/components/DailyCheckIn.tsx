import { useMemo } from "react";
import { CheckCard } from "./CheckCard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProtocol } from "@/hooks/useProtocol";
import { classifyDay, emptyDay, PROTOCOL_LENGTH } from "@/lib/protocol";
import { toast } from "sonner";
import { CheckCircle2, Lightbulb, Target, Info, DollarSign, Dumbbell, Brain } from "lucide-react";

const CLASS_LABEL: Record<string, { label: string; className: string }> = {
  forte: { label: "Dia Forte", className: "text-[hsl(var(--success))]" },
  minimo: { label: "Dia Mínimo", className: "text-accent" },
  perdido: { label: "Dia Perdido", className: "text-destructive-foreground" },
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
  const statusLabel = isPristine ? "Dia em aberto" : meta.label;
  const statusClass = isPristine ? "text-muted-foreground" : meta.className;

  const todayDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long",
  });

  return (
    <div className="bg-card/40 border border-border rounded-xl p-6 sm:p-8 space-y-6 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Hoje</p>
          <h2 className="text-display text-4xl font-bold leading-none">
            Dia {dayNumber}
            <span className="text-muted-foreground">/{PROTOCOL_LENGTH}</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2 capitalize">{todayDate}</p>
        </div>
        <span className={`text-sm font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${statusClass}`}>
          <Target className="h-4 w-4" />
          {statusLabel}
        </span>
      </div>

      <div className="border-t border-border" />

      <div className="flex items-center justify-between gap-4 bg-card/60 border border-border rounded-xl px-4 py-3">
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

      <div>
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
            description: isPristine ? "Dia perdido — sem produção." : meta.label,
          })
        }
        className="w-full h-12 text-display tracking-wider shadow-deep"
      >
        <CheckCircle2 className="!h-5 !w-5 mr-2" strokeWidth={2} />
        Confirmar Dia
      </Button>

      <p className="text-center text-xs text-muted-foreground inline-flex items-center justify-center gap-1.5 w-full">
        <Lightbulb className="h-3.5 w-3.5 text-accent" />
        <span><strong>Dica:</strong> Foque no mínimo com excelência todos os dias.</span>
      </p>
    </div>
  );
}
