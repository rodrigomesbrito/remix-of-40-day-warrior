import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProtocol } from "@/hooks/useProtocol";
import { classifyDay, emptyDay } from "@/lib/protocol";

interface Props {
  dayNumber: number | null;
  onClose: () => void;
}

const FIELDS: { key: "producao" | "corpo" | "mentalidade"; icon: string; label: string }[] = [
  { key: "producao", icon: "💰", label: "Produção" },
  { key: "corpo", icon: "🏋️", label: "Corpo" },
  { key: "mentalidade", icon: "🧠", label: "Mentalidade" },
];

const STATUS: Record<string, { label: string; className: string }> = {
  forte: { label: "🟢 Dia Forte", className: "text-[hsl(var(--success))]" },
  minimo: { label: "🟡 Dia Mínimo", className: "text-accent" },
  perdido: { label: "🔴 Dia Perdido", className: "text-destructive-foreground" },
};

export function DayDetailDialog({ dayNumber, onClose }: Props) {
  const { state, updateDay } = useProtocol();
  if (!state || dayNumber === null) return null;

  const day = state.days[dayNumber] ?? emptyDay();
  const status = STATUS[classifyDay(day)];

  return (
    <Dialog open={dayNumber !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle className="text-display text-2xl flex items-center justify-between gap-3">
            <span>Dia {dayNumber}</span>
            <span className={`text-base font-semibold ${status.className}`}>{status.label}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between bg-secondary/50 rounded-md p-3">
            <Label className="text-display text-sm">Modo Mínimo</Label>
            <Switch
              checked={day.modoMinimo}
              onCheckedChange={(v) => updateDay(dayNumber, { modoMinimo: v })}
            />
          </div>

          {FIELDS.map((f) => (
            <div key={f.key} className="flex items-center justify-between border border-border rounded-md p-3">
              <span className="flex items-center gap-3">
                <span className="text-xl">{f.icon}</span>
                <span className="text-display">{f.label}</span>
              </span>
              <Switch
                checked={day[f.key]}
                onCheckedChange={(v) => updateDay(dayNumber, { [f.key]: v })}
              />
            </div>
          ))}

          <div className="space-y-2">
            <Label className="text-display text-xs">Nota do dia (opcional)</Label>
            <Textarea
              value={day.nota ?? ""}
              onChange={(e) => updateDay(dayNumber, { nota: e.target.value })}
              placeholder="O que você fez, aprendeu ou precisa lembrar..."
              className="bg-background min-h-20"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
