import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePendencias, type Prioridade } from "@/hooks/usePendencias";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const PRIO_META: Record<Prioridade, { label: string; cls: string; order: number }> = {
  alta: { label: "Alta", cls: "bg-primary text-primary-foreground", order: 0 },
  media: { label: "Média", cls: "bg-accent text-accent-foreground", order: 1 },
  baixa: { label: "Baixa", cls: "bg-secondary text-secondary-foreground", order: 2 },
};

export function Pendencias() {
  const { items, add, toggle, remove, limparFeitas } = usePendencias();
  const [titulo, setTitulo] = useState("");
  const [prioridade, setPrioridade] = useState<Prioridade>("media");

  const { abertas, feitas } = useMemo(() => {
    const abertas = items
      .filter((i) => !i.feita)
      .sort((a, b) => PRIO_META[a.prioridade].order - PRIO_META[b.prioridade].order);
    const feitas = items.filter((i) => i.feita);
    return { abertas, feitas };
  }, [items]);

  const handleAdd = () => {
    const t = titulo.trim();
    if (!t) return;
    add(t, prioridade);
    setTitulo("");
    setPrioridade("media");
    toast.success("Pendência adicionada");
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-display text-3xl font-bold">Pendências</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Liste e feche os ciclos abertos que drenam sua energia.
        </p>
      </div>

      {/* Form */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-card space-y-3">
        <Label htmlFor="nova-pendencia" className="text-display text-xs">
          Nova pendência
        </Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            id="nova-pendencia"
            placeholder="Ex: pagar fatura, responder cliente, organizar gaveta..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1"
          />
          <Select value={prioridade} onValueChange={(v) => setPrioridade(v as Prioridade)}>
            <SelectTrigger className="sm:w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAdd} className="text-display tracking-wider">
            Adicionar
          </Button>
        </div>
      </div>

      {/* Abertas */}
      <section>
        <h3 className="text-display text-lg font-semibold mb-3">Abertas</h3>
        {abertas.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-6 text-center text-sm text-muted-foreground">
            Nenhuma pendência aberta. Ciclo limpo. ⚔️
          </div>
        ) : (
          <ul className="space-y-2">
            {abertas.map((p) => (
              <PendenciaItem key={p.id} p={p} onToggle={toggle} onRemove={remove} />
            ))}
          </ul>
        )}
      </section>

      {/* Feitas */}
      {feitas.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-display text-lg font-semibold">Fechadas</h3>
            <Button variant="ghost" size="sm" onClick={limparFeitas} className="text-xs">
              Limpar fechadas
            </Button>
          </div>
          <ul className="space-y-2">
            {feitas.map((p) => (
              <PendenciaItem key={p.id} p={p} onToggle={toggle} onRemove={remove} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function PendenciaItem({
  p,
  onToggle,
  onRemove,
}: {
  p: ReturnType<typeof usePendencias>["items"][number];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const meta = PRIO_META[p.prioridade];
  return (
    <li className="bg-card border border-border rounded-lg p-3 shadow-card flex items-center gap-3">
      <Checkbox
        checked={p.feita}
        onCheckedChange={() => onToggle(p.id)}
        className="h-5 w-5"
      />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm break-words", p.feita && "line-through text-muted-foreground")}>
          {p.titulo}
        </p>
      </div>
      <span
        className={cn(
          "text-display text-[10px] tracking-widest px-2 py-1 rounded",
          meta.cls,
          p.feita && "opacity-50"
        )}
      >
        {meta.label}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(p.id)}
        className="h-8 w-8 text-muted-foreground hover:text-destructive-foreground"
        aria-label="Remover"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
}
