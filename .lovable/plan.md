
# Protocolo 40 Dias de Base — App de Acompanhamento

Um app pessoal para executar e registrar o protocolo de 40 dias, com foco em consistência sobre perfeição.

## Decisões padrão

- **Escopo**: app pessoal, sem login. Dados salvos no `localStorage` do navegador (simples, instantâneo, privado).
- **Início**: na primeira abertura, o app pergunta a data de início do protocolo (default: hoje). Sempre dá pra resetar.
- **Visual**: **Dark Guerreiro** — fundo quase preto, acento vermelho/âmbar, tipografia display bold (ex: Bebas Neue / Oswald) + corpo em Inter. Tom de intensidade e disciplina.
- **Stack**: React + Vite + Tailwind + shadcn (já no projeto). Sem backend.

## Estrutura de telas

App single-page com navegação por abas no topo:

```text
┌─────────────────────────────────────────────┐
│  PROTOCOLO 40 · Dia 07/40 · 🟢 6  🟡 1  🔴 0│
├─────────────────────────────────────────────┤
│  [ Hoje ] [ Jornada ] [ Protocolo ]          │
└─────────────────────────────────────────────┘
```

### 1. Hoje (check-in diário) — tela principal
- Header com dia atual (X/40), streak, % de consistência.
- 4 cards de check (toggle):
  - 💰 **Produção** — 1 avanço relevante feito?
  - 🏋️ **Corpo** — 20–40 min de movimento?
  - 🧠 **Mentalidade** — 20–40 min de leitura/curso?
  - ⚔️ **Código de Honra** — respeitado hoje?
- Toggle **"Modo Mínimo"** (Produção 30min / Corpo 10–15min / Mentalidade 10min) — quando ativo, os checks contam como mínimo.
- Classificação automática do dia: 🟢 Forte (4/4) · 🟡 Mínimo (modo mínimo + checks básicos) · 🔴 Perdido (nada feito).
- Campo de nota livre opcional do dia.
- Botão "Salvar dia".

### 2. Jornada (visão dos 40 dias)
- Grid 8x5 dos 40 dias, cada quadrado colorido (🟢🟡🔴⬜ futuro).
- Clicar em um dia abre modal pra ver/editar o registro.
- Stats no topo: dias fortes, dias mínimos, dias perdidos, % consistência, projeção pra meta de 80%.
- Barra de progresso até a recompensa final (📱 celular novo).

### 3. Protocolo (referência)
- Conteúdo completo do protocolo formatado: objetivo, 4 frentes, código de honra, leis do guerreiro, modo mínimo, recompensa final.
- Tipografia editorial, fácil de reler nos momentos de fraqueza.
- Frase âncora no final: *"Você não precisa de perfeição. Você precisa de consistência."*

## Modelo de dados (localStorage)

```ts
ProtocolState {
  startDate: string (ISO)
  days: Record<dayNumber, {
    producao: boolean
    corpo: boolean
    mentalidade: boolean
    codigoHonra: boolean
    modoMinimo: boolean
    nota?: string
    classificacao: 'forte' | 'minimo' | 'perdido'
    savedAt: string
  }>
}
```

Hook `useProtocol()` centraliza leitura/escrita e cálculos derivados (dia atual, streak, %, etc).

## Design system (a configurar em `index.css` + `tailwind.config.ts`)

- `--background`: preto profundo (HSL ~ `0 0% 6%`)
- `--foreground`: off-white (`0 0% 95%`)
- `--primary`: vermelho-sangue (`0 75% 50%`) — ações e dia forte
- `--accent`: âmbar (`38 95% 55%`) — modo mínimo / destaques
- `--muted`: cinza escuro (`0 0% 14%`)
- `--destructive`: vermelho desbotado para dia perdido
- Verde só pro check ✓ (`142 70% 45%`)
- Tokens de gradiente e shadow pra cards (gradiente sutil vermelho→preto no header).
- Fontes via Google Fonts: **Oswald** (display, uppercase, tracking largo) + **Inter** (corpo).

## Componentes a criar

```text
src/
├── pages/Index.tsx            (shell com tabs)
├── components/
│   ├── ProtocolHeader.tsx     (dia atual, stats rápidos)
│   ├── DailyCheckIn.tsx       (tela Hoje)
│   ├── CheckCard.tsx          (card de cada frente)
│   ├── JourneyGrid.tsx        (grid 40 dias)
│   ├── DayDetailDialog.tsx    (modal de edição)
│   ├── ProtocolReference.tsx  (tela do protocolo)
│   └── StartDateSetup.tsx     (onboarding inicial)
├── hooks/useProtocol.ts
└── lib/protocol.ts            (tipos + cálculos)
```

## SEO

- `<title>`: "Protocolo 40 Dias de Base"
- Meta description sobre disciplina/consistência
- H1 único, semântica correta

## Fora de escopo (pode entrar depois)

- Login multiusuário / sincronização nuvem
- Notificações / lembretes
- Exportação de dados
- Bloco semanal de pendências como módulo separado (por enquanto entra como nota/lembrete na aba Protocolo)
