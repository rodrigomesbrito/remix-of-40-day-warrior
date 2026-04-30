import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { todayISO } from "@/lib/protocol";

interface Props {
  onStart: (startDate: string) => void;
}

export function StartDateSetup({ onStart }: Props) {
  const [date, setDate] = useState(todayISO());

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-8 shadow-deep">
        <p className="text-display text-accent text-sm mb-2">PROTOCOLO</p>
        <h1 className="text-display text-5xl font-bold mb-2">40 Dias de Base</h1>
        <p className="text-muted-foreground mb-8">
          Construir disciplina, fechar ciclos e gerar dinheiro. Você não precisa de
          perfeição. Você precisa de consistência.
        </p>

        <div className="space-y-3 mb-6">
          <Label htmlFor="start" className="text-display text-xs">
            Data de início
          </Label>
          <Input
            id="start"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-secondary"
          />
        </div>

        <Button
          onClick={() => onStart(date)}
          className="w-full text-display tracking-wider"
          size="lg"
        >
          Iniciar Protocolo
        </Button>
      </div>
    </div>
  );
}
