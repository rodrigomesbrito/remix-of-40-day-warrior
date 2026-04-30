import { Button } from "@/components/ui/button";
import { useProtocol } from "@/hooks/useProtocol";

export function ProtocolReference() {
  const { state, reset } = useProtocol();

  return (
    <article className="space-y-10 max-w-3xl">
      <Section title="Objetivo">
        <p>
          Construir disciplina, fechar ciclos abertos e gerar dinheiro com consistência,
          retomando o controle da própria vida e eliminando pendências que drenam energia.
        </p>
      </Section>

      <Section title="💰 Produção">
        <p>Foco: gerar resultado financeiro de forma consistente.</p>
        <ul>
          <li>1 entrega ou avanço relevante por dia</li>
          <li>Executar projeto de cliente</li>
          <li>Finalizar parte importante de um site</li>
          <li>Entregar algo que aproxima do pagamento</li>
          <li>Enviar proposta (se surgir)</li>
        </ul>
      </Section>

      <Section title="🏋️ Corpo">
        <p>Foco: aumentar energia, disciplina e consistência.</p>
        <ul>
          <li>20–40 min de treino ou movimento</li>
          <li>Mínimo: 4x na semana</li>
          <li>Academia, treino em casa ou caminhada</li>
        </ul>
      </Section>

      <Section title="🧠 Mentalidade">
        <p>Foco: evolução intencional e construção de clareza.</p>
        <ul>
          <li>20–40 min/dia de leitura ou curso relevante</li>
          <li>Temas: negócio, disciplina, foco, mentalidade</li>
        </ul>
      </Section>

      <Section title="🔥 Pendências">
        <p>Foco: eliminar decisões e tarefas evitadas.</p>
        <ul>
          <li>Bloco semanal dedicado (1–3 horas)</li>
          <li>Negociar dívidas, decisões travadas, burocracias</li>
          <li>Tarefas de até 5 minutos: resolver imediatamente</li>
        </ul>
      </Section>

      <Section title="⚔️ Código de Honra">
        <ul>
          <li>Evitar consumo passivo de redes sociais</li>
          <li>Evitar conteúdo inútil (notícias, fofoca)</li>
          <li>Evitar entretenimento excessivo</li>
          <li>Evitar jogos e apostas</li>
          <li>Evitar pornografia</li>
          <li>Reduzir ou eliminar álcool</li>
          <li>Evitar reclamação constante</li>
        </ul>
      </Section>

      <Section title="🧭 Leis do Guerreiro">
        <ul>
          <li>Acordar com intenção (sem celular)</li>
          <li>Banho com intenção</li>
          <li>Alinhamento rápido (reflexão/devocional)</li>
          <li>Hidratação constante</li>
          <li>Alimentação consciente</li>
          <li>Descanso estratégico</li>
        </ul>
      </Section>

      <Section title="🔻 Modo Mínimo">
        <ul>
          <li>Produção → 30 minutos</li>
          <li>Corpo → 10–15 minutos</li>
          <li>Mentalidade → 10 minutos</li>
        </ul>
        <p className="font-semibold">Regra: nunca zerar o dia.</p>
      </Section>

      <Section title="🏁 Recompensa Final">
        <p>Ao final dos 40 dias com consistência mínima de 80%: <strong>celular novo</strong>.</p>
        <p className="text-muted-foreground">Idealmente com dinheiro gerado durante o protocolo.</p>
      </Section>

      <blockquote className="border-l-4 border-primary pl-5 py-2 text-display text-2xl">
        Você não precisa de perfeição.<br />
        Você precisa de consistência.
      </blockquote>

      {state && (
        <div className="border-t border-border pt-6">
          <p className="text-sm text-muted-foreground mb-3">
            Início registrado: <strong>{state.startDate}</strong>
          </p>
          <Button variant="outline" onClick={reset}>
            Reiniciar protocolo
          </Button>
        </div>
      )}
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-display text-2xl font-bold mb-3 text-primary">{title}</h2>
      <div className="space-y-2 text-foreground/90 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:text-foreground/80">
        {children}
      </div>
    </section>
  );
}
