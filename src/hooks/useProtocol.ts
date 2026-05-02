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
    updateDay,
    dayNumber,
    inRange,
    stats,
    today: todayISO(),
  };
}
