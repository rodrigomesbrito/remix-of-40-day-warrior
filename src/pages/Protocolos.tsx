import { useState } from "react";
import { Link } from "react-router-dom";
import { useProtocol } from "@/hooks/useProtocol";
import {
  PROTOCOL_LENGTH,
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
  ArrowLeft,
  CalendarDays,
  Play,
  Trash2,
} from "lucide-react";

function fmtBR(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y.slice(2)}`;
}

export default function ProtocolosPage() {
  const { state, archive, dayNumber, stats, start, archiveCurrent, removeArchived } =
    useProtocol();

  const [archiveOpen, setArchiveOpen] = useState(false);
  const [archiveName, setArchiveName] = useState("");
  const [startOpen, setStartOpen] = useState(false);
  const [startDate, setStartDate] = useState(todayISO());
  const [confirmDelete, setConfirmDelete] = useState<ArchivedProtocol | null>(null);

  const hasActive = !!state;

  const confirmStart = () => {
    start(startDate);
    setStartOpen(false);
  };

  const confirmArchive = () => {
    archiveCurrent(archiveName);
    setArchiveName("");
    setArchiveOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10 space-y-10">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>

        {/* Header */}
        <header className="space-y-2">
          <p className="text-display text-xs uppercase tracking-[0.25em] text-accent">
            Centro de Protocolos
          </p>
          <h1 className="text-display text-3xl sm:text-4xl font-bold">
            Histórico
          </h1>
          <p className="text-muted-foreground text-sm">
            Seus ciclos passados e o ciclo em andamento.
          </p>
        </header>

        {/* Em andamento */}
        <section className="space-y-3">
          <h2 className="text-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Em andamento
          </h2>

          {hasActive && state ? (
            <Card className="p-5 bg-card/60">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/15 mb-2">
                    Ativo
                  </Badge>
                  <h3 className="font-semibold">40 Dias de Base</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Iniciado em {fmtBR(state.startDate)} · Dia{" "}
                    {Math.min(dayNumber, PROTOCOL_LENGTH)}/{PROTOCOL_LENGTH}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setArchiveOpen(true)}
                >
                  <Archive className="h-4 w-4" />
                  Encerrar
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-5 bg-card/40 border-dashed flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Nenhum ciclo em andamento.
              </p>
              <Button
                size="sm"
                onClick={() => {
                  setStartDate(todayISO());
                  setStartOpen(true);
                }}
              >
                <Play className="h-4 w-4" />
                Iniciar
              </Button>
            </Card>
          )}
        </section>

        {/* Histórico */}
        <section className="space-y-3">
          <h2 className="text-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Arquivados
            <span className="ml-2 normal-case tracking-normal text-muted-foreground/70">
              ({archive.length})
            </span>
          </h2>

          {archive.length === 0 ? (
            <Card className="p-5 bg-card/40 border-dashed text-center">
              <p className="text-sm text-muted-foreground">
                Quando você encerrar um ciclo, ele aparece aqui.
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {archive.map((a) => (
                <Card
                  key={a.id}
                  className="p-4 bg-card/60 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h3 className="font-medium truncate">{a.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <CalendarDays className="h-3 w-3" />
                      {fmtBR(a.startDate)} → {fmtBR(a.endDate)}
                      <span className="mx-1.5">·</span>
                      {Math.round(a.stats.consistencia * 100)}% consistência
                    </p>
                  </div>
                  <button
                    onClick={() => setConfirmDelete(a)}
                    aria-label="Remover do histórico"
                    className="text-muted-foreground hover:text-destructive transition-colors p-1 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Dialogs */}
      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Encerrar ciclo atual</DialogTitle>
            <DialogDescription>
              O ciclo será movido para o histórico. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="cycle-name">Nome (opcional)</Label>
            <Input
              id="cycle-name"
              placeholder="Ex.: Primeira tentativa…"
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
              Arquivar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={startOpen} onOpenChange={setStartOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Iniciar novo protocolo</DialogTitle>
            <DialogDescription>
              Escolha a data de início do ciclo de 40 dias.
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

      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover do histórico?</DialogTitle>
            <DialogDescription>
              Esta ação remove "{confirmDelete?.name}" permanentemente.
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