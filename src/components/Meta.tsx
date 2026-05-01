import { useState } from "react";
import { useMeta } from "@/hooks/useMeta";
import { useProtocol } from "@/hooks/useProtocol";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROTOCOL_LENGTH, TARGET_CONSISTENCY } from "@/lib/protocol";

function fmtBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function Meta() {
  const { meta, update, ready } = useMeta();
  const { stats, dayNumber } = useProtocol();
  const [editing, setEditing] = useState(false);
  const [draftAlvo, setDraftAlvo] = useState(meta.alvo);
  const [draftAtual, setDraftAtual] = useState(meta.atual);
  const [draftDesc, setDraftDesc] = useState(meta.descricao);

  if (!ready || !stats) return null;

  const pct = Math.min(100, Math.round((meta.atual / Math.max(1, meta.alvo)) * 100));
  const dayShown = Math.min(PROTOCOL_LENGTH, Math.max(0, dayNumber));
  const restantes = Math.max(0, PROTOCOL_LENGTH - dayShown);
  const ritmoEsperado = (dayShown / PROTOCOL_LENGTH) * meta.alvo;
  let ritmoLabel = "em progresso";
  let ritmoClass = "text-accent";
  if (meta.atual >= ritmoEsperado * 1.05) {
    ritmoLabel = "acima do ritmo";
    ritmoClass = "text-[hsl(var(--success))]";
  } else if (meta.atual < ritmoEsperado * 0.85) {
    ritmoLabel = "abaixo do ritmo";
    ritmoClass = "text-destructive-foreground";
  }

  const consistPct = Math.round(stats.consistencia * 100);
  const onTrack = stats.consistencia >= TARGET_CONSISTENCY;

  const startEdit = () => {
    setDraftAlvo(meta.alvo);
    setDraftAtual(meta.atual);
    setDraftDesc(meta.descricao);
    setEditing(true);
  };
  const save = () => {
    update({ alvo: Number(draftAlvo) || 0, atual: Number(draftAtual) || 0, descricao: draftDesc });
    setEditing(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <section className="bg-gradient-blood border border-primary/40 rounded-lg p-6 shadow-deep">
        <p className="text-display text-xs text-accent tracking-widest mb-2">🎯 META DE PRODUÇÃO</p>
        <h2 className="text-display text-3xl font-bold mb-4">{meta.descricao}</h2>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-display text-2xl font-bold">{fmtBRL(meta.atual)}</span>
          <span className="text-foreground/70">/ {fmtBRL(meta.alvo)}</span>
        </div>
        <Progress value={pct} className="h-3" />
        <p className="text-sm mt-2 text-foreground/80">
          <strong>{pct}%</strong> da meta ·{" "}
          <span className={ritmoClass}>{ritmoLabel}</span>
        </p>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <Stat label="Dias passados" value={`${dayShown}`} />
        <Stat label="Dias restantes" value={`${restantes}`} />
        <Stat label="Ritmo esperado" value={fmtBRL(Math.round(ritmoEsperado))} />
      </section>

      <section className="bg-card border border-border rounded-lg p-5 shadow-card">
        {editing ? (
          <div className="space-y-3">
            <div>
              <Label className="text-display text-xs">Descrição</Label>
              <Input value={draftDesc} onChange={(e) => setDraftDesc(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-display text-xs">Meta (R$)</Label>
                <Input
                  type="number"
                  value={draftAlvo}
                  onChange={(e) => setDraftAlvo(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-display text-xs">Gerado até agora (R$)</Label>
                <Input
                  type="number"
                  value={draftAtual}
                  onChange={(e) => setDraftAtual(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={save}>Salvar</Button>
              <Button variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" onClick={startEdit} className="w-full">
            Atualizar meta / progresso
          </Button>
        )}
      </section>

      <blockquote className="border-l-4 border-primary pl-5 py-2 text-display text-xl text-foreground/90">
        “Todo dia eu avanço algo que me aproxima dessa meta.”
      </blockquote>

      <section className="bg-card border border-border rounded-lg p-5 shadow-card">
        <p className="text-display text-xs text-accent tracking-widest mb-2">🏁 RECOMPENSA FINAL</p>
        <p className="text-display text-2xl font-bold mb-1">📱 Celular novo</p>
        <p className="text-sm text-foreground/80">
          🔓 Liberado com {Math.round(TARGET_CONSISTENCY * 100)}% de consistência ·
          agora{" "}
          <strong className={onTrack ? "text-[hsl(var(--success))]" : "text-accent"}>
            {consistPct}%
          </strong>
        </p>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-card">
      <p className="text-display text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-display text-2xl font-bold">{value}</p>
    </div>
  );
}