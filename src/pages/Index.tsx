import { useState } from "react";
import { useProtocol } from "@/hooks/useProtocol";
import { StartDateSetup } from "@/components/StartDateSetup";
import { ProtocolHeader } from "@/components/ProtocolHeader";
import { DailyCheckIn } from "@/components/DailyCheckIn";
import { Journey } from "@/components/Journey";
import { ProtocolReference } from "@/components/ProtocolReference";
import { Pendencias } from "@/components/Pendencias";
import { Meta } from "@/components/Meta";
import { Protocolos } from "@/components/Protocolos";
import { AppSidebar } from "@/components/AppSidebar";
import { HojeSideRail } from "@/components/HojeSideRail";

const Index = () => {
  const { ready, state, start } = useProtocol();
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
            {tab === "hoje" && <DailyCheckIn />}
            {tab === "jornada" && <Journey />}
            {tab === "pendencias" && <Pendencias />}
            {tab === "meta" && <Meta />}
            {tab === "protocolos" && <Protocolos />}
            {tab === "protocolo" && <ProtocolReference />}
          </main>

          {tab === "hoje" && (
            <div className="px-4 py-6 pr-6">
              <HojeSideRail />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
