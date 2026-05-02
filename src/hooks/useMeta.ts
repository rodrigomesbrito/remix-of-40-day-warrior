import { useCallback, useEffect, useState } from "react";

const META_KEY = "protocolo-40-meta";

export interface MetaState {
  alvo: number; // R$
  atual: number; // R$
  descricao: string;
  recompensa: string;
}

const DEFAULT_META: MetaState = {
  alvo: 15000,
  atual: 0,
  descricao: "Gerar R$15.000 em 40 dias",
  recompensa: "",
};

function load(): MetaState {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (!raw) return DEFAULT_META;
    return { ...DEFAULT_META, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_META;
  }
}

export function useMeta() {
  const [meta, setMeta] = useState<MetaState>(DEFAULT_META);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMeta(load());
    setReady(true);
  }, []);

  const update = useCallback((patch: Partial<MetaState>) => {
    setMeta((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(META_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { meta, update, ready };
}