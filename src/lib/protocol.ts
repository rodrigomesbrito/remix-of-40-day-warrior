export const PROTOCOL_LENGTH = 40;
export const TARGET_CONSISTENCY = 0.8;

export type DayClassification = "forte" | "minimo" | "perdido";

export interface DayRecord {
  producao: boolean;
  corpo: boolean;
  mentalidade: boolean;
  codigoHonra: boolean;
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
  r: Pick<DayRecord, "producao" | "corpo" | "mentalidade" | "codigoHonra" | "modoMinimo">
): DayClassification {
  const checks = [r.producao, r.corpo, r.mentalidade, r.codigoHonra].filter(Boolean).length;
  if (checks === 0) return "perdido";
  if (r.modoMinimo || checks < 4) return checks >= 2 ? "minimo" : "perdido";
  return "forte";
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
    codigoHonra: false,
    modoMinimo: false,
    nota: "",
    classificacao: "perdido",
    savedAt: new Date().toISOString(),
  };
}
