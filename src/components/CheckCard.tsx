import { cn } from "@/lib/utils";
import { Check, type LucideIcon } from "lucide-react";

interface Props {
  Icon: LucideIcon;
  iconColor: "red" | "orange" | "purple";
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

const ICON_STYLES: Record<
  Props["iconColor"],
  { bg: string; text: string; bar: string; glow: string; checkBorder: string; ring: string }
> = {
  red: {
    bg: "bg-[hsl(0_70%_45%/0.18)]",
    text: "text-[hsl(0_85%_60%)]",
    bar: "bg-[hsl(0_85%_55%)]",
    glow:
      "bg-[linear-gradient(90deg,hsl(0_85%_50%/0.12)_0%,transparent_25%)]",
    checkBorder: "group-hover:border-[hsl(0_85%_60%/0.7)]",
    ring: "focus-visible:ring-[hsl(0_85%_55%/0.6)]",
  },
  orange: {
    bg: "bg-[hsl(28_85%_50%/0.18)]",
    text: "text-[hsl(28_95%_60%)]",
    bar: "bg-[hsl(28_95%_55%)]",
    glow:
      "bg-[linear-gradient(90deg,hsl(28_95%_50%/0.12)_0%,transparent_25%)]",
    checkBorder: "group-hover:border-[hsl(28_95%_60%/0.7)]",
    ring: "focus-visible:ring-[hsl(28_95%_55%/0.6)]",
  },
  purple: {
    bg: "bg-[hsl(265_60%_55%/0.22)]",
    text: "text-[hsl(265_85%_72%)]",
    bar: "bg-[hsl(265_75%_60%)]",
    glow:
      "bg-[linear-gradient(90deg,hsl(265_75%_55%/0.14)_0%,transparent_25%)]",
    checkBorder: "group-hover:border-[hsl(265_85%_72%/0.7)]",
    ring: "focus-visible:ring-[hsl(265_75%_60%/0.6)]",
  },
};

export function CheckCard({ Icon, iconColor, title, description, checked, onToggle }: Props) {
  const styles = ICON_STYLES[iconColor];
  return (
    <button
      onClick={onToggle}
      aria-pressed={checked}
      className={cn(
        "group relative w-full text-left rounded-xl border bg-card/60 border-border px-4 py-4 overflow-hidden",
        "transition-all duration-200 ease-out",
        "hover:bg-card/80 hover:border-border/80 active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        styles.ring,
        checked && "bg-card/90",
      )}
    >
      <span className={cn("absolute left-0 top-0 bottom-0 w-[3px]", styles.bar)} />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-300",
          styles.glow,
          checked ? "opacity-100" : "opacity-70",
        )}
      />
      <div className="relative flex items-center gap-4">
        <div
          className={cn(
            "shrink-0 h-11 w-11 rounded-full flex items-center justify-center transition-transform duration-200",
            checked && "scale-105",
            styles.bg,
          )}
        >
          <Icon className={cn("h-5 w-5", styles.text)} strokeWidth={2.25} />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "text-[15px] font-extrabold uppercase tracking-wide leading-tight transition-colors",
              checked ? "text-foreground" : "text-foreground",
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "text-[13px] mt-1 leading-snug transition-colors",
              checked ? "text-muted-foreground/70 line-through decoration-1" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        </div>
        <div
          className={cn(
            "shrink-0 h-7 w-7 rounded-lg border-2 flex items-center justify-center",
            "transition-all duration-200 ease-out",
            checked
              ? "bg-[hsl(var(--success))] border-[hsl(var(--success))] text-white scale-110 shadow-[0_0_0_4px_hsl(var(--success)/0.18)]"
              : cn("border-muted-foreground/40", styles.checkBorder),
          )}
        >
          <Check
            className={cn(
              "h-4 w-4 transition-all duration-200",
              checked ? "opacity-100 scale-100" : "opacity-0 scale-50",
            )}
            strokeWidth={3.5}
          />
        </div>
      </div>
    </button>
  );
}
