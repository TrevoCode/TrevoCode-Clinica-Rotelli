import Link from "next/link";
import {
  Play, Images, Circle, GraduationCap, Award, Tag, Building2, Heart, Camera,
  ChevronLeft, Target, MessageCircle, MoreHorizontal, MapPin,
} from "lucide-react";
import { Logo, PorTrevocode } from "../_components/brand";

// Mockup do Instagram @clinicarotelli — agora com as FOTOS REAIS do perfil (em /public/rotelli).
// Conteúdo dos 12 posts vem de apresentacao/PILAR-A-INSTAGRAM.md. Ícones Lucide, sem emoji.

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
  img: string;
};

const POSTS: Post[] = [
  { n: 1, tipo: "Reels", pilar: "Educação", quem: "Dr. Claudio", img: "/rotelli/antes-depois-implante.jpg",
    gancho: "Implante dói?",
    legenda: "A pergunta nº1 do consultório. Feito com anestesia, a maioria volta a trabalhar no dia seguinte. O que assusta é o desconhecido — deixa eu explicar em 40s.",
    cta: "Chama no WhatsApp · link na bio" },
  { n: 2, tipo: "Carrossel", pilar: "Autoridade", quem: "Dr. Claudio", img: "/rotelli/consultorio.jpg",
    gancho: "Implante, passo a passo",
    legenda: "Como é colocar um implante, do começo ao fim. Desmistifica e mostra o método.",
    cta: "Quer saber se você pode fazer? Manda mensagem." },
  { n: 3, tipo: "Reels", pilar: "Oferta", quem: "Dr. Claudio", img: "/rotelli/antes-depois-gengival.jpg",
    gancho: "Perdeu um dente e está adiando?",
    legenda: "Aquele dente que você perdeu e foi 'deixando pra depois'… cada mês conta.",
    cta: "Avaliação pra implante — agende no WhatsApp." },
  { n: 4, tipo: "Reels", pilar: "Educação", quem: "Dr. Claudio", img: "/rotelli/depoimento-2.jpg",
    gancho: "Cansou de parecer cansada mesmo dormindo bem?",
    legenda: "Harmonização orofacial bem feita é discreta: realça o que você já tem, sem parecer 'feita'.",
    cta: "Vem entender o que combina com o seu rosto — chama no WhatsApp." },
  { n: 5, tipo: "Carrossel", pilar: "Educação", quem: "Dr. Claudio", img: "/rotelli/antes-depois-clareamento.jpg",
    gancho: "Mitos da harmonização orofacial",
    legenda: "Os 3 mitos que mais seguram quem tem vontade de fazer HOF.",
    cta: "Dúvida sobre o seu caso? Manda mensagem." },
  { n: 6, tipo: "Reels", pilar: "Autoridade", quem: "Dr. Claudio", img: "/rotelli/congresso-eao.jpg",
    gancho: "O que é HOF (e o que NÃO é)",
    legenda: "Harmonização não é exagero. É equilíbrio entre saúde e estética do rosto.",
    cta: "Avaliação personalizada no WhatsApp." },
  { n: 7, tipo: "Reels", pilar: "Oferta", quem: "Dr. Lucas", img: "/rotelli/antes-depois-clareamento.jpg",
    gancho: "Quanto tempo sem ir ao dentista?",
    legenda: "Limpeza a cada 6 meses evita problema caro lá na frente. Sua boca te agradece.",
    cta: "Agende sua avaliação — WhatsApp na bio." },
  { n: 8, tipo: "Carrossel", pilar: "Educação", quem: "Dr. Lucas", img: "/rotelli/consultorio.jpg",
    gancho: "5 sinais de que você precisa de avaliação",
    legenda: "Seu corpo avisa antes de virar problema grande. Olha esses 5 sinais.",
    cta: "Tem algum desses? Chama no WhatsApp." },
  { n: 9, tipo: "Reels", pilar: "Educação", quem: "Dr. Lucas", img: "/rotelli/antes-depois-implante.jpg",
    gancho: "Clareamento: o que funciona e o que é mito",
    legenda: "Carvão, limão, bicarbonato? Cuidado. Clareamento seguro é com acompanhamento.",
    cta: "Clareamento seguro com a gente — agende no WhatsApp." },
  { n: 10, tipo: "Reels", pilar: "Humanização", quem: "Clínica", img: "/rotelli/recepcao-2.jpg",
    gancho: "Se você tem medo de dentista, esse vídeo é pra você",
    legenda: "Conheça a Clínica Rotelli por dentro — o ambiente que faz a diferença.",
    cta: "Venha conhecer sem compromisso — WhatsApp na bio." },
  { n: 11, tipo: "Reels", pilar: "Prova social", quem: "Clínica", img: "/rotelli/depoimento-1.jpg",
    gancho: "O que a paciente achou",
    legenda: "Quem já sentou na nossa cadeira conta como foi a experiência.",
    cta: "Quer esse resultado também? Manda mensagem." },
  { n: 12, tipo: "Stories", pilar: "Bastidores", quem: "Clínica", img: "/rotelli/recepcao-1.jpg",
    gancho: "Bastidores do dia + enquete",
    legenda: "Sequência semanal que mantém o perfil vivo e puxa DM.",
    cta: "Responde a enquete e chama no WhatsApp." },
];

