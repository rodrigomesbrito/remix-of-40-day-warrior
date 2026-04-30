import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProtocol } from "@/hooks/useProtocol";
import { StartDateSetup } from "@/components/StartDateSetup";
import { ProtocolHeader } from "@/components/ProtocolHeader";
import { DailyCheckIn } from "@/components/DailyCheckIn";
import { Journey } from "@/components/Journey";
import { ProtocolReference } from "@/components/ProtocolReference";

const Index = () => {
  const { ready, state, start } = useProtocol();

  if (!ready) return null;
  if (!state) return <StartDateSetup onStart={start} />;

  return (
    <div className="min-h-screen">
      <ProtocolHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Tabs defaultValue="hoje" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary mb-8">
            <TabsTrigger value="hoje" className="text-display">Hoje</TabsTrigger>
            <TabsTrigger value="jornada" className="text-display">Jornada</TabsTrigger>
            <TabsTrigger value="protocolo" className="text-display">Protocolo</TabsTrigger>
          </TabsList>
          <TabsContent value="hoje"><DailyCheckIn /></TabsContent>
          <TabsContent value="jornada"><Journey /></TabsContent>
          <TabsContent value="protocolo"><ProtocolReference /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
