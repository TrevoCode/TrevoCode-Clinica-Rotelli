import Link from "next/link";
import {
  MessageCircle, CalendarCheck, MapPin, Clock, Phone,
  Sparkles, Stethoscope, ShieldCheck, HeartHandshake, Star, Award, GraduationCap,
  Check, ChevronRight, CreditCard, Smile, Building2, Camera,
} from "lucide-react";
import { Logo, PorTrevocode } from "../_components/brand";

// Site institucional (público) da Clínica Rotelli — one-page premium com fotos reais
// do @clinicarotelli (em /public/rotelli). Marca creme/laranja, ícones Lucide, sem emoji.

const WHATS = "/atendimento"; // no demo aponta pro simulador do bot; em produção: wa.me/<numero>

const NAV = [
  { href: "#especialidades", label: "Especialidades" },
  { href: "#resultados", label: "Resultados" },
  { href: "#equipe", label: "Equipe" },
  { href: "#contato", label: "Contato" },
];

const ESPECIALIDADES = [
  { Icon: Award, t: "Implante Dentário", d: "Recupere dentes perdidos com a segurança de um especialista. Avaliação e planejamento individual.", quem: "Dr. Claudio Rotelli" },
  { Icon: Sparkles, t: "Harmonização Orofacial", d: "Realce natural do seu rosto e do seu sorriso, com equilíbrio entre estética e saúde.", quem: "Dr. Claudio Rotelli" },
  { Icon: Smile, t: "Odontologia Geral", d: "Limpeza, restauração, canal, clareamento e avaliação — o cuidado completo do dia a dia.", quem: "Dr. Lucas" },
];

const DIFERENCIAIS = [
  { Icon: Stethoscope, t: "Atendimento humanizado", d: "Você é ouvido sem pressa. Cada plano é feito pro seu caso." },
  { Icon: ShieldCheck, t: "Segurança e ética", d: "Conduta dentro das normas do conselho, sem promessa milagrosa." },
  { Icon: HeartHandshake, t: "Vence o medo de dentista", d: "Ambiente acolhedor e equipe que explica cada etapa." },
  { Icon: MessageCircle, t: "Resposta rápida", d: "Tire dúvidas e agende pelo WhatsApp, sem ficar no vácuo." },
];

const RESULTADOS = [
  { img: "/rotelli/antes-depois-implante.jpg", t: "Reabilitação do sorriso" },
  { img: "/rotelli/antes-depois-clareamento.jpg", t: "Clareamento e estética" },
  { img: "/rotelli/antes-depois-gengival.jpg", t: "Harmonização do sorriso" },
];

const CLINICA = [
  { img: "/rotelli/recepcao-2.jpg", t: "Recepção" },
  { img: "/rotelli/consultorio.jpg", t: "Consultório" },
  { img: "/rotelli/congresso-eao.jpg", t: "Atualização constante" },
];

const EQUIPE = [
  { nome: "Dr. Claudio Rotelli", papel: "Implante e Harmonização Orofacial", reg: "CRO-SP ‹nº›", Icon: Award,
    bio: "Especialista responsável pelos casos de implante e harmonização orofacial. Atualização constante em congressos internacionais (EAO)." },
  { nome: "Dr. Lucas", papel: "Clínico Geral", reg: "CRO-SP ‹nº›", Icon: GraduationCap,
    bio: "Cuida da porta de entrada: avaliação, limpeza, restaurações, canal e clareamento, com atenção a cada paciente." },
];

const SERVICOS = [
  "Avaliação (primeira consulta)", "Limpeza / profilaxia", "Restauração", "Tratamento de canal",
  "Extração e siso", "Clareamento dental", "Implante dentário", "Harmonização orofacial",
  "Ortodontia (aparelho)", "Odontopediatria",
];

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`px-5 sm:px-8 py-16 sm:py-24 ${className}`}>
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-brand text-xs font-bold tracking-[0.18em] uppercase mb-3">{children}</div>;
}

