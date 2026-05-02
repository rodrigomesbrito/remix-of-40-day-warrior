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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Flame,
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
  if (p >= 0.8) return { text: "text-success", ring: "border-success/40", label: "Forte" };
  if (p >= 0.5) return { text: "text-accent", ring: "border-accent/40", label: "Médio" };
  return { text: "text-primary", ring: "border-primary/40", label: "Fraco" };
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
    <div className="min-h-screen flex flex-col">
      {/* Header no padrão do app (gradient blood) */}
      <header
        className="border-b border-border"
        style={{
          backgroundImage:
            "linear-gradient(135deg, hsl(0 70% 32% / 0.18) 0%, hsl(0 0% 8% / 0) 70%)",
        }}
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-6 pb-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">
                Centro de Protocolos
              </p>
              <h1 className="text-display text-3xl sm:text-4xl font-bold leading-none">
                Histórico
              </h1>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-5 sm:px-8 py-8 space-y-8">
        {/* CTA: Novo Protocolo */}
        <section className="flex justify-end">
          <Button
            onClick={openNew}
            disabled={!!state}
            className="bg-gradient-ember text-primary-foreground hover:opacity-90 font-bold uppercase tracking-wider text-xs"
          >
            <Plus className="h-4 w-4" />
            Novo Protocolo
          </Button>
        </section>

        {/* Em andamento */}
        {state && (
          <section className="space-y-3">
            <SectionLabel>Em andamento</SectionLabel>

            <Link
              to="/"
              aria-label={`Abrir Protocolo #${activeNumber}`}
              className="block group bg-card border border-border rounded-xl shadow-card overflow-hidden hover:border-primary/50 transition-colors"
            >
              <div className="flex items-stretch">
                {/* faixa lateral primary */}
                <div className="w-1 bg-primary shrink-0" />
                <div className="flex-1 flex items-center gap-4 p-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-primary font-bold">
                        <Flame className="h-3 w-3 fill-primary/40" />
                        Ativo
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">40 Dias de Base</span>
                    </div>
                    <h3 className="text-display text-xl font-bold truncate">
                      Protocolo #{activeNumber}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3 w-3" />
                      Iniciado em {fmtBR(state.startDate)} · Dia{" "}
                      <span className="text-foreground font-semibold tabular-nums">
                        {Math.min(dayNumber, PROTOCOL_LENGTH)}/{PROTOCOL_LENGTH}
                      </span>
                    </p>
                    {/* Progresso */}
                    <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-ember"
                        style={{
                          width: `${Math.min(100, (Math.min(dayNumber, PROTOCOL_LENGTH) / PROTOCOL_LENGTH) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              </div>
              <div className="border-t border-border px-5 py-2.5 flex justify-end bg-secondary/30">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setArchiveOpen(true);
                  }}
                  className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                >
                  <Archive className="h-3.5 w-3.5" />
                  Encerrar
                </button>
              </div>
            </Link>
          </section>
        )}

        {/* Arquivados */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <SectionLabel>
              Arquivados
              <span className="ml-2 text-muted-foreground/70 normal-case tracking-normal font-normal">
                ({archive.length})
              </span>
            </SectionLabel>
            {archive.length === 0 && (
              <button
                onClick={seedDemoArchive}
                className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Exemplos
              </button>
            )}
          </div>

          {archive.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-xl p-10 text-center">
              <Archive className="h-7 w-7 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Quando você encerrar um protocolo, ele aparece aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {archive.map((a) => {
                const pct = Math.round(a.stats.consistencia * 100);
                const tone = consistencyTone(a.stats.consistencia);
                return (
                  <article
                    key={a.id}
                    className="bg-card border border-border rounded-xl shadow-card p-4 sm:p-5 flex items-center gap-4 hover:border-border/80 transition-colors"
                  >
                    {/* selo de consistência */}
                    <div
                      className={`shrink-0 h-14 w-14 rounded-full border-2 ${tone.ring} flex flex-col items-center justify-center`}
                    >
                      <span className={`text-display text-sm font-bold tabular-nums ${tone.text}`}>
                        {pct}%
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-display text-base font-bold truncate">
                          {a.name}
                        </h3>
                        <span
                          className={`text-[10px] uppercase tracking-widest font-bold ${tone.text}`}
                        >
                          {tone.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5 mt-1">
                        <CalendarDays className="h-3 w-3" />
                        {fmtBR(a.startDate)} → {fmtBR(a.endDate)}
                        <span className="mx-1 opacity-50">·</span>
                        {a.stats.diasDecorridos} dias
                      </p>
                      {/* mini stats */}
                      <div className="flex items-center gap-3 mt-2 text-[11px]">
                        <span className="text-success font-semibold tabular-nums">
                          {a.stats.fortes} fortes
                        </span>
                        <span className="text-accent font-semibold tabular-nums">
                          {a.stats.minimos} mínimos
                        </span>
                        <span className="text-primary font-semibold tabular-nums">
                          {a.stats.perdidos} perdidos
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setConfirmDelete(a)}
                      aria-label="Remover do histórico"
                      className="text-muted-foreground/50 hover:text-destructive transition-colors p-2 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Modal: Novo Protocolo (rápido, 1 tela) */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-display">Novo Protocolo</DialogTitle>
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
            <DialogTitle className="text-display">
              Encerrar Protocolo #{activeNumber}?
            </DialogTitle>
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
            <DialogTitle className="text-display">Remover do histórico?</DialogTitle>
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] uppercase tracking-widest text-foreground/60 font-bold">
      {children}
    </h2>
  );
}

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-card flex flex-col justify-between">
      <p className="text-[10px] uppercase tracking-widest text-foreground/60 font-bold">
        {label}
      </p>
      <p className="text-display text-2xl sm:text-3xl font-bold mt-2 tabular-nums">
        {value}
      </p>
    </div>
  );
}