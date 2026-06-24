import Link from "next/link";
import {
  Play, Images, Circle, GraduationCap, Award, Tag, Building2, Heart, Camera,
  Sparkles, ClipboardCheck, MapPin, ChevronLeft, Target, MessageCircle, MoreHorizontal,
} from "lucide-react";
import { Logo, PorTrevocode } from "../_components/brand";

// Mockup do Instagram @clinicarotelli — vitrine "mastigada" pro Dr. Claudio ver o que vai ser postado.
// Conteúdo dos 12 posts vem de apresentacao/PILAR-A-INSTAGRAM.md. Ícones Lucide padronizados por pilar
// e formato (sem emoji). A produção visual real acontece na sessão de gravação pós-fechamento.

type Tipo = "Reels" | "Carrossel" | "Stories";
type Pilar = "Educação" | "Autoridade" | "Oferta" | "Humanização" | "Prova social" | "Bastidores";
type Post = {
  n: number;
  tipo: Tipo;
  pilar: Pilar;
  quem: "Dr. Claudio" | "Dr. Lucas" | "Clínica";
  gancho: string;
  legenda: string;
  cta: string;
};

const POSTS: Post[] = [
  { n: 1, tipo: "Reels", pilar: "Educação", quem: "Dr. Claudio",
    gancho: "Implante dói?",
    legenda: "A pergunta nº1 do consultório. Feito com anestesia, a maioria volta a trabalhar no dia seguinte. O que assusta é o desconhecido — deixa eu explicar em 40s.",
    cta: "Chama no WhatsApp · link na bio" },
  { n: 2, tipo: "Carrossel", pilar: "Autoridade", quem: "Dr. Claudio",
    gancho: "Implante, passo a passo",
    legenda: "Como é colocar um implante, do começo ao fim. Desmistifica e mostra o método.",
    cta: "Quer saber se você pode fazer? Manda mensagem." },
  { n: 3, tipo: "Reels", pilar: "Oferta", quem: "Dr. Claudio",
    gancho: "Perdeu um dente e está adiando?",
    legenda: "Aquele dente que você perdeu e foi 'deixando pra depois'… cada mês conta.",
    cta: "Avaliação pra implante — agende no WhatsApp." },
  { n: 4, tipo: "Reels", pilar: "Educação", quem: "Dr. Claudio",
    gancho: "Cansou de parecer cansada mesmo dormindo bem?",
    legenda: "Harmonização orofacial bem feita é discreta: realça o que você já tem, sem parecer 'feita'.",
    cta: "Vem entender o que combina com o seu rosto — chama no WhatsApp." },
  { n: 5, tipo: "Carrossel", pilar: "Educação", quem: "Dr. Claudio",
    gancho: "Mitos da harmonização orofacial",
    legenda: "Os 3 mitos que mais seguram quem tem vontade de fazer HOF.",
    cta: "Dúvida sobre o seu caso? Manda mensagem." },
  { n: 6, tipo: "Reels", pilar: "Autoridade", quem: "Dr. Claudio",
    gancho: "O que é HOF (e o que NÃO é)",
    legenda: "Harmonização não é exagero. É equilíbrio entre saúde e estética do rosto.",
    cta: "Avaliação personalizada no WhatsApp." },
  { n: 7, tipo: "Reels", pilar: "Oferta", quem: "Dr. Lucas",
    gancho: "Quanto tempo sem ir ao dentista?",
    legenda: "Limpeza a cada 6 meses evita problema caro lá na frente. Sua boca te agradece.",
    cta: "Agende sua avaliação — WhatsApp na bio." },
  { n: 8, tipo: "Carrossel", pilar: "Educação", quem: "Dr. Lucas",
    gancho: "5 sinais de que você precisa de avaliação",
    legenda: "Seu corpo avisa antes de virar problema grande. Olha esses 5 sinais.",
    cta: "Tem algum desses? Chama no WhatsApp." },
  { n: 9, tipo: "Reels", pilar: "Educação", quem: "Dr. Lucas",
    gancho: "Clareamento: o que funciona e o que é mito",
    legenda: "Carvão, limão, bicarbonato? Cuidado. Clareamento seguro é com acompanhamento.",
    cta: "Clareamento seguro com a gente — agende no WhatsApp." },
  { n: 10, tipo: "Reels", pilar: "Humanização", quem: "Clínica",
    gancho: "Se você tem medo de dentista, esse vídeo é pra você",
    legenda: "Conheça a Clínica Rotelli por dentro — o ambiente que faz a diferença.",
    cta: "Venha conhecer sem compromisso — WhatsApp na bio." },
  { n: 11, tipo: "Reels", pilar: "Prova social", quem: "Clínica",
    gancho: "O que a paciente achou",
    legenda: "Quem já sentou na nossa cadeira conta como foi a experiência.",
    cta: "Quer esse resultado também? Manda mensagem." },
  { n: 12, tipo: "Stories", pilar: "Bastidores", quem: "Clínica",
    gancho: "Bastidores do dia + enquete",
    legenda: "Sequência semanal que mantém o perfil vivo e puxa DM.",
    cta: "Responde a enquete e chama no WhatsApp." },
];

