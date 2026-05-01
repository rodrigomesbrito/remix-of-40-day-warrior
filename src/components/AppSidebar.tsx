import { Home, Flag, ClipboardList, Target, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import shield from "@/assets/shield.png";
import mountain from "@/assets/mountain.jpg";
import { usePendencias } from "@/hooks/usePendencias";

interface Props {
  active: string;
  onChange: (value: string) => void;
}

const items = [
  { id: "hoje", label: "Hoje", icon: Home },
  { id: "jornada", label: "Jornada", icon: Flag },
  { id: "pendencias", label: "Pendências", icon: ClipboardList },
  { id: "meta", label: "Meta", icon: Target },
  { id: "protocolo", label: "Protocolo", icon: BookOpen },
];

export function AppSidebar({ active, onChange }: Props) {
  const { abertas } = usePendencias();

  return (
    <aside className="hidden lg:flex flex-col w-[230px] shrink-0 bg-sidebar border-r border-sidebar-border min-h-screen sticky top-0">
      <div className="px-6 pt-6 pb-8 text-center border-b border-sidebar-border">
        <img src={shield} alt="" width={64} height={64} className="mx-auto mb-3" />
        <p className="text-display text-sm font-bold leading-tight">PROTOCOLO<br />40 DIAS</p>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.id;
          const showBadge = it.id === "pendencias" && abertas.length > 0;
          return (
            <button
              key={it.id}
              onClick={() => onChange(it.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-left">{it.label}</span>
              {showBadge && (
                <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] inline-flex items-center justify-center px-1">
                  {abertas.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-5 border-t border-sidebar-border">
        <p className="text-primary text-xl leading-none mb-2">"</p>
        <p className="text-sm font-semibold leading-snug">
          Disciplina hoje,<br />resultado amanhã.
        </p>
        <p className="text-xs text-muted-foreground italic mt-1">– Foque no processo.</p>
      </div>

      <div className="relative h-[160px] overflow-hidden">
        <img
          src={mountain}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/40 to-transparent" />
      </div>
    </aside>
  );
}