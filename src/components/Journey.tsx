import { JourneyGrid } from "./JourneyGrid";

export function Journey() {
  return (
    <div className="space-y-6">
      {/* Calendário */}
      <div>
        <h3 className="text-display text-sm font-semibold mb-3 tracking-widest text-muted-foreground">Calendário da Jornada</h3>
        <JourneyGrid />
      </div>
    </div>
  );
}