const PILAR_ICON: Record<Pilar, typeof Award> = {
  Educação: GraduationCap,
  Autoridade: Award,
  Oferta: Tag,
  Humanização: Building2,
  "Prova social": Heart,
  Bastidores: Camera,
};

const TIPO_ICON: Record<Tipo, typeof Play> = {
  Reels: Play,
  Carrossel: Images,
  Stories: Circle,
};

const HIGHLIGHTS: { Icon: typeof Award; t: string }[] = [
  { Icon: Award, t: "Implante" },
  { Icon: Sparkles, t: "Harmonização" },
  { Icon: Images, t: "Antes/Depois" },
  { Icon: Building2, t: "A Clínica" },
  { Icon: Heart, t: "Depoimentos" },
  { Icon: ClipboardCheck, t: "Avaliação" },
];

// Gradiente quente por pilar — dá variação no feed sem foto real.
const TINT: Record<Pilar, string> = {
  Educação: "from-[#E89A63] to-[#DA6527]",
  Autoridade: "from-[#DA6527] to-[#BF541C]",
  Oferta: "from-[#BF541C] to-[#8A3d12]",
  Humanização: "from-[#E89A63] to-[#BF541C]",
  "Prova social": "from-[#DA6527] to-[#E89A63]",
  Bastidores: "from-[#8A7B6E] to-[#BF541C]",
};

function TipoTag({ tipo }: { tipo: Tipo }) {
  const Icon = TIPO_ICON[tipo];
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold rounded-full bg-card/90 text-brand-dark px-2 py-0.5 shadow-sm">
      <Icon size={11} /> {tipo}
    </span>
  );
}

function Tile({ p }: { p: Post }) {
  const Icon = PILAR_ICON[p.pilar];
  const TipoI = TIPO_ICON[p.tipo];
  return (
    <div className={`relative aspect-square overflow-hidden bg-gradient-to-br ${TINT[p.pilar]} flex flex-col justify-between p-2`}>
      <div className="flex justify-end text-white/90"><TipoI size={13} /></div>
      <div className="flex justify-center text-white drop-shadow"><Icon size={34} strokeWidth={1.5} /></div>
      <div className="text-white text-[10px] sm:text-[11px] font-bold leading-tight line-clamp-2 drop-shadow">
        {p.gancho}
      </div>
    </div>
  );
}

