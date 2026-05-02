import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProtocol } from "@/hooks/useProtocol";
import { supabase } from "@/integrations/supabase/client";
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
  CalendarDays,
  ChevronRight,
  LogOut,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

function fmtBR(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y.slice(2)}`;
}

function consistencyTone(p: number) {
  if (p >= 0.8) return "text-emerald-400";
  if (p >= 0.5) return "text-amber-400";
  return "text-rose-400";
}

export default function ProtocolosPage() {
  const navigate = useNavigate();
  const {
    state,
    archive,
    dayNumber,
    start,
    archiveCurrent,
    removeArchived,
    seedDemoArchive,
  } = useProtocol();

  // O número do próximo protocolo é baseado em (arquivados + ativo)
  const nextNumber = useMemo(
    () => archive.length + (state ? 1 : 0) + 1,
    [archive.length, state],
  );
  const activeNumber = archive.length + 1;

  const [archiveOpen, setArchiveOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState(todayISO());
  const [confirmDelete, setConfirmDelete] = useState<ArchivedProtocol | null>(null);

  const openNew = () => {
    if (state) {
      toast.error("Encerre o protocolo atual antes de iniciar um novo.");
      return;
    }
    setNewName(`Protocolo #${nextNumber}`);
    setNewDate(todayISO());
    setNewOpen(true);
  };

  const confirmStart = () => {
    start(newDate);
    setNewOpen(false);
    toast.success("Protocolo iniciado!");
    navigate("/");
  };

  const confirmArchive = () => {
    archiveCurrent(`Protocolo #${activeNumber}`);
    setArchiveOpen(false);
    toast.success("Protocolo arquivado.");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10 space-y-10">
        {/* Top bar — sair à direita, sem voltar */}
        <div className="flex items-center justify-between">
          <p className="text-display text-xs uppercase tracking-[0.25em] text-accent">
            Centro de Protocolos
          </p>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        {/* Header + CTA principal */}
        <header className="space-y-5">
          <div className="space-y-1">
            <h1 className="text-display text-3xl sm:text-4xl font-bold">
              Histórico
            </h1>
            <p className="text-muted-foreground text-sm">
              Acompanhe seu protocolo ativo e revise os ciclos passados.
            </p>
          </div>
          <Button onClick={openNew} disabled={!!state} className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Novo Protocolo
          </Button>
        </header>

        {/* Em andamento — card clicável que leva ao dashboard */}
        {state && (
          <section className="space-y-3">
            <h2 className="text-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Em andamento
            </h2>

            <Card className="bg-card/60 hover:bg-card/80 transition-colors overflow-hidden">
              <Link
                to="/"
                className="flex items-center gap-4 p-5 group"
                aria-label={`Abrir Protocolo #${activeNumber}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/15">
                      Ativo
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      40 Dias de Base
                    </span>
                  </div>
                  <h3 className="font-semibold truncate">Protocolo #{activeNumber}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Iniciado em {fmtBR(state.startDate)} · Dia{" "}
                    {Math.min(dayNumber, PROTOCOL_LENGTH)}/{PROTOCOL_LENGTH}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </Link>
              <div className="border-t border-border/60 px-5 py-2.5 flex justify-end">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setArchiveOpen(true);
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <Archive className="h-3.5 w-3.5" />
                  Encerrar protocolo
                </button>
              </div>
            </Card>
          </section>
        )}

        {/* Arquivados */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Arquivados
              <span className="ml-2 normal-case tracking-normal text-muted-foreground/70">
                ({archive.length})
              </span>
            </h2>
            {archive.length === 0 && (
              <button
                onClick={seedDemoArchive}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Adicionar exemplos
              </button>
            )}
          </div>

          {archive.length === 0 ? (
            <Card className="p-8 bg-card/40 border-dashed text-center">
              <Archive className="h-6 w-6 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Quando você encerrar um protocolo, ele aparece aqui.
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {archive.map((a) => {
                const pct = Math.round(a.stats.consistencia * 100);
                return (
                  <Card
                    key={a.id}
                    className="p-4 bg-card/60 flex items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{a.name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <CalendarDays className="h-3 w-3" />
                        {fmtBR(a.startDate)} → {fmtBR(a.endDate)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-lg font-semibold tabular-nums ${consistencyTone(a.stats.consistencia)}`}>
                        {pct}%
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                        consistência
                      </p>
                    </div>
                    <button
                      onClick={() => setConfirmDelete(a)}
                      aria-label="Remover do histórico"
                      className="text-muted-foreground/60 hover:text-destructive transition-colors p-1 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Modal: Novo Protocolo (rápido, 1 tela) */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo protocolo</DialogTitle>
            <DialogDescription>
              40 Dias de Base · disciplina, corpo, mente e produção.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="new-name">Nome</Label>
              <Input
                id="new-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={`Protocolo #${nextNumber}`}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-date">Data de início</Label>
              <Input
                id="new-date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Termina em {fmtBR(
                  new Date(new Date(newDate).getTime() + (PROTOCOL_LENGTH - 1) * 86_400_000)
                    .toISOString()
                    .slice(0, 10),
                )}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmStart}>
              <Plus className="h-4 w-4" />
              Iniciar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Encerrar */}
      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Encerrar Protocolo #{activeNumber}?</DialogTitle>
            <DialogDescription>
              Ele será movido para o histórico. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmArchive}>
              <Archive className="h-4 w-4" />
              Encerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Remover do histórico */}
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