const PILAR_ICON: Record<Pilar, typeof Award> = {
  Educação: GraduationCap, Autoridade: Award, Oferta: Tag,
  Humanização: Building2, "Prova social": Heart, Bastidores: Camera,
};
const TIPO_ICON: Record<Tipo, typeof Play> = { Reels: Play, Carrossel: Images, Stories: Circle };

const HIGHLIGHTS: { img: string; t: string }[] = [
  { img: "/rotelli/antes-depois-implante.jpg", t: "Implante" },
  { img: "/rotelli/antes-depois-gengival.jpg", t: "Harmonização" },
  { img: "/rotelli/antes-depois-clareamento.jpg", t: "Antes/Depois" },
  { img: "/rotelli/recepcao-2.jpg", t: "A Clínica" },
  { img: "/rotelli/depoimento-1.jpg", t: "Depoimentos" },
  { img: "/rotelli/consultorio.jpg", t: "Avaliação" },
];

function TipoTag({ tipo }: { tipo: Tipo }) {
  const Icon = TIPO_ICON[tipo];
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold rounded-full bg-card/90 text-brand-dark px-2 py-0.5 shadow-sm">
      <Icon size={11} /> {tipo}
    </span>
  );
}

function Tile({ p }: { p: Post }) {
  const TipoI = TIPO_ICON[p.tipo];
  return (
    <div className="relative aspect-square overflow-hidden">
      <img src={p.img} alt={p.gancho} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
      <div className="absolute top-1.5 right-1.5 text-white/95 drop-shadow"><TipoI size={14} /></div>
      <div className="absolute bottom-1.5 left-1.5 right-1.5 text-white text-[10px] sm:text-[11px] font-bold leading-tight line-clamp-2 drop-shadow">
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
          <Link href="/proposta" className="flex items-center gap-1 text-xs font-bold rounded-full border border-brand/40 text-brand px-4 py-2 hover:bg-brand-soft transition">
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
          Dr. Claudio que gera conversa no WhatsApp — com o conteúdo e as fotos reais da clínica. A clínica
          só grava; a Trevocode roteiriza, edita, posta e responde.
        </p>

        {/* ===== Mockup do perfil (estilo telefone) ===== */}
        <div className="mt-8 grid lg:grid-cols-[360px_1fr] gap-8 items-start">
          <div className="mx-auto w-full max-w-[360px] rounded-[2rem] border border-line bg-card shadow-xl shadow-brand/10 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-line">
              <span className="font-bold text-sm">@clinicarotelli</span>
              <MoreHorizontal size={18} className="text-muted" />
            </div>

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
                <div className="font-bold">Dr. Claudio Rotelli</div>
                <div className="text-ink/80 leading-snug mt-0.5">
                  Implante · Harmonização Orofacial · Odontologia geral<br />
                  CRO-SP <span className="text-muted">‹nº›</span>
                  <span className="flex items-center gap-1 mt-0.5"><MapPin size={12} className="text-brand" /> São Bernardo do Campo/SP</span>
                  <span className="flex items-center gap-1 text-brand font-semibold mt-0.5"><MessageCircle size={12} /> Agende sua avaliação no WhatsApp</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="text-center text-xs font-semibold rounded-lg bg-brand text-white py-1.5">Mensagem</div>
                <div className="text-center text-xs font-semibold rounded-lg border border-line py-1.5">Seguir</div>
              </div>

              {/* highlights com fotos reais */}
              <div className="flex gap-3 overflow-x-auto py-4">
                {HIGHLIGHTS.map((h) => (
                  <div key={h.t} className="flex flex-col items-center gap-1 shrink-0">
                    <div className="w-14 h-14 rounded-full p-[2px] border border-line">
                      <img src={h.img} alt={h.t} className="w-full h-full rounded-full object-cover" />
                    </div>
                    <span className="text-[10px] text-muted">{h.t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* grid do feed com fotos reais */}
            <div className="grid grid-cols-3 gap-0.5 border-t border-line">
              {POSTS.map((p) => <Tile key={p.n} p={p} />)}
            </div>

            <div className="px-4 py-3 text-center">
              <span className="text-muted/70 text-[10px]">fotos reais do perfil · legendas propostas pela Trevocode</span>
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
              {POSTS.map((p) => (
                <div key={p.n} className="rounded-2xl border border-line bg-card p-4 shadow-sm flex gap-3">
                  <img src={p.img} alt={p.gancho} className="shrink-0 w-14 h-14 rounded-xl object-cover" />
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
              ))}
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
