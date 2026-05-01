import { Home, Flag, ClipboardList, Target, BookOpen, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import shield from "@/assets/shield.png";
import mountain from "@/assets/mountain.jpg";
import { usePendencias } from "@/hooks/usePendencias";

interface Props {
  active: string;
  onChange: (value: string) => void;
}

const NAV_ITEMS = [
  { id: "hoje", label: "Hoje", icon: Home },
  { id: "jornada", label: "Jornada", icon: Flag },
  { id: "pendencias", label: "Pendências", icon: ClipboardList },
  { id: "meta", label: "Meta", icon: Target },
  { id: "protocolo", label: "Protocolo", icon: BookOpen },
  { id: "estatisticas", label: "Estatísticas", icon: BarChart3 },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];

export function AppSidebar({ active, onChange }: Props) {
  const { items } = usePendencias();
  const abertasCount = items.filter((p) => !p.feita).length;

  return (
    <aside
      className="hidden lg:flex flex-col w-[220px] shrink-0 bg-sidebar border-r border-sidebar-border min-h-screen sticky top-0"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at top, hsl(0 75% 14% / 0.55), transparent 55%)",
      }}
    >
      {/* Logo */}
      <div className="px-6 pt-7 pb-6 flex items-center justify-center">
        <img
          src={shield}
          alt="Protocolo 40 Dias"
          className="h-[110px] w-auto object-contain"
          style={{ filter: "drop-shadow(0 0 14px hsl(0 85% 50% / 0.5))" }}
        />
      </div>

      <div className="h-px bg-sidebar-border mx-4" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-0">
          {NAV_ITEMS.map((it, idx) => {
            const Icon = it.icon;
            const isActive = active === it.id;
            const showBadge = it.id === "pendencias" && abertasCount > 0;
            return (
              <li key={it.id}>
                <button
                  onClick={() => onChange(it.id)}
                  className={cn(
                    "relative w-full flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-md text-[13px] font-semibold transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r bg-primary" />
                  )}
                  <Icon
                    className={cn(
                      "h-[17px] w-[17px] shrink-0",
                      isActive ? "text-primary" : "text-sidebar-foreground/60",
                    )}
                  />
                  <span className="flex-1 text-left">{it.label}</span>
                  {showBadge && (
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[20px] h-[20px] inline-flex items-center justify-center px-1.5">
                      {abertasCount}
                    </span>
                  )}
                </button>
                {(idx === 4) && <div className="h-px bg-sidebar-border my-2 mx-1" />}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Quote */}
      <div className="px-5 pt-4 pb-5 border-t border-sidebar-border">
        <p className="text-primary text-3xl leading-none mb-1 font-display">“</p>
        <p className="text-[13px] font-semibold leading-snug text-sidebar-foreground">
          Disciplina hoje,
          <br />
          resultado amanhã.
        </p>
        <p className="text-[11px] text-muted-foreground italic mt-1.5">
          – Foque no processo.
        </p>
      </div>

      {/* Mountain */}
      <div className="relative h-[150px] overflow-hidden">
        <img
          src={mountain}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/30 to-transparent" />
      </div>
    </aside>
  );
}