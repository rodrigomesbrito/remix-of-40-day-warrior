import { useCallback, useEffect, useState } from "react";
import {
  DayRecord,
  PROTOCOL_LENGTH,
  ProtocolState,
  STORAGE_KEY,
  ARCHIVE_KEY,
  ArchivedProtocol,
  classifyDay,
  computeStats,
  currentDayNumber,
  emptyDay,
  todayISO,
} from "@/lib/protocol";

function loadState(): ProtocolState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ProtocolState;
    if (!parsed.startDate || !parsed.days) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveState(s: ProtocolState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function loadArchive(): ArchivedProtocol[] {
  try {
    const raw = localStorage.getItem(ARCHIVE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveArchive(list: ArchivedProtocol[]) {
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(list));
}

export function useProtocol() {
  const [state, setState] = useState<ProtocolState | null>(null);
  const [archive, setArchive] = useState<ArchivedProtocol[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setArchive(loadArchive());
    setReady(true);
  }, []);

  const start = useCallback((startDate: string) => {
    const next: ProtocolState = { startDate, days: {} };
    saveState(next);
    setState(next);
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(null);
  }, []);

  const archiveCurrent = useCallback((name?: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const stats = computeStats(prev);
      const entry: ArchivedProtocol = {
        id: `cycle-${Date.now()}`,
        name: name?.trim() || `Ciclo iniciado em ${prev.startDate}`,
        startDate: prev.startDate,
        endDate: todayISO(),
        days: prev.days,
        stats,
        archivedAt: new Date().toISOString(),
      };
      const nextArchive = [entry, ...loadArchive()];
      saveArchive(nextArchive);
      setArchive(nextArchive);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    });
  }, []);

  const removeArchived = useCallback((id: string) => {
    setArchive((prev) => {
      const next = prev.filter((a) => a.id !== id);
      saveArchive(next);
      return next;
    });
  }, []);

  const seedDemoArchive = useCallback(() => {
    const samples: ArchivedProtocol[] = [
      {
        id: `cycle-demo-1-${Date.now()}`,
        name: "Ciclo de teste — Forte",
        startDate: "2025-01-10",
        endDate: "2025-02-18",
        days: {},
        stats: {
          fortes: 32,
          minimos: 6,
          perdidos: 2,
          registrados: 40,
          consistencia: 0.95,
          streak: 18,
          diasDecorridos: 40,
        },
        archivedAt: new Date().toISOString(),
      },
      {
        id: `cycle-demo-2-${Date.now() + 1}`,
        name: "Ciclo de teste — Médio",
        startDate: "2024-11-01",
        endDate: "2024-12-10",
        days: {},
        stats: {
          fortes: 14,
          minimos: 14,
          perdidos: 12,
          registrados: 40,
          consistencia: 0.7,
          streak: 6,
          diasDecorridos: 40,
        },
        archivedAt: new Date().toISOString(),
      },
      {
        id: `cycle-demo-3-${Date.now() + 2}`,
        name: "Ciclo de teste — Fraco",
        startDate: "2024-08-15",
        endDate: "2024-09-08",
        days: {},
        stats: {
          fortes: 4,
          minimos: 5,
          perdidos: 16,
          registrados: 25,
          consistencia: 0.36,
          streak: 2,
          diasDecorridos: 25,
        },
        archivedAt: new Date().toISOString(),
      },
      {
        id: `cycle-demo-4-${Date.now() + 3}`,
        name: "Ciclo de teste — Abandonado",
        startDate: "2024-05-02",
        endDate: "2024-05-10",
        days: {},
        stats: {
          fortes: 1,
          minimos: 2,
          perdidos: 6,
          registrados: 9,
          consistencia: 0.33,
          streak: 0,
          diasDecorridos: 9,
        },
        archivedAt: new Date().toISOString(),
      },
    ];
    const next = [...samples, ...loadArchive()];
    saveArchive(next);
    setArchive(next);
  }, []);

  const updateDay = useCallback((dayNumber: number, patch: Partial<DayRecord>) => {
    setState((prev) => {
      if (!prev) return prev;
      const existing = prev.days[dayNumber] ?? emptyDay();
      const merged: DayRecord = { ...existing, ...patch };
      merged.classificacao = classifyDay(merged);
      merged.savedAt = new Date().toISOString();
      const next: ProtocolState = {
        ...prev,
        days: { ...prev.days, [dayNumber]: merged },
      };
      saveState(next);
      return next;
    });
  }, []);

  const dayNumber = state ? currentDayNumber(state.startDate) : 0;
  const inRange = dayNumber >= 1 && dayNumber <= PROTOCOL_LENGTH;
  const stats = state ? computeStats(state) : null;

  return {
    ready,
    state,
    archive,
    start,
    reset,
    archiveCurrent,
    removeArchived,
    seedDemoArchive,
    updateDay,
    dayNumber,
    inRange,
    stats,
    today: todayISO(),
  };
}
