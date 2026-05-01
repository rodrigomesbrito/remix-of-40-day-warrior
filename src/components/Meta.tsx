import { useState } from "react";
import { useMeta } from "@/hooks/useMeta";
import { useProtocol } from "@/hooks/useProtocol";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROTOCOL_LENGTH } from "@/lib/protocol";
import { Pencil, CalendarDays, Hourglass, TrendingUp, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

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
  const pctCiclo = Math.round((dayShown / PROTOCOL_LENGTH) * 100);
  const pctRestante = 100 - pctCiclo;
  const ritmoDia = Math.max(0, Math.ceil((meta.alvo - meta.atual) / Math.max(1, restantes || 1)));

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

  // Donut chart geometry
  const size = 180;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  // Evolution chart data
  const steps = 6;
  const chartData = Array.from({ length: steps }, (_, i) => {
    const dia = Math.round((i / (steps - 1)) * PROTOCOL_LENGTH);
    const ideal = Math.round((dia / PROTOCOL_LENGTH) * meta.alvo);
    const realizado = dia <= dayShown ? meta.atual * (dia / Math.max(1, dayShown)) : null;
    return { dia: `Dia ${dia}`, ideal, realizado };
  });

  return (
    <div className="space-y-5">
      {/* Top row: hero + 3 stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Hero card */}
        <section className="bg-card border border-border rounded-xl p-6 shadow-card">
          <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-3">Meta Principal</p>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-display text-3xl sm:text-4xl font-bold leading-tight">
                {meta.descricao.toUpperCase()}
              </h2>
              <p className="text-sm text-muted-foreground mt-3 max-w-xs">
                Foque no que importa, mantenha a consistência e os resultados virão.
              </p>
            </div>
            <div className="relative shrink-0" style={{ width: size, height: size }}>
              <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(var(--secondary))" strokeWidth={stroke} fill="none" />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  stroke="hsl(var(--primary))"
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${dash} ${circ}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-display text-3xl font-bold">{pct}%</span>
                <span className="text-[11px] text-muted-foreground">da meta</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Progresso Atual</p>
            <p className="text-display text-3xl font-bold text-primary">{fmtBRL(meta.atual)}</p>
            <p className="text-xs text-muted-foreground mt-1">de {fmtBRL(meta.alvo)}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground">0%</span>
              <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground">100%</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border flex items-start gap-2 text-xs text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
            <span>
              Você precisa gerar em média <strong className="text-foreground">{fmtBRL(ritmoDia)}</strong> por dia para alcançar sua meta.
            </span>
          </div>
        </section>

        {/* Right column: 3 stat cards + chart */}
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-3">
            <StatTop icon={CalendarDays} label="Dias Passados" value={`${dayShown}`} sub={`${pctCiclo}% do ciclo`} />
            <StatTop icon={Hourglass} label="Dias Restantes" value={`${restantes}`} sub={`${pctRestante}% do ciclo`} />
            <StatTop icon={TrendingUp} label="Ritmo Esperado" value={fmtBRL(ritmoDia)} sub="Para bater a meta" valueClass="text-base sm:text-lg" />
          </div>

          <section className="bg-card border border-border rounded-xl p-5 shadow-card flex-1">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Evolução da Meta</p>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block w-3 h-[2px] border-t-2 border-dashed border-primary" />
                  <span className="text-muted-foreground">Projeção ideal</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block w-3 h-[2px] bg-muted-foreground" />
                  <span className="text-muted-foreground">Valor realizado</span>
                </span>
              </div>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
                  <XAxis dataKey="dia" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `R$ ${Number(v).toLocaleString("pt-BR")}`}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    formatter={(v: any) => (v == null ? "—" : fmtBRL(Number(v)))}
                  />
                  <Line type="monotone" dataKey="ideal" stroke="hsl(var(--primary))" strokeWidth={2} strokeDasharray="6 4" dot={false} />
                  <Line type="monotone" dataKey="realizado" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--muted-foreground))" }} connectNulls={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      </div>

      {/* Edit section */}
      <section className="bg-card border border-border rounded-xl p-5 shadow-card">
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
          <Button variant="secondary" onClick={startEdit} className="w-full text-display">
            <Pencil className="h-4 w-4 mr-2" />
            Atualizar meta / progresso
          </Button>
        )}
      </section>
    </div>
  );
}

function StatTop({
  icon: Icon,
  label,
  value,
  sub,
  valueClass,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  valueClass?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-card flex flex-col">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-primary font-bold mb-2">
        <Icon className="h-3 w-3" />
        <span className="truncate">{label}</span>
      </div>
      <p className={`text-display font-bold leading-none ${valueClass ?? "text-3xl"}`}>{value}</p>
      <p className="text-[11px] text-muted-foreground mt-2">{sub}</p>
    </div>
  );
}