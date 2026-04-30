import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Props {
  icon: string;
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

export function CheckCard({ icon, title, description, checked, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "group w-full text-left rounded-lg border p-5 transition-all shadow-card",
        "hover:border-primary/60 hover:-translate-y-0.5",
        checked
          ? "bg-secondary border-primary/70"
          : "bg-card border-border"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl leading-none">{icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-display text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div
          className={cn(
            "shrink-0 h-7 w-7 rounded-md border-2 flex items-center justify-center transition-colors",
            checked
              ? "bg-primary border-primary text-primary-foreground"
              : "border-muted-foreground/40 group-hover:border-primary"
          )}
        >
          {checked && <Check className="h-4 w-4" strokeWidth={3} />}
        </div>
      </div>
    </button>
  );
}
