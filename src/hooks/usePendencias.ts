import { useCallback, useEffect, useState } from "react";

export type Prioridade = "alta" | "media" | "baixa";

export interface Pendencia {
  id: string;
  titulo: string;
  prioridade: Prioridade;
  feita: boolean;
  criadaEm: string;
  fechadaEm?: string;
}

const KEY = "protocolo-40-pendencias";

function load(): Pendencia[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Pendencia[];
  } catch {
    return [];
  }
}

function save(items: Pendencia[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function usePendencias() {
  const [items, setItems] = useState<Pendencia[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(load());
    setReady(true);
  }, []);

  const persist = useCallback((next: Pendencia[]) => {
    save(next);
    setItems(next);
  }, []);

  const add = useCallback(
    (titulo: string, prioridade: Prioridade) => {
      const novo: Pendencia = {
        id: crypto.randomUUID(),
        titulo: titulo.trim(),
        prioridade,
        feita: false,
        criadaEm: new Date().toISOString(),
      };
      persist([novo, ...items]);
    },
    [items, persist]
  );

  const toggle = useCallback(
    (id: string) => {
      persist(
        items.map((p) =>
          p.id === id
            ? {
                ...p,
                feita: !p.feita,
                fechadaEm: !p.feita ? new Date().toISOString() : undefined,
              }
            : p
        )
      );
    },
    [items, persist]
  );

  const remove = useCallback(
    (id: string) => {
      persist(items.filter((p) => p.id !== id));
    },
    [items, persist]
  );

  const limparFeitas = useCallback(() => {
    persist(items.filter((p) => !p.feita));
  }, [items, persist]);

  return { ready, items, add, toggle, remove, limparFeitas };
}
