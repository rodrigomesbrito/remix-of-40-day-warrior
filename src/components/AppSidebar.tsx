import { Home, Flag, ClipboardList, Target, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import logoFull from "@/assets/logo-full.png";
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
          "radial-gradient(ellipse 120% 55% at 50% 0%, hsl(0 70% 18% / 0.25) 0%, transparent 65%)",
      }}
    >
      {/* Logo */}
      <div className="px-6 pt-5 pb-4 flex items-center justify-center">
        <img
          src={logoFull}
          alt="Protocolo 40 Dias"
          className="w-[70%] h-auto object-contain"
        />
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
      <div className="relative h-[360px] shrink-0 overflow-hidden">
        <img
          src={mountain}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0E12] via-[#0D0E12]/70 to-transparent" />
        <div className="relative z-10 flex flex-col px-5 pt-2">
          <p className="text-primary text-[40px] leading-none mb-1 font-display">“</p>
          <p className="text-[15px] font-semibold leading-snug text-sidebar-foreground">
            Disciplina hoje,
            <br />
            resultado amanhã.
          </p>
          <p className="text-[12px] text-sidebar-foreground/80 mt-1">
            – Foque no processo.
          </p>
        </div>
      </div>
    </aside>
  );
}