import Link from "next/link";
import {
  MessageCircle, Camera, MessageSquareDashed, Armchair, Flame, Target, Bot, Check, X,
  ArrowUpRight, ShieldCheck, Stethoscope, Lock, LayoutDashboard, CalendarDays, Clapperboard,
  Users, Banknote, TrendingUp, Scale, ArrowDown, ChevronRight,
} from "lucide-react";
import { Logo, PorTrevocode } from "../_components/brand";

// Deck de fechamento da Clínica Rotelli — identidade real (creme/laranja). Ícones Lucide (sem emoji).
// Dados/valores = demonstração.

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-brand text-xs font-bold tracking-[0.18em] uppercase mb-3">{children}</div>;
}

function Slide({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`snap-start min-h-screen flex items-center px-5 py-20 sm:px-10 ${className}`}>
      <div className="max-w-4xl mx-auto w-full min-w-0">{children}</div>
    </section>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-line bg-card p-5 shadow-sm ${className}`}>{children}</div>
  );
}

function IconCard({ Icon, children, className = "", color = "text-brand" }: { Icon: typeof Bot; children: React.ReactNode; className?: string; color?: string }) {
  return (
    <Card className={`flex items-start gap-3 ${className}`}>
      <Icon size={20} className={`${color} shrink-0 mt-0.5`} />
      <div className="min-w-0">{children}</div>
    </Card>
  );
}

function Num({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand text-white text-xs font-bold shrink-0">{n}</span>
  );
}

export default function Proposta() {
  return (
    <main className="h-screen overflow-y-scroll snap-y snap-proximity bg-cream text-ink scroll-smooth">
      {/* Barra fixa */}
      <header className="sticky top-0 z-20 backdrop-blur bg-cream/85 border-b border-line">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-5 py-2.5 sm:px-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <Logo size={34} />
            <div className="leading-tight min-w-0">
              <div className="font-bold text-sm">Clínica Rotelli</div>
              <div className="text-muted text-[10px] -mt-0.5">Odontologia · Harmonização</div>
            </div>
          </div>
          <Link
            href="/atendimento"
            className="flex items-center gap-1 text-xs font-bold rounded-full brand-gradient text-white px-4 py-2 shadow-sm hover:brightness-105 transition"
          >
            Ver o simulador <ChevronRight size={14} />
          </Link>
        </div>
      </header>

      {/* 1 — Capa */}
      <Slide>
        <Logo size={76} className="mb-6" />
        <Eyebrow>Proposta de captação · Clínica Rotelli</Eyebrow>
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight">
          Uma máquina de captação de pacientes —{" "}
          <span className="brand-text-gradient">sem você operar nada.</span>
        </h1>
        <p className="text-muted text-lg mt-6 max-w-2xl">
          Instagram que gera conversa · anúncio que traz paciente · atendimento automático no WhatsApp
          24/7. Você atende — a Trevocode cuida do resto.
        </p>
        <div className="flex flex-wrap gap-3 mt-10">
          <Link
            href="/atendimento"
            className="flex items-center gap-2 rounded-full brand-gradient text-white font-bold px-6 py-3 shadow-lg shadow-brand/20 hover:brightness-105 transition"
          >
            <MessageCircle size={18} /> Abrir o simulador
          </Link>
          <a
            href="#problema"
            className="flex items-center gap-2 rounded-full border border-brand/40 text-brand px-6 py-3 font-semibold hover:bg-brand-soft transition"
          >
            Ver a proposta <ArrowDown size={16} />
          </a>
        </div>
      </Slide>

      {/* 2 — Problema */}
      <Slide className="bg-cream-2">
        <span id="problema" className="block -mt-24 pt-24" />
        <Eyebrow>O problema de hoje</Eyebrow>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8">
          Não é o seu trabalho. É a <span className="brand-text-gradient">captação.</span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <IconCard Icon={Camera}><b>Instagram parado</b> — sua autoridade em implante e harmonização não chega em quem procura.</IconCard>
          <IconCard Icon={MessageSquareDashed}><b>Lead no vácuo</b> — quem manda mensagem espera resposta e desiste.</IconCard>
          <IconCard Icon={Armchair}><b>Cadeira ociosa</b> — horários que poderiam estar preenchidos.</IconCard>
          <IconCard Icon={Flame}><b>"Impulsionar post"</b> sozinho queima dinheiro e não vira paciente.</IconCard>
        </div>
        <p className="text-muted mt-8">
          Você é referência em implante e HOF em São Bernardo. O problema é só fazer isso chegar em quem precisa.
        </p>
      </Slide>

      {/* 3 — Solução */}
      <Slide>
        <Eyebrow>A solução em uma frase</Eyebrow>
        <blockquote className="text-2xl sm:text-4xl font-extrabold leading-snug tracking-tight">
          Instagram e anúncio trazem o paciente → ele cai no WhatsApp → um{" "}
          <span className="brand-text-gradient">atendente de IA responde na hora</span>, tira dúvida e
          agenda → o que é delicado (implante, dor) chega pra você{" "}
          <span className="brand-text-gradient">já organizado.</span>
        </blockquote>
      </Slide>

      {/* 4 — Como funciona (fluxo) */}
      <Slide className="bg-cream-2">
        <Eyebrow>Como funciona</Eyebrow>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8">O fluxo, mastigado</h2>
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <IconCard Icon={Camera}><b>Instagram</b> (orgânico)<div className="text-muted text-sm mt-1">autoridade do Dr. Claudio</div></IconCard>
            <IconCard Icon={Target}><b>Anúncio Meta</b> (pago)<div className="text-muted text-sm mt-1">leva quem procura agora</div></IconCard>
          </div>
          <div className="flex justify-center text-brand"><ArrowDown size={22} /></div>
          <Card className="text-center border-brand/40 bg-brand-soft flex items-center justify-center gap-2">
            <MessageCircle size={18} className="text-brand" /> <b>WhatsApp da clínica</b>
            <span className="text-muted">→</span> <Bot size={18} className="text-brand" /> <b>Atendente de IA “Sofia”</b> (24/7)
          </Card>
          <div className="flex justify-center text-brand"><ArrowDown size={22} /></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <IconCard Icon={Check} color="text-emerald-600"><b>Resolve e agenda</b><div className="text-muted text-sm mt-1">limpeza, avaliação, clareamento — com o Dr. Lucas</div></IconCard>
            <IconCard Icon={ArrowUpRight} color="text-amber-600"><b>Escala pro humano</b><div className="text-muted text-sm mt-1">implante, harmonização, dor, remédio — com o Dr. Claudio</div></IconCard>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <span className="flex items-center gap-1 rounded-full border border-line bg-card px-3 py-1"><ShieldCheck size={14} className="text-brand" /> Nunca inventa</span>
          <span className="flex items-center gap-1 rounded-full border border-line bg-card px-3 py-1"><Stethoscope size={14} className="text-brand" /> Nunca diagnostica nem indica remédio</span>
          <span className="flex items-center gap-1 rounded-full border border-line bg-card px-3 py-1"><Lock size={14} className="text-brand" /> Dentro da LGPD</span>
        </div>
      </Slide>

      {/* 5 — Turnkey */}
      <Slide>
        <Eyebrow>Modelo turnkey (done-for-you)</Eyebrow>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8">
          Você atende. O paciente senta na cadeira. <span className="brand-text-gradient">A gente cuida do resto.</span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <div className="font-bold text-ink/80 mb-2">Vocês NÃO fazem</div>
            <ul className="text-muted text-sm space-y-1.5">
              {["escrever post", "responder DM", "editar vídeo", "mexer em anúncio", "preencher sistema"].map((t) => (
                <li key={t} className="flex items-center gap-2"><X size={14} className="text-red-400 shrink-0" /> {t}</li>
              ))}
            </ul>
          </Card>
          <Card className="border-brand/40 bg-brand-soft">
            <div className="font-bold text-brand-dark mb-2">Vocês SÓ</div>
            <ul className="text-ink/80 text-sm space-y-1.5">
              {["gravam 1 sessão de conteúdo a cada 2–3 semanas (a gente dirige)", "avisam mudança de preço por mensagem", "a recepção assume quando o bot passa um caso"].map((t) => (
                <li key={t} className="flex items-start gap-2"><Check size={14} className="text-emerald-600 shrink-0 mt-0.5" /> {t}</li>
              ))}
            </ul>
          </Card>
        </div>
      </Slide>

      {/* 6 — Demo (CTA principal) */}
      <Slide className="bg-cream-2">
        <Eyebrow>Veja funcionando agora</Eyebrow>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Demonstração ao vivo</h2>
        <p className="text-muted mb-8 max-w-2xl">
          O mesmo cérebro que vai rodar no WhatsApp. Teste: pergunte um preço, marque uma limpeza, peça
          um implante (vai escalar), diga que está com dor (vai acolher e escalar).
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/atendimento" className="bg-card rounded-2xl border border-line p-6 hover:border-brand hover:shadow-md transition">
            <MessageCircle size={26} className="text-brand" />
            <div className="font-bold mt-2">Simulador do WhatsApp</div>
            <div className="text-muted text-sm">Visão do paciente</div>
          </Link>
          <Link href="/painel" className="bg-card rounded-2xl border border-line p-6 hover:border-brand hover:shadow-md transition">
            <LayoutDashboard size={26} className="text-brand" />
            <div className="font-bold mt-2">Painel da recepção</div>
            <div className="text-muted text-sm">Conversas, agenda, escalonamentos</div>
          </Link>
          <Link href="/agenda" className="bg-card rounded-2xl border border-line p-6 hover:border-brand hover:shadow-md transition">
            <CalendarDays size={26} className="text-brand" />
            <div className="font-bold mt-2">Agenda por doutor</div>
            <div className="text-muted text-sm">A clínica liga/desliga horários</div>
          </Link>
        </div>
        <p className="text-muted/70 text-xs mt-6">
          Roda no simulador porque o WhatsApp oficial (Meta) leva alguns dias pra liberar — a experiência é idêntica.
        </p>
      </Slide>

      {/* 7 — Instagram */}
      <Slide>
        <Eyebrow>Captação · orgânico</Eyebrow>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8">Plano de Instagram</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <div className="font-bold mb-2">5 pilares de conteúdo</div>
            <div className="text-muted text-sm">Autoridade &amp; resultados · educação · bastidores/humanização · prova social · oferta. <b className="text-ink/80">~70% valor / 30% oferta.</b></div>
          </Card>
          <Card>
            <div className="font-bold mb-2">Cadência</div>
            <div className="text-muted text-sm">4–5 posts/semana + stories diários. <b className="text-ink/80">Reels</b> puxam alcance; carrossel gera autoridade.</div>
          </Card>
          <Link href="/instagram" className="sm:col-span-2 rounded-2xl border border-brand/40 bg-brand-soft p-5 shadow-sm hover:shadow-md hover:border-brand transition flex items-center gap-3">
            <Clapperboard size={22} className="text-brand-dark shrink-0" />
            <div className="flex-1">
              <div className="font-bold text-brand-dark mb-1">12 posts já prontos — ver o feed</div>
              <div className="text-ink/75 text-sm">Implante · harmonização · “conheça a clínica” · depoimento · clínico geral — gancho + ideia visual + legenda + CTA. Tudo dentro das regras do CFO (CRO do Dr. Claudio na assinatura, sem promessa de resultado).</div>
            </div>
            <ChevronRight size={22} className="text-brand" />
          </Link>
        </div>
      </Slide>

      {/* 8 — Tráfego pago */}
      <Slide className="bg-cream-2">
        <Eyebrow>Captação · pago</Eyebrow>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8">Tráfego pago (Meta)</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <IconCard Icon={Target}><b>Anúncio Click-to-WhatsApp</b> — cai direto no bot. Sem formulário, sem lead frio.</IconCard>
          <IconCard Icon={Users}><b>2 frentes</b> — implante/HOF (ticket alto) + geral/avaliação (volume). Geo São Bernardo.</IconCard>
          <IconCard Icon={Banknote}><b>~R$ 40/dia</b> (~R$ 1.200/mês) — verba paga direto à Meta pela clínica.</IconCard>
          <IconCard Icon={TrendingUp} className="border-brand/40 bg-brand-soft"><b className="text-brand-dark">~10–30 pacientes/mês</b> na cadeira (cenário conservador, calibra nas 2 primeiras semanas).</IconCard>
        </div>
        <p className="text-muted text-sm mt-6 flex items-start gap-2">
          <Scale size={15} className="text-ink/60 shrink-0 mt-0.5" />
          <span>Tudo dentro das regras do <b className="text-ink/80">CFO</b> e da Meta — não colocamos vocês em
          risco no conselho. <b className="text-ink/80">Um implante fechado paga meses de mídia + mensalidade.</b></span>
        </p>
      </Slide>

      {/* 9 — Resultado */}
      <Slide>
        <Eyebrow>O que esperar (honesto)</Eyebrow>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8">Resultado esperado</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="text-center"><div className="text-4xl font-extrabold brand-text-gradient">~10</div><div className="text-muted text-sm mt-1">pacientes novos/mês (meta de referência)</div></Card>
          <Card className="text-center"><div className="text-4xl font-extrabold brand-text-gradient">≥80%</div><div className="text-muted text-sm mt-1">das conversas resolvidas sem humano</div></Card>
          <Card className="text-center"><div className="text-4xl font-extrabold brand-text-gradient">1×/mês</div><div className="text-muted text-sm mt-1">relatório mastigado: conversas, agenda, custo por paciente</div></Card>
        </div>
        <p className="text-muted text-sm mt-6">Sem promessa mágica. Números reais, calibrados, e você vê o funil todo mês.</p>
      </Slide>

      {/* 10 — Investimento */}
      <Slide className="bg-cream-2">
        <Eyebrow>Investimento (valores de exemplo)</Eyebrow>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8">Quanto custa</h2>
        <div className="space-y-3">
          <Card className="flex items-center justify-between gap-3">
            <div><b>Setup</b> <span className="text-muted text-sm">(uma vez) — perfil, bot, WhatsApp oficial, agenda, anúncios, base</span></div>
            <div className="text-2xl font-extrabold text-brand whitespace-nowrap">R$ 2.997</div>
          </Card>
          <Card className="flex items-center justify-between gap-3">
            <div><b>Mensalidade</b> <span className="text-muted text-sm">(turnkey) — conteúdo, edição, postagem, bot, anúncios, relatório</span></div>
            <div className="text-2xl font-extrabold text-brand whitespace-nowrap">R$ 1.997<span className="text-base text-muted">/mês</span></div>
          </Card>
          <Card className="flex items-center justify-between gap-3">
            <div><b>Verba de mídia</b> <span className="text-muted text-sm">— paga direto à Meta pela clínica</span></div>
            <div className="text-2xl font-extrabold text-ink/60 whitespace-nowrap">~R$ 1.200<span className="text-base text-muted">/mês</span></div>
          </Card>
        </div>
        <p className="text-muted text-sm mt-5">
          Ancoragem: <b className="text-ink/80">1 implante fechado/mês já cobre a mensalidade + a mídia.</b> Valores acima são exemplo de demonstração.
        </p>
      </Slide>

      {/* 11 — Faseamento */}
      <Slide>
        <Eyebrow>Como entra</Eyebrow>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8">Faseamento</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Card><div className="text-brand font-extrabold mb-1">Fase 0 · semana 1</div><div className="text-muted text-sm">Número WhatsApp oficial + Meta Business + sessão de base (~30 min) + setup do perfil.</div></Card>
          <Card><div className="text-brand font-extrabold mb-1">Fase 1 · capta + atende</div><div className="text-muted text-sm">Instagram no ar + bot respondendo/agendando + anúncio ligado.</div></Card>
          <Card><div className="text-brand font-extrabold mb-1">Fase 2 · otimiza</div><div className="text-muted text-sm">Integra com o sistema da clínica + escala a verba no que dá ROI + automação de postagem.</div></Card>
        </div>
      </Slide>

      {/* 12 — Próximo passo / fechar */}
      <Slide className="bg-cream-2">
        <Eyebrow>Próximo passo</Eyebrow>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-8">Vamos começar?</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <Card className="flex items-center gap-3"><Num n={1} /> Aprovar o escopo desta proposta.</Card>
          <Card className="flex items-center gap-3"><Num n={2} /> Liberar número de WhatsApp + Instagram + Meta Business.</Card>
          <Card className="flex items-center gap-3"><Num n={3} /> Marcar a sessão de base (~30 min): preços, serviços, horários.</Card>
          <Card className="flex items-center gap-3 border-brand/40 bg-brand-soft"><Num n={4} /> <span><b className="text-brand-dark">Em ~1 semana</b> o Instagram posta e o bot responde.</span></Card>
        </div>
        <blockquote className="text-xl sm:text-2xl font-bold text-ink/80 border-l-4 border-brand pl-4">
          “Dr. Claudio, se a gente colocar isso pra rodar e trouxer as primeiras avaliações já no primeiro
          mês, faz sentido começar?”
        </blockquote>
        <div className="flex flex-wrap gap-3 mt-10">
          <Link href="/atendimento" className="flex items-center gap-2 rounded-full brand-gradient text-white font-bold px-6 py-3 shadow-lg shadow-brand/20 hover:brightness-105 transition"><MessageCircle size={18} /> Abrir o simulador</Link>
          <Link href="/" className="rounded-full border border-brand/40 text-brand px-6 py-3 font-semibold hover:bg-brand-soft transition">Voltar ao início</Link>
        </div>
        <div className="mt-12 flex items-center gap-2">
          <Logo size={26} />
          <span className="text-muted text-sm">Clínica Rotelli · transformando sonhos em sorrisos ·</span>
          <PorTrevocode />
        </div>
      </Slide>
    </main>
  );
}
