import { useState } from "react";
import { Calendar, Flag, ClipboardList, Target, BookOpen } from "lucide-react";
import { useProtocol } from "@/hooks/useProtocol";
import { StartDateSetup } from "@/components/StartDateSetup";
import { ProtocolHeader } from "@/components/ProtocolHeader";
import { DailyCheckIn } from "@/components/DailyCheckIn";
import { Journey } from "@/components/Journey";
import { ProtocolReference } from "@/components/ProtocolReference";
import { Pendencias } from "@/components/Pendencias";
import { Meta } from "@/components/Meta";
import { AppSidebar } from "@/components/AppSidebar";
import { RightRail } from "@/components/RightRail";
import { usePendencias } from "@/hooks/usePendencias";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "hoje", label: "Hoje", icon: Calendar },
  { id: "jornada", label: "Jornada", icon: Flag },
  { id: "pendencias", label: "Pendências", icon: ClipboardList },
  { id: "meta", label: "Meta", icon: Target },
  { id: "protocolo", label: "Protocolo", icon: BookOpen },
] as const;

const Index = () => {
  const { ready, state, start } = useProtocol();
  const { items: pend } = usePendencias();
  const abertasCount = pend.filter((p) => !p.feita).length;
  const [tab, setTab] = useState<string>("hoje");

  if (!ready) return null;
  if (!state) return <StartDateSetup onStart={start} />;

  return (
    <div className="min-h-screen flex">
      <AppSidebar active={tab} onChange={setTab} />

      <div className="flex-1 min-w-0 flex flex-col">
        <ProtocolHeader />

        <div className="flex flex-1 min-h-0">
          <main className="flex-1 min-w-0 px-5 sm:px-8 py-6">
            {/* Tabs estilo pills (como na referência) */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {TABS.map(({ id, label, icon: Icon }) => {
                const active = tab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap",
                      active
                        ? "bg-primary text-primary-foreground shadow-deep"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                    {id === "pendencias" && abertasCount > 0 && (
                      <span
                        className={cn(
                          "ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold px-1",
                          active ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground",
                        )}
                      >
                        {abertasCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {tab === "hoje" && <DailyCheckIn />}
            {tab === "jornada" && <Journey />}
            {tab === "pendencias" && <Pendencias />}
            {tab === "meta" && <Meta />}
            {tab === "protocolo" && <ProtocolReference />}
          </main>

          {tab === "hoje" && (
            <div className="px-4 py-6 pr-6">
              <RightRail onGoJornada={() => setTab("jornada")} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
