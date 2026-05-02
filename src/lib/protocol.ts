export const PROTOCOL_LENGTH = 40;
export const TARGET_CONSISTENCY = 0.8;

export type DayClassification = "forte" | "minimo" | "perdido";

export interface DayRecord {
  producao: boolean;
  corpo: boolean;
  mentalidade: boolean;
  /** @deprecated mantido por compatibilidade com dados antigos; não impacta o score */
  codigoHonra?: boolean;
  /** Itens marcados do código de honra (referência, não pontua) */
  honra?: string[];
  /** Itens marcados das leis do guerreiro (referência, não pontua) */
  leis?: string[];
  modoMinimo: boolean;
  nota?: string;
  classificacao: DayClassification;
  savedAt: string;
}

export interface ProtocolState {
  startDate: string; // ISO date (YYYY-MM-DD)
  days: Record<number, DayRecord>;
}

export const STORAGE_KEY = "protocolo-40-state";
export const ARCHIVE_KEY = "protocolo-40-archive";

export interface ArchivedProtocol {
  id: string;
  name: string;
  startDate: string;
  endDate: string; // ISO date when archived
  days: Record<number, DayRecord>;
  stats: Stats;
  archivedAt: string;
}

export interface ProtocolTemplate {
  id: string;
  name: string;
  duration: number;
  tagline: string;
  description: string;
  status: "available" | "current" | "soon";
}

export const PROTOCOL_LIBRARY: ProtocolTemplate[] = [
  {
    id: "base-40",
    name: "40 Dias de Base",
    duration: 40,
    tagline: "Disciplina • Corpo • Mente • Produção",
    description:
      "O protocolo fundador. Reconstrução de hábitos pelos 4 pilares com regra de ouro na Produção.",
    status: "current",
  },
  {
    id: "foco-21",
    name: "21 Dias de Foco Profundo",
    duration: 21,
    tagline: "Deep work • sem distrações",
    description:
      "Sprint curto para travar uma meta única de execução: 3h de deep work por dia, sem dispersão.",
    status: "soon",
  },
  {
    id: "corpo-30",
    name: "30 Dias de Corpo",
    duration: 30,
    tagline: "Movimento diário inegociável",
    description:
      "Treino + alimentação + sono. Foco em recuperar base física antes de qualquer outro ciclo.",
    status: "soon",
  },
];

export function todayISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export function diffDays(fromISO: string, toISO: string): number {
  const a = new Date(fromISO + "T00:00:00");
  const b = new Date(toISO + "T00:00:00");
  return Math.floor((b.getTime() - a.getTime()) / 86_400_000);
}

/** Day number 1..40 for "today". Returns 0 if not started, >40 if past. */
export function currentDayNumber(startDate: string): number {
  return diffDays(startDate, todayISO()) + 1;
}

export function classifyDay(
  r: Pick<DayRecord, "producao" | "corpo" | "mentalidade" | "modoMinimo">
): DayClassification {
  // REGRA DE OURO: Produção é o pilar.
  // Sem produção → 🔴 Perdido, independente do resto.
  if (!r.producao) return "perdido";

  // Com produção feita: o dia está salvo.
  // 🟢 Forte = produção + corpo + mentalidade (modo normal, sem ser modo mínimo)
  // 🟡 Mínimo = produção + pelo menos 1 dos outros (corpo OU mentalidade),
  //              ou em modo mínimo mesmo com tudo feito.
  const corpoOk = r.corpo;
  const mentOk = r.mentalidade;

  if (!r.modoMinimo && corpoOk && mentOk) return "forte";
  if (corpoOk || mentOk) return "minimo";
  return "minimo"; // produção feita salva o dia como mínimo, mesmo sem corpo/mentalidade
}

export interface Stats {
  fortes: number;
  minimos: number;
  perdidos: number;
  registrados: number;
  consistencia: number; // 0..1 of dias contabilizados (forte+minimo) sobre dias decorridos
  streak: number;
  diasDecorridos: number; // clamped 0..40
}

export function computeStats(state: ProtocolState): Stats {
  const dayNum = Math.max(0, Math.min(PROTOCOL_LENGTH, currentDayNumber(state.startDate)));
  let fortes = 0, minimos = 0, perdidos = 0;
  for (let i = 1; i <= PROTOCOL_LENGTH; i++) {
    const d = state.days[i];
    if (!d) continue;
    if (d.classificacao === "forte") fortes++;
    else if (d.classificacao === "minimo") minimos++;
    else perdidos++;
  }
  const registrados = fortes + minimos + perdidos;
  const denom = Math.max(1, dayNum);
  const consistencia = (fortes + minimos) / denom;

  // streak: consecutive non-perdido ending at current day
  let streak = 0;
  for (let i = dayNum; i >= 1; i--) {
    const d = state.days[i];
    if (d && d.classificacao !== "perdido") streak++;
    else break;
  }

  return { fortes, minimos, perdidos, registrados, consistencia, streak, diasDecorridos: dayNum };
}

export function emptyDay(): DayRecord {
  return {
    producao: false,
    corpo: false,
    mentalidade: false,
    modoMinimo: false,
    honra: [],
    leis: [],
    nota: "",
    classificacao: "perdido",
    savedAt: new Date().toISOString(),
  };
}

export const HONRA_ITEMS: string[] = [
  "Sem redes sociais inúteis",
  "Sem pornografia",
  "Sem jogos / apostas",
  "Sem álcool",
  "Sem reclamação",
  "Sem entretenimento excessivo",
];

export const LEIS_ITEMS: string[] = [
  "Acordei com intenção (sem celular)",
  "Banho com intenção",
  "Alinhamento / reflexão",
  "Hidratação constante",
  "Alimentação consciente",
  "Descanso estratégico",
];
