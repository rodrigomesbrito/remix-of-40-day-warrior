import { useState } from "react";
import { useProtocol } from "@/hooks/useProtocol";
import {
  PROTOCOL_LENGTH,
  PROTOCOL_LIBRARY,
  todayISO,
  type ArchivedProtocol,
} from "@/lib/protocol";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Archive,
  Award,
  CalendarDays,
  CheckCircle2,
  Flame,
  History,
  Library,
  Play,
  Sparkles,
  Trash2,
  XCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

function fmtBR(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y.slice(2)}`;
}

export function Protocolos() {
  const { state, archive, dayNumber, stats, start, archiveCurrent, removeArchived } =
    useProtocol();

  const [archiveOpen, setArchiveOpen] = useState(false);
  const [archiveName, setArchiveName] = useState("");
  const [startOpen, setStartOpen] = useState(false);
  const [startDate, setStartDate] = useState(todayISO());
  const [pendingTemplate, setPendingTemplate] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ArchivedProtocol | null>(null);

  const hasActive = !!state;
  const totalCiclos = archive.length + (hasActive ? 1 : 0);
  const totalDiasFortes =
    archive.reduce((acc, a) => acc + a.stats.fortes, 0) + (stats?.fortes ?? 0);
  const melhorConsistencia = Math.max(
    stats?.consistencia ?? 0,
    ...archive.map((a) => a.stats.consistencia),
    0
  );

  const handleStartTemplate = (templateId: string) => {
    if (hasActive) return;
    setPendingTemplate(templateId);
    setStartDate(todayISO());
    setStartOpen(true);
  };

  const confirmStart = () => {
    start(startDate);
    setStartOpen(false);
    setPendingTemplate(null);
  };

  const confirmArchive = () => {
    archiveCurrent(archiveName);
    setArchiveName("");
    setArchiveOpen(false);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <header className="space-y-2">
        <p className="text-display text-xs uppercase tracking-[0.25em] text-accent">
          Centro de Protocolos
        </p>
        <h1 className="text-display text-3xl sm:text-4xl font-bold">
          Sua jornada de disciplina
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Aqui ficam todos os ciclos que você executou, o ciclo atual em andamento e
          os próximos protocolos disponíveis para começar.
        </p>
      </header>

      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard
          icon={<History className="h-4 w-4" />}
          label="Ciclos totais"
          value={String(totalCiclos)}
        />
        <SummaryCard
          icon={<Archive className="h-4 w-4" />}
          label="Arquivados"
          value={String(archive.length)}
        />
        <SummaryCard
          icon={<Flame className="h-4 w-4 text-primary" />}
          label="Dias fortes (total)"
          value={String(totalDiasFortes)}
        />
        <SummaryCard
          icon={<Award className="h-4 w-4 text-accent" />}
          label="Melhor consistência"
          value={`${Math.round(melhorConsistencia * 100)}%`}
        />
      </div>

      {/* Ciclo atual */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <h2 className="text-display text-xs uppercase tracking-[0.2em] text-foreground">
            Em andamento
          </h2>
        </div>

        {hasActive && state && stats ? (
          <Card className="p-5 sm:p-6 border-primary/40 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-1">
                <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/15">
                  Ativo
                </Badge>
                <h3 className="text-display text-2xl font-bold">40 Dias de Base</h3>
                <p className="text-sm text-muted-foreground">
                  Iniciado em {fmtBR(state.startDate)} · Dia{" "}
                  <span className="text-foreground font-semibold">
                    {Math.min(dayNumber, PROTOCOL_LENGTH)}
                  </span>
                  /{PROTOCOL_LENGTH}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setArchiveOpen(true)}
                className="shrink-0"
              >
                <Archive className="h-4 w-4" />
                Encerrar e arquivar
              </Button>
            </div>

            {/* progress */}
            <div className="mt-5 space-y-2">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(100, (dayNumber / PROTOCOL_LENGTH) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                <Stat label="Fortes" value={stats.fortes} tone="success" />
                <Stat label="Mínimos" value={stats.minimos} tone="accent" />
                <Stat label="Perdidos" value={stats.perdidos} tone="destructive" />
                <Stat
                  label="Consistência"
                  value={`${Math.round(stats.consistencia * 100)}%`}
                />
                <Stat label="Streak" value={stats.streak} />
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6 border-dashed border-border/60 bg-card/40 text-center">
            <Sparkles className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhum ciclo em andamento. Inicie um da biblioteca abaixo.
            </p>
          </Card>
        )}
      </section>

      {/* Histórico */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-display text-xs uppercase tracking-[0.2em] text-foreground">
            Histórico
          </h2>
          <span className="text-xs text-muted-foreground">
            ({archive.length} arquivado{archive.length === 1 ? "" : "s"})
          </span>
        </div>

        {archive.length === 0 ? (
          <Card className="p-6 border-dashed border-border/60 bg-card/40 text-center">
            <p className="text-sm text-muted-foreground">
              Quando você encerrar um ciclo, ele aparece aqui com as estatísticas finais.
            </p>
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {archive.map((a) => (
              <ArchivedCard
                key={a.id}
                item={a}
                onDelete={() => setConfirmDelete(a)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Biblioteca */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Library className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-display text-xs uppercase tracking-[0.2em] text-foreground">
            Biblioteca de protocolos
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {PROTOCOL_LIBRARY.map((tpl) => {
            const isCurrent = tpl.id === "base-40" && hasActive;
            const isSoon = tpl.status === "soon";
            return (
              <Card
                key={tpl.id}
                className={cn(
                  "p-5 flex flex-col gap-3 transition-colors",
                  isCurrent && "border-primary/40 bg-primary/5",
                  !isCurrent && !isSoon && "hover:border-primary/30",
                  isSoon && "opacity-70"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {tpl.duration} dias
                    </p>
                    <h3 className="text-display text-lg font-bold leading-tight">
                      {tpl.name}
                    </h3>
                  </div>
                  {isCurrent && (
                    <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/15">
                      Em uso
                    </Badge>
                  )}
                  {isSoon && (
                    <Badge variant="outline" className="text-muted-foreground">
                      Em breve
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-accent font-medium uppercase tracking-wide">
                  {tpl.tagline}
                </p>
                <p className="text-sm text-muted-foreground flex-1">
                  {tpl.description}
                </p>
                <Button
                  size="sm"
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isSoon || isCurrent || (hasActive && !isCurrent)}
                  onClick={() => handleStartTemplate(tpl.id)}
                  className="self-start"
                >
                  <Play className="h-4 w-4" />
                  {isCurrent ? "Em andamento" : isSoon ? "Em breve" : "Iniciar"}
                </Button>
                {hasActive && !isCurrent && !isSoon && (
                  <p className="text-[11px] text-muted-foreground">
                    Encerre o ciclo atual para iniciar outro.
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* Dialog: arquivar */}
      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Encerrar ciclo atual</DialogTitle>
            <DialogDescription>
              O ciclo será movido para o histórico com as estatísticas atuais. Você
              poderá iniciar um novo protocolo em seguida. Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="cycle-name">Nome para este ciclo (opcional)</Label>
            <Input
              id="cycle-name"
              placeholder="Ex.: Primeira tentativa, Reset janeiro…"
              value={archiveName}
              onChange={(e) => setArchiveName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmArchive}>
              <Archive className="h-4 w-4" />
              Arquivar ciclo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: iniciar novo */}
      <Dialog open={startOpen} onOpenChange={setStartOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Iniciar novo protocolo</DialogTitle>
            <DialogDescription>
              Escolha a data de início. O protocolo começa imediatamente a partir dela.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="start-date">Data de início</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStartOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmStart}>
              <Play className="h-4 w-4" />
              Iniciar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: confirmar deletar do histórico */}
      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover do histórico?</DialogTitle>
            <DialogDescription>
              Esta ação remove permanentemente "{confirmDelete?.name}" do histórico.
              Não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmDelete) removeArchived(confirmDelete.id);
                setConfirmDelete(null);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="p-4 bg-card/60">
      <div className="flex items-center gap-2 text-muted-foreground text-[11px] uppercase tracking-wider">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-display text-2xl font-bold mt-1">{value}</p>
    </Card>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone?: "success" | "accent" | "destructive";
}) {
  const toneClass =
    tone === "success"
      ? "text-[hsl(var(--success))]"
      : tone === "accent"
        ? "text-accent"
        : tone === "destructive"
          ? "text-destructive"
          : "text-foreground";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("font-semibold", toneClass)}>{value}</span>
      <span>{label}</span>
    </span>
  );
}

function ArchivedCard({
  item,
  onDelete,
}: {
  item: ArchivedProtocol;
  onDelete: () => void;
}) {
  const consistencia = Math.round(item.stats.consistencia * 100);
  return (
    <Card className="p-5 bg-card/60 hover:border-border transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{item.name}</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <CalendarDays className="h-3 w-3" />
            {fmtBR(item.startDate)} → {fmtBR(item.endDate)}
          </p>
        </div>
        <button
          onClick={onDelete}
          aria-label="Remover do histórico"
          className="text-muted-foreground hover:text-destructive transition-colors p-1"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        <MiniStat
          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
          value={item.stats.fortes}
          label="Fortes"
          tone="success"
        />
        <MiniStat
          icon={<Flame className="h-3.5 w-3.5" />}
          value={item.stats.minimos}
          label="Mínimos"
          tone="accent"
        />
        <MiniStat
          icon={<XCircle className="h-3.5 w-3.5" />}
          value={item.stats.perdidos}
          label="Perdidos"
          tone="destructive"
        />
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>Consistência final</span>
          <span className="font-semibold text-foreground">{consistencia}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-[hsl(var(--success))]"
            style={{ width: `${consistencia}%` }}
          />
        </div>
      </div>
    </Card>
  );
}

function MiniStat({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  tone: "success" | "accent" | "destructive";
}) {
  const toneClass =
    tone === "success"
      ? "text-[hsl(var(--success))]"
      : tone === "accent"
        ? "text-accent"
        : "text-destructive";
  return (
    <div className="rounded-md bg-muted/40 py-2">
      <div className={cn("flex items-center justify-center gap-1", toneClass)}>
        {icon}
        <span className="font-bold">{value}</span>
      </div>
      <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}