import { useMemo, useState, useEffect } from "react";
import { CheckCard } from "./CheckCard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProtocol } from "@/hooks/useProtocol";
import { classifyDay, emptyDay, PROTOCOL_LENGTH } from "@/lib/protocol";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CheckCircle2, Bell, DollarSign, Dumbbell, Brain, Zap, Moon, XCircle, Circle, Pencil, type LucideIcon } from "lucide-react";

const CLASS_LABEL: Record<string, { label: string; className: string; Icon: LucideIcon }> = {
  forte: { label: "Dia Forte", className: "text-[hsl(var(--success))]", Icon: Zap },
  minimo: { label: "Dia Mínimo", className: "text-accent", Icon: Moon },
  perdido: { label: "Dia Perdido", className: "text-destructive-foreground", Icon: XCircle },
};

const CLASS_BADGE: Record<string, string> = {
  forte:
    "bg-[hsl(var(--success)/0.18)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.45)] shadow-[0_0_0_3px_hsl(var(--success)/0.08)]",
  minimo:
    "bg-[hsl(var(--accent)/0.18)] text-accent border-[hsl(var(--accent)/0.45)] shadow-[0_0_0_3px_hsl(var(--accent)/0.08)]",
  perdido:
    "bg-[hsl(0_75%_45%/0.18)] text-[hsl(0_85%_65%)] border-[hsl(0_75%_50%/0.45)] shadow-[0_0_0_3px_hsl(0_75%_45%/0.08)]",
  aberto:
    "bg-muted/40 text-muted-foreground border-border",
};

export function DailyCheckIn() {
  const { state, dayNumber, inRange, updateDay, reset } = useProtocol();
  const [confirmed, setConfirmed] = useState(false);

  // Reset confirmation when day changes
  useEffect(() => {
    setConfirmed(false);
  }, [dayNumber]);

  const day = useMemo(() => {
    if (!state || !inRange) return null;
    return state.days[dayNumber] ?? emptyDay();
  }, [state, dayNumber, inRange]);

  if (!state) return null;

  if (!inRange) {
    const finished = dayNumber > PROTOCOL_LENGTH;
    return (
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg p-8 text-center shadow-card">
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
  const badgeClass = isPristine ? CLASS_BADGE.aberto : CLASS_BADGE[preview];
  const StatusIcon = isPristine ? Circle : meta.Icon;

  const todayDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long",
  });

  const CONFIRMED_MESSAGES: Record<string, { title: string; subtitle: string; tone: string }> = {
    forte: {
      title: "Dia Forte conquistado.",
      subtitle: "Produção, corpo e mente alinhados. É assim que se constrói.",
      tone: "text-[hsl(var(--success))]",
    },
    minimo: {
      title: "Dia Mínimo cumprido.",
      subtitle: "Você manteve a corrente. Amanhã, eleve o nível.",
      tone: "text-accent",
    },
    perdido: {
      title: "Dia perdido.",
      subtitle: "Sem produção, não há avanço. Reset mental: amanhã você vence.",
      tone: "text-[hsl(0_85%_65%)]",
    },
  };

  const handleConfirm = () => {
    setConfirmed(true);
    const msg = isPristine ? CONFIRMED_MESSAGES.perdido : CONFIRMED_MESSAGES[preview];
    toast.success(`Dia ${dayNumber} salvo`, { description: msg.title });
  };

  const finalStatus = isPristine ? "perdido" : preview;
  const finalMsg = CONFIRMED_MESSAGES[finalStatus];
  const FinalIcon = isPristine ? XCircle : meta.Icon;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
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
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-wider transition-colors",
            confirmed ? CLASS_BADGE[finalStatus] : badgeClass,
          )}
        >
          <StatusIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
          {confirmed ? CLASS_LABEL[finalStatus].label : statusLabel}
        </span>
      </div>

      <div className="border-t border-border" />

      {confirmed ? (
        <div className="py-8 text-center space-y-5 animate-fade-in">
          <div
            className={cn(
              "mx-auto h-20 w-20 rounded-full flex items-center justify-center",
              finalStatus === "forte" && "bg-[hsl(var(--success)/0.15)]",
              finalStatus === "minimo" && "bg-[hsl(var(--accent)/0.15)]",
              finalStatus === "perdido" && "bg-[hsl(0_75%_45%/0.15)]",
            )}
          >
            <FinalIcon className={cn("h-10 w-10", finalMsg.tone)} strokeWidth={2.25} />
          </div>
          <div className="space-y-2">
            <h3 className={cn("text-display text-2xl font-bold", finalMsg.tone)}>
              {finalMsg.title}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              {finalMsg.subtitle}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmed(false)}
            className="mt-2"
          >
            <Pencil className="h-3.5 w-3.5 mr-2" />
            Editar dia
          </Button>
        </div>
      ) : (
        <>
      <div
        className={cn(
          "flex items-center justify-between gap-4 border rounded-xl px-4 py-3 transition-colors",
          day.modoMinimo
            ? "bg-card/40 border-border/60"
            : "bg-card/60 border-border",
        )}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Label htmlFor="modo" className="text-[13px] font-extrabold uppercase tracking-wider">
              Modo Mínimo
            </Label>
            {day.modoMinimo && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground bg-muted/30 border border-border rounded-full px-2 py-0.5">
                Ativo
              </span>
            )}
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

      <div className="space-y-2">
        <Button
          size="lg"
          onClick={handleConfirm}
          className="w-full h-14 text-base text-display tracking-wider shadow-deep"
        >
          <CheckCircle2 className="!h-6 !w-6 mr-2" strokeWidth={2.25} />
          Confirmar Dia
        </Button>
      </div>
        </>
      )}
    </div>

      {/* LEMBRETE */}
      <div className="relative bg-card/60 border border-border rounded-xl p-5 overflow-hidden">
        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground">
              Lembrete
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O que você faz todos os dias, define quem você se torna.
            </p>
            <p className="text-sm font-extrabold text-primary">
              Não quebre a corrente.
            </p>
          </div>
          <Bell className="h-5 w-5 text-primary shrink-0 mt-0.5" strokeWidth={2.25} />
        </div>
      </div>
    </div>
  );
}