export default function Instagram() {
  return (
    <main className="min-h-screen bg-cream text-ink">
      {/* Barra fixa */}
      <header className="sticky top-0 z-20 backdrop-blur bg-cream/85 border-b border-line">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-5 py-2.5 sm:px-8">
          <div className="flex items-center gap-2.5 min-w-0">
            <Logo size={32} />
            <div className="leading-tight min-w-0">
              <div className="font-bold text-sm">Instagram da clínica</div>
              <div className="text-muted text-[10px] -mt-0.5">prévia do que vamos postar</div>
            </div>
          </div>
          <Link
            href="/proposta"
            className="flex items-center gap-1 text-xs font-bold rounded-full border border-brand/40 text-brand px-4 py-2 hover:bg-brand-soft transition"
          >
            <ChevronLeft size={14} /> Voltar à proposta
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="text-brand text-xs font-bold tracking-[0.18em] uppercase mb-2">Captação · prioridade nº1</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          O Instagram que <span className="brand-text-gradient">trabalha por vocês</span>
        </h1>
        <p className="text-muted mt-3 max-w-2xl">
          Hoje o perfil está parado. Esta é a prévia de como ele vira uma vitrine de autoridade do
          Dr. Claudio que gera conversa no WhatsApp — onde o bot responde na hora e agenda. Conteúdo
          turnkey: a clínica só grava; a Trevocode roteiriza, edita, posta e responde.
        </p>

        {/* ===== Mockup do perfil (estilo telefone) ===== */}
        <div className="mt-8 grid lg:grid-cols-[360px_1fr] gap-8 items-start">
          <div className="mx-auto w-full max-w-[360px] rounded-[2rem] border border-line bg-card shadow-xl shadow-brand/10 overflow-hidden">
            {/* topo do app */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-line">
              <span className="font-bold text-sm">@clinicarotelli</span>
              <MoreHorizontal size={18} className="text-muted" />
            </div>

            {/* header do perfil */}
            <div className="px-4 pt-4">
              <div className="flex items-center gap-5">
                <div className="rounded-full p-[2.5px] bg-gradient-to-tr from-[#E89A63] via-[#DA6527] to-[#BF541C]">
                  <div className="rounded-full p-[2px] bg-card">
                    <Logo size={70} />
                  </div>
                </div>
                <div className="flex-1 flex justify-around text-center">
                  <div><div className="font-bold">12</div><div className="text-muted text-[11px]">posts</div></div>
                  <div><div className="font-bold">2.4k</div><div className="text-muted text-[11px]">seguidores</div></div>
                  <div><div className="font-bold">312</div><div className="text-muted text-[11px]">seguindo</div></div>
                </div>
              </div>

              <div className="mt-3 text-sm">
                <div className="font-bold">Clínica Rotelli · Odontologia</div>
                <div className="text-ink/80 leading-snug mt-0.5">
                  Implante · Harmonização Orofacial · Odontologia geral<br />
                  Dr. Claudio Rotelli — CRO-SP <span className="text-muted">‹nº›</span>
                  <span className="flex items-center gap-1 mt-0.5"><MapPin size={12} className="text-brand" /> São Bernardo do Campo/SP</span>
                  <span className="flex items-center gap-1 text-brand font-semibold mt-0.5"><MessageCircle size={12} /> Agende sua avaliação no WhatsApp</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="text-center text-xs font-semibold rounded-lg bg-brand text-white py-1.5">Mensagem</div>
                <div className="text-center text-xs font-semibold rounded-lg border border-line py-1.5">Seguir</div>
              </div>

              {/* highlights */}
              <div className="flex gap-3 overflow-x-auto py-4">
                {HIGHLIGHTS.map((h) => (
                  <div key={h.t} className="flex flex-col items-center gap-1 shrink-0">
                    <div className="w-14 h-14 rounded-full border border-line bg-cream-2 flex items-center justify-center text-brand"><h.Icon size={20} /></div>
                    <span className="text-[10px] text-muted">{h.t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* grid do feed */}
            <div className="grid grid-cols-3 gap-0.5 border-t border-line">
              {POSTS.map((p) => (
                <Tile key={p.n} p={p} />
              ))}
            </div>

            <div className="px-4 py-3 text-center">
              <span className="text-muted/70 text-[10px]">prévia · imagens são representações</span>
            </div>
          </div>

          {/* ===== Coluna explicativa ===== */}
          <div className="min-w-0">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-line bg-card p-4 shadow-sm">
                <div className="font-bold mb-1">5 pilares · mix 70/30</div>
                <div className="text-muted text-sm">Autoridade · educação · humanização · prova social · oferta. ~70% valor / 30% oferta — quem só vende, perde alcance.</div>
              </div>
              <div className="rounded-2xl border border-line bg-card p-4 shadow-sm">
                <div className="font-bold mb-1">4–5 posts/semana + stories</div>
                <div className="text-muted text-sm">Reels puxam alcance, carrossel gera autoridade. 1 sessão de gravação a cada 2–3 semanas abastece tudo.</div>
              </div>
              <div className="rounded-2xl border border-brand/40 bg-brand-soft p-4 shadow-sm sm:col-span-2 flex items-start gap-2">
                <Target size={18} className="text-brand-dark shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-brand-dark mb-1">Todo post termina no mesmo lugar: o WhatsApp</div>
                  <div className="text-ink/75 text-sm">É lá que o bot pega o lead, responde na hora e agenda. Instagram enche o topo do funil; o bot converte.</div>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-extrabold tracking-tight mt-8 mb-3">Os 12 posts, mastigados</h2>
            <div className="space-y-3">
              {POSTS.map((p) => {
                const Icon = PILAR_ICON[p.pilar];
                return (
                  <div key={p.n} className="rounded-2xl border border-line bg-card p-4 shadow-sm flex gap-3">
                    <div className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${TINT[p.pilar]} flex items-center justify-center text-white`}><Icon size={22} strokeWidth={1.5} /></div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <TipoTag tipo={p.tipo} />
                        <span className="text-[10px] text-muted">{p.pilar} · {p.quem}</span>
                      </div>
                      <div className="font-bold mt-1">{p.n}. “{p.gancho}”</div>
                      <div className="text-muted text-sm mt-0.5">{p.legenda}</div>
                      <div className="flex items-center gap-1 text-brand text-xs font-semibold mt-1"><MessageCircle size={12} /> {p.cta}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA fecha o ciclo */}
        <div className="mt-10 rounded-3xl brand-gradient text-white p-6 sm:p-8 text-center shadow-lg shadow-brand/20">
          <div className="text-xl sm:text-2xl font-extrabold">Quer ver o que acontece depois que o paciente chama?</div>
          <p className="text-white/85 mt-1">O Instagram traz a conversa. O bot responde, orienta e agenda — sem deixar ninguém no vácuo.</p>
          <Link href="/atendimento" className="inline-flex items-center gap-2 mt-4 rounded-full bg-card text-brand font-bold px-6 py-3 hover:brightness-105 transition">
            <MessageCircle size={18} /> Abrir o simulador do WhatsApp
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          <Logo size={24} />
          <span className="text-muted text-sm">Clínica Rotelli · transformando sonhos em sorrisos ·</span>
          <PorTrevocode />
        </div>
      </div>
    </main>
  );
}
