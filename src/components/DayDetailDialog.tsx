import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProtocol } from "@/hooks/useProtocol";
import { emptyDay } from "@/lib/protocol";

interface Props {
  dayNumber: number | null;
  onClose: () => void;
}

const FIELDS: { key: "producao" | "corpo" | "mentalidade"; icon: string; label: string }[] = [
  { key: "producao", icon: "💰", label: "Produção" },
  { key: "corpo", icon: "🏋️", label: "Corpo" },
  { key: "mentalidade", icon: "🧠", label: "Mentalidade" },
];

export function DayDetailDialog({ dayNumber, onClose }: Props) {
  const { state, updateDay } = useProtocol();
  if (!state || dayNumber === null) return null;

  const day = state.days[dayNumber] ?? emptyDay();

  return (
    <Dialog open={dayNumber !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle className="text-display text-2xl">Dia {dayNumber}</DialogTitle>
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
            <Label className="text-display text-xs">Nota</Label>
            <Textarea
              value={day.nota ?? ""}
              onChange={(e) => updateDay(dayNumber, { nota: e.target.value })}
              className="bg-background min-h-20"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
