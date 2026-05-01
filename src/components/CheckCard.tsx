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
  { bg: string; text: string; bar: string; glow: string }
> = {
  red: {
    bg: "bg-[hsl(0_70%_45%/0.18)]",
    text: "text-[hsl(0_85%_60%)]",
    bar: "bg-[hsl(0_85%_55%)]",
    glow:
      "bg-[linear-gradient(90deg,hsl(0_85%_50%/0.12)_0%,transparent_25%)]",
  },
  orange: {
    bg: "bg-[hsl(28_85%_50%/0.18)]",
    text: "text-[hsl(28_95%_60%)]",
    bar: "bg-[hsl(28_95%_55%)]",
    glow:
      "bg-[linear-gradient(90deg,hsl(28_95%_50%/0.12)_0%,transparent_25%)]",
  },
  purple: {
    bg: "bg-[hsl(265_60%_55%/0.22)]",
    text: "text-[hsl(265_85%_72%)]",
    bar: "bg-[hsl(265_75%_60%)]",
    glow:
      "bg-[linear-gradient(90deg,hsl(265_75%_55%/0.14)_0%,transparent_25%)]",
  },
};

export function CheckCard({ Icon, iconColor, title, description, checked, onToggle }: Props) {
  const styles = ICON_STYLES[iconColor];
  return (
    <button
      onClick={onToggle}
      className={cn(
        "group relative w-full text-left rounded-xl border bg-card/60 border-border px-4 py-4 transition-all overflow-hidden",
        "hover:bg-card/80 hover:border-border/80 hover:-translate-y-[1px]",
        checked && "bg-card/90 border-foreground/15",
      )}
    >
      <span
        className={cn(
          "absolute left-0 top-0 bottom-0 w-[3px] transition-opacity",
          styles.bar,
          checked ? "opacity-100" : "opacity-70",
        )}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity",
          styles.glow,
          checked ? "opacity-100" : "opacity-80",
        )}
      />
      <div className="relative flex items-center gap-4">
        <div
          className={cn(
            "shrink-0 h-11 w-11 rounded-full flex items-center justify-center ring-1 ring-inset ring-white/5",
            styles.bg,
          )}
        >
          <Icon className={cn("h-5 w-5", styles.text)} strokeWidth={2.25} />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "text-[15px] font-extrabold uppercase tracking-wide leading-tight transition-colors",
              checked ? "text-foreground" : "text-foreground/95",
            )}
          >
            {title}
          </h3>
          <p className="text-[13px] text-muted-foreground mt-1 leading-snug">{description}</p>
        </div>
        <div
          className={cn(
            "shrink-0 h-6 w-6 rounded-md border-2 flex items-center justify-center transition-all",
            checked
              ? "bg-[hsl(var(--success))] border-[hsl(var(--success))] text-[hsl(var(--success-foreground))] shadow-[0_0_0_4px_hsl(var(--success)/0.18)]"
              : "border-muted-foreground/40 group-hover:border-muted-foreground/70",
          )}
        >
          {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
        </div>
      </div>
    </button>
  );
}