export default function Site() {
  return (
    <main className="bg-cream text-ink scroll-smooth">
      {/* NAV */}
      <header className="sticky top-0 z-30 backdrop-blur bg-cream/85 border-b border-line">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-5 sm:px-8 py-2.5">
          <Link href="#topo" className="flex items-center gap-2.5 min-w-0">
            <Logo size={36} />
            <div className="leading-tight min-w-0">
              <div className="font-extrabold text-sm">Clínica Rotelli</div>
              <div className="text-muted text-[10px] -mt-0.5">Odontologia · Harmonização</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink/70">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-brand transition">{n.label}</a>
            ))}
          </nav>
          <Link href={WHATS} className="flex items-center gap-1.5 text-xs font-bold rounded-full brand-gradient text-white px-4 py-2 shadow-sm hover:brightness-105 transition">
            <MessageCircle size={14} /> Agendar
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section id="topo" className="relative overflow-hidden">
        <div className="absolute inset-0 brand-gradient opacity-[0.06]" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-14 pb-12 sm:pt-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-brand-dark bg-brand-soft border border-brand/20 rounded-full px-3 py-1 text-xs font-semibold mb-5">
              <MapPin size={13} /> São Bernardo do Campo · SP
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.07]">
              Seu sorriso em boas mãos. <span className="brand-text-gradient">Transformando sonhos em sorrisos.</span>
            </h1>
            <p className="text-muted text-lg mt-5 max-w-xl">
              Implante, harmonização orofacial e odontologia geral. Atendimento humanizado, sem pressa e sem medo.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href={WHATS} className="flex items-center gap-2 rounded-full brand-gradient text-white font-bold px-6 py-3 shadow-lg shadow-brand/20 hover:brightness-105 transition">
                <MessageCircle size={18} /> Agendar pelo WhatsApp
              </Link>
              <a href="#resultados" className="flex items-center gap-2 rounded-full border border-brand/40 text-brand px-6 py-3 font-semibold hover:bg-brand-soft transition">
                Ver resultados <ChevronRight size={16} />
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-sm text-muted">
              <span className="flex items-center gap-1.5"><CalendarCheck size={15} className="text-brand" /> Avaliação sem compromisso</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-brand" /> Especialistas registrados</span>
            </div>
          </div>
          {/* foto real da recepção */}
          <div className="relative">
            <img src="/rotelli/recepcao-2.jpg" alt="Recepção da Clínica Rotelli" className="rounded-3xl shadow-xl shadow-brand/10 w-full object-cover aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]" />
            <div className="absolute -bottom-4 -left-2 sm:left-4 bg-card rounded-2xl shadow-lg border border-line px-4 py-3 flex items-center gap-2">
              <Star size={16} className="text-brand" fill="currentColor" />
              <span className="text-sm font-semibold">Estrutura premium em SBC</span>
            </div>
          </div>
        </div>
      </section>

      {/* ESPECIALIDADES */}
      <Section id="especialidades" className="bg-cream-2">
        <div className="text-center mb-12">
          <Eyebrow>O que fazemos</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Nossas especialidades</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {ESPECIALIDADES.map((e) => (
            <div key={e.t} className="rounded-3xl border border-line bg-card p-6 shadow-sm hover:shadow-md hover:border-brand/40 transition">
              <div className="w-12 h-12 rounded-2xl brand-gradient text-white flex items-center justify-center mb-4"><e.Icon size={24} /></div>
              <h3 className="font-extrabold text-lg">{e.t}</h3>
              <p className="text-muted text-sm mt-2">{e.d}</p>
              <div className="text-brand text-xs font-semibold mt-4 flex items-center gap-1"><Stethoscope size={13} /> {e.quem}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* RESULTADOS (antes e depois) */}
      <Section id="resultados">
        <div className="text-center mb-12">
          <Eyebrow>Antes e depois</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Resultados reais</h2>
          <p className="text-muted mt-3 max-w-2xl mx-auto">Casos reais de pacientes da Clínica Rotelli. Cada sorriso é um plano individual.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {RESULTADOS.map((r) => (
            <figure key={r.img} className="rounded-3xl overflow-hidden border border-line bg-card shadow-sm">
              <img src={r.img} alt={r.t} className="w-full aspect-square object-cover" />
              <figcaption className="px-4 py-3 text-sm font-semibold flex items-center gap-2"><Sparkles size={15} className="text-brand" /> {r.t}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* DIFERENCIAIS */}
      <Section className="bg-cream-2">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Eyebrow>Por que a Rotelli</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Cuidado de verdade, do primeiro contato à cadeira.</h2>
            <p className="text-muted">
              Não é só tratar dente: é entender o seu caso, explicar com clareza e te deixar à vontade.
              Da primeira mensagem no WhatsApp até o resultado final, você é prioridade.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {DIFERENCIAIS.map((d) => (
              <div key={d.t} className="rounded-2xl border border-line bg-card p-5 shadow-sm">
                <d.Icon size={22} className="text-brand" />
                <div className="font-bold mt-2">{d.t}</div>
                <div className="text-muted text-sm mt-1">{d.d}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* EQUIPE */}
      <Section id="equipe">
        <div className="text-center mb-12">
          <Eyebrow>Quem cuida de você</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Nossa equipe</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <img src="/rotelli/equipe.jpg" alt="Equipe da Clínica Rotelli" className="rounded-3xl shadow-xl shadow-brand/10 w-full object-cover aspect-[4/3]" />
          <div className="space-y-4">
            {EQUIPE.map((m) => (
              <div key={m.nome} className="rounded-2xl border border-line bg-card p-5 shadow-sm flex gap-4">
                <div className="w-12 h-12 rounded-xl brand-gradient text-white flex items-center justify-center shrink-0"><m.Icon size={22} /></div>
                <div>
                  <h3 className="font-extrabold">{m.nome}</h3>
                  <div className="text-brand text-sm font-semibold">{m.papel}</div>
                  <div className="text-muted text-xs mb-1">{m.reg}</div>
                  <p className="text-muted text-sm">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* A CLÍNICA (galeria) */}
      <Section className="bg-cream-2">
        <div className="text-center mb-12">
          <Eyebrow>Conheça por dentro</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">A clínica</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {CLINICA.map((c) => (
            <figure key={c.img} className="relative rounded-3xl overflow-hidden border border-line shadow-sm group">
              <img src={c.img} alt={c.t} className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition duration-500" />
              <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent text-white text-sm font-semibold px-4 py-3">{c.t}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* SERVIÇOS */}
      <Section id="servicos">
        <div className="text-center mb-12">
          <Eyebrow>Tratamentos</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Serviços</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SERVICOS.map((s) => (
            <div key={s} className="flex items-center gap-2.5 rounded-xl border border-line bg-card px-4 py-3 text-sm">
              <Check size={16} className="text-emerald-600 shrink-0" /> {s}
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted">
          <span className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5"><CreditCard size={14} className="text-brand" /> Dinheiro, Pix e cartão · até 12x</span>
          <span className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5"><ShieldCheck size={14} className="text-brand" /> Convênios Amil, Bradesco e SulAmérica</span>
        </div>
      </Section>

      {/* DEPOIMENTOS (prints reais de WhatsApp) */}
      <Section className="bg-cream-2">
        <div className="text-center mb-12">
          <Eyebrow>Quem já sorriu com a gente</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Depoimentos de pacientes</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {["/rotelli/depoimento-1.jpg", "/rotelli/depoimento-2.jpg"].map((img) => (
            <div key={img} className="rounded-3xl overflow-hidden border border-line bg-card shadow-sm">
              <img src={img} alt="Depoimento de paciente" className="w-full object-cover" />
            </div>
          ))}
        </div>
        <p className="text-muted/60 text-xs text-center mt-6">Mensagens reais de pacientes, compartilhadas com autorização.</p>
      </Section>

      {/* CONTATO / LOCALIZAÇÃO */}
      <Section id="contato">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Eyebrow>Venha nos visitar</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">Onde estamos</h2>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3"><MapPin size={20} className="text-brand shrink-0" /><div><div className="font-semibold">Endereço</div><div className="text-muted">São Bernardo do Campo / SP <span className="text-muted/60">(endereço completo na confirmação do agendamento)</span></div></div></li>
              <li className="flex items-start gap-3"><Clock size={20} className="text-brand shrink-0" /><div><div className="font-semibold">Horário</div><div className="text-muted">Segunda a sexta, 8h às 18h · Sábado, 8h às 12h</div></div></li>
              <li className="flex items-start gap-3"><Phone size={20} className="text-brand shrink-0" /><div><div className="font-semibold">Contato</div><div className="text-muted">Agendamento e dúvidas pelo WhatsApp</div></div></li>
              <li className="flex items-start gap-3"><Camera size={20} className="text-brand shrink-0" /><div><div className="font-semibold">Instagram</div><div className="text-muted">@clinicarotelli</div></div></li>
            </ul>
          </div>
          <div className="rounded-3xl brand-gradient text-white p-8 flex flex-col justify-center shadow-lg shadow-brand/20">
            <Building2 size={32} className="mb-3" />
            <h3 className="text-2xl font-extrabold">Pronto pra cuidar do seu sorriso?</h3>
            <p className="text-white/85 mt-2">Agende uma avaliação sem compromisso. A gente responde rápido e te orienta pelo WhatsApp.</p>
            <Link href={WHATS} className="inline-flex items-center gap-2 mt-6 rounded-full bg-card text-brand font-bold px-6 py-3 hover:brightness-105 transition w-fit">
              <MessageCircle size={18} /> Falar no WhatsApp
            </Link>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-line px-5 sm:px-8 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Logo size={32} />
            <div className="leading-tight">
              <div className="font-extrabold text-sm">Clínica Rotelli</div>
              <div className="text-muted text-[11px]">Transformando sonhos em sorrisos</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PorTrevocode />
            <span className="text-muted/50 text-xs">· demonstração</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
