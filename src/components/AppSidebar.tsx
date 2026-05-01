import { Home, Flag, ClipboardList, Target, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import logoIcon from "@/assets/logo-icon.png";
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
];

export function AppSidebar({ active, onChange }: Props) {
  const { items } = usePendencias();
  const abertasCount = items.filter((p) => !p.feita).length;

  return (
    <aside
      className="hidden lg:flex flex-col w-[230px] shrink-0 border-r border-sidebar-border h-screen sticky top-0 overflow-hidden"
      style={{
        backgroundColor: "#0D0E12",
        backgroundImage:
          "radial-gradient(ellipse 120% 55% at 50% 0%, hsl(0 70% 18% / 0.08) 0%, transparent 65%)",
      }}
    >
      {/* Logo */}
      <div className="px-6 pt-6 pb-5 flex flex-col items-center justify-center gap-1.5">
        <img
          src={logoIcon}
          alt="Protocolo 40 Dias"
          className="w-[44px] h-auto object-contain"
        />
        <p className="text-sidebar-foreground text-[12px] font-black uppercase tracking-[0.18em] text-center leading-[1.15]">
          Protocolo
          <br />
          40 Dias
        </p>
      </div>

      <div className="h-px bg-sidebar-border mx-4" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 min-h-0">
        <ul className="space-y-2">
          {NAV_ITEMS.map((it, idx) => {
            const Icon = it.icon;
            const isActive = active === it.id;
            const showBadge = it.id === "pendencias" && abertasCount > 0;
            return (
              <li key={it.id}>
                <button
                  onClick={() => onChange(it.id)}
                  className={cn(
                    "relative w-full flex items-center gap-3 pl-3 pr-3 py-4 rounded-md text-[13px] font-medium transition-colors",
                    isActive
                      ? "bg-[hsl(0_60%_22%/0.45)] text-sidebar-foreground"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r bg-primary" />
                  )}
                  <Icon
                    strokeWidth={1.75}
                    className={cn(
                      "h-[18px] w-[18px] shrink-0",
                      isActive ? "text-primary" : "text-sidebar-foreground/70",
                    )}
                  />
                  <span className="flex-1 text-left">{it.label}</span>
                  {showBadge && (
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] inline-flex items-center justify-center px-1.5">
                      {abertasCount}
                    </span>
                  )}
                </button>
                {idx === 4 && <div className="h-px bg-sidebar-border my-3 mx-2" />}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mountain w/ overlaid quote (top) */}
      <div className="relative h-[360px] shrink-0 overflow-hidden opacity-80">
        <img
          src={mountain}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover grayscale-[15%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0E12]/95 via-[#0D0E12]/65 to-[#0D0E12]/20" />
        <div className="absolute top-0 left-0 right-0 z-10 flex flex-col px-5 pt-3">
          <p className="text-primary/90 text-[40px] leading-none mb-1 font-display">“</p>
          <p className="text-[14px] font-semibold leading-snug text-sidebar-foreground">
            Disciplina hoje,
            <br />
            resultado amanhã.
          </p>
          <p className="text-[11px] text-sidebar-foreground/75 mt-1">
            – Foque no processo.
          </p>
        </div>
      </div>
    </aside>
  );
}