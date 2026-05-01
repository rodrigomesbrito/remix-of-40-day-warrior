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

const ICON_STYLES: Record<Props["iconColor"], { bg: string; text: string; bar: string }> = {
  red: {
    bg: "bg-[hsl(0_70%_45%/0.18)]",
    text: "text-[hsl(0_85%_60%)]",
    bar: "bg-[hsl(0_85%_55%)]",
  },
  orange: {
    bg: "bg-[hsl(28_85%_50%/0.18)]",
    text: "text-[hsl(28_95%,60%)]",
    bar: "bg-[hsl(28_95%_55%)]",
  },
  purple: {
    bg: "bg-[hsl(265_60%_55%/0.22)]",
    text: "text-[hsl(265_85%_72%)]",
    bar: "bg-[hsl(265_75%_60%)]",
  },
};

export function CheckCard({ Icon, iconColor, title, description, checked, onToggle }: Props) {
  const styles = ICON_STYLES[iconColor];
  return (
    <button
      onClick={onToggle}
      className={cn(
        "group relative w-full text-left rounded-xl border bg-card/60 border-border px-4 py-4 transition-colors overflow-hidden",
        "hover:bg-card/80",
        checked && "bg-card/90",
      )}
    >
      <span className={cn("absolute left-0 top-0 bottom-0 w-[3px]", styles.bar)} />
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "shrink-0 h-11 w-11 rounded-full flex items-center justify-center",
            styles.bg,
          )}
        >
          <Icon className={cn("h-5 w-5", styles.text)} strokeWidth={2.25} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-extrabold uppercase tracking-wide text-foreground leading-tight">
            {title}
          </h3>
          <p className="text-[13px] text-muted-foreground mt-1 leading-snug">{description}</p>
        </div>
        <div
          className={cn(
            "shrink-0 h-6 w-6 rounded-md border-2 flex items-center justify-center transition-colors",
            checked
              ? "bg-primary border-primary text-primary-foreground"
              : "border-muted-foreground/40 group-hover:border-muted-foreground/70",
          )}
        >
          {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
        </div>
      </div>
    </button>
  );
}
