import { useMemo } from "react";
import { CheckCard } from "./CheckCard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useProtocol } from "@/hooks/useProtocol";
import { classifyDay, emptyDay, HONRA_ITEMS, LEIS_ITEMS, PROTOCOL_LENGTH } from "@/lib/protocol";
import { toast } from "sonner";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-display text-xs text-muted-foreground">Hoje</p>
          <h2 className="text-display text-3xl font-bold">
            Dia {dayNumber}
            <span className="text-muted-foreground">/{PROTOCOL_LENGTH}</span>
          </h2>
        </div>
        <span className={`text-display font-semibold ${meta.className}`}>{meta.label}</span>
      </div>

      <div className="flex items-center justify-between bg-secondary/50 border border-border rounded-lg p-4">
        <div>
          <Label htmlFor="modo" className="text-display text-sm">
            Modo Mínimo
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Produção 30min · Corpo 10–15min · Mentalidade 10min. Sem produção, dia perdido.
          </p>
        </div>
        <Switch
          id="modo"
          checked={day.modoMinimo}
          onCheckedChange={(v) => updateDay(dayNumber, { modoMinimo: v })}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <CheckCard
          icon="💰"
          title="Produção"
          description={
            day.modoMinimo ? "30 min em algo que move dinheiro." : "1 avanço relevante no faturamento."
          }
          checked={day.producao}
          onToggle={() => updateDay(dayNumber, { producao: !day.producao })}
        />
        <CheckCard
          icon="🏋️"
          title="Corpo"
          description={day.modoMinimo ? "10–15 min de movimento." : "20–40 min de treino ou caminhada."}
          checked={day.corpo}
          onToggle={() => updateDay(dayNumber, { corpo: !day.corpo })}
        />
        <CheckCard
          icon="🧠"
          title="Mentalidade"
          description={
            day.modoMinimo ? "10 min de leitura ou curso." : "20–40 min de leitura/curso com intenção."
          }
          checked={day.mentalidade}
          onToggle={() => updateDay(dayNumber, { mentalidade: !day.mentalidade })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nota" className="text-display text-xs">
          Nota do dia (opcional)
        </Label>
        <Textarea
          id="nota"
          placeholder="O que você fez, aprendeu ou precisa lembrar..."
          value={day.nota ?? ""}
          onChange={(e) => updateDay(dayNumber, { nota: e.target.value })}
          className="bg-card min-h-24"
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => toast.success(`Dia ${dayNumber} salvo · ${meta.label}`)}
          className="text-display tracking-wider"
        >
          Confirmar dia
        </Button>
      </div>

      <div className="pt-6 mt-2 border-t border-border space-y-6">
        <div>
          <p className="text-display text-[10px] uppercase tracking-widest text-muted-foreground">
            Bônus · não impacta o score
          </p>
          <h3 className="text-display text-lg font-semibold mt-1">⚔️ Código de Honra</h3>
          <p className="text-xs text-muted-foreground">Proteção, não pontuação. Marque o que respeitou.</p>
          <ChecklistGroup
            items={HONRA_ITEMS}
            selected={day.honra ?? []}
            onToggle={(item) => {
              const cur = day.honra ?? [];
              const next = cur.includes(item) ? cur.filter((i) => i !== item) : [...cur, item];
              updateDay(dayNumber, { honra: next });
            }}
          />
        </div>

        <div>
          <h3 className="text-display text-lg font-semibold">🧭 Leis do Guerreiro</h3>
          <p className="text-xs text-muted-foreground">Qualidade da rotina. Marque o que cumpriu.</p>
          <ChecklistGroup
            items={LEIS_ITEMS}
            selected={day.leis ?? []}
            onToggle={(item) => {
              const cur = day.leis ?? [];
              const next = cur.includes(item) ? cur.filter((i) => i !== item) : [...cur, item];
              updateDay(dayNumber, { leis: next });
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ChecklistGroup({
  items,
  selected,
  onToggle,
}: {
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <ul className="mt-3 grid sm:grid-cols-2 gap-2">
      {items.map((item) => {
        const on = selected.includes(item);
        return (
          <li key={item}>
            <button
              type="button"
              onClick={() => onToggle(item)}
              className={`w-full text-left text-sm rounded-md border px-3 py-2 transition-colors ${
                on
                  ? "border-[hsl(var(--success))]/60 bg-[hsl(var(--success))]/10 text-foreground"
                  : "border-border bg-card/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="mr-2">{on ? "✓" : "○"}</span>
              {item}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
