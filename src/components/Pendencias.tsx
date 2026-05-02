import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { usePendencias } from "@/hooks/usePendencias";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

export function Pendencias() {
  const { items, add, toggle, remove } = usePendencias();
  const [titulo, setTitulo] = useState("");

  const handleAdd = () => {
    const t = titulo.trim();
    if (!t) return;
    add(t, "media");
    setTitulo("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Pendências</p>
        <h2 className="text-display text-3xl font-bold leading-none">Ciclos abertos</h2>
      </div>

      {/* Input simples */}
      <div className="flex gap-2">
        <Input
          placeholder="Adicionar pendência..."
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1"
        />
        <Button onClick={handleAdd} size="icon" aria-label="Adicionar">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Lista única */}
      {items.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-8 text-center text-sm text-muted-foreground">
          Nenhuma pendência.
        </div>
      ) : (
        <ul className="divide-y divide-border border border-border rounded-lg bg-card overflow-hidden">
          {items.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 px-4 py-3 group hover:bg-muted/30 transition-colors"
            >
              <Checkbox
                checked={p.feita}
                onCheckedChange={() => toggle(p.id)}
                className="h-4 w-4"
              />
              <p
                className={cn(
                  "flex-1 text-sm break-words",
                  p.feita && "line-through text-muted-foreground",
                )}
              >
                {p.titulo}
              </p>
              <button
                onClick={() => remove(p.id)}
                aria-label="Remover"
                className="text-muted-foreground/40 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
