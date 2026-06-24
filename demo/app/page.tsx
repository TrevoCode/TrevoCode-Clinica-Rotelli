import Link from "next/link";
import { FileText, Camera, MessageCircle, LayoutDashboard, CalendarDays, ChevronRight } from "lucide-react";
import { Logo, PorTrevocode } from "./_components/brand";

const ATALHOS = [
  { href: "/atendimento", Icon: MessageCircle, label: "Atendimento", sub: "WhatsApp + bot" },
  { href: "/painel", Icon: LayoutDashboard, label: "Painel", sub: "visão da recepção" },
  { href: "/agenda", Icon: CalendarDays, label: "Agenda", sub: "horários por doutor" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-cream text-ink flex items-center justify-center p-5 sm:p-6">
      <div className="max-w-xl w-full min-w-0">
        {/* marca */}
        <div className="flex flex-col items-center text-center">
          <Logo size={88} />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4">Clínica Rotelli</h1>
          <p className="text-brand font-semibold text-sm mt-1">Odontologia · Harmonização Orofacial</p>
          <p className="text-muted mt-3 max-w-md">
            Atendimento e agendamento por IA no WhatsApp — respostas na hora, sem deixar ninguém no vácuo.
            <span className="italic"> Transformando sonhos em sorrisos.</span>
          </p>
        </div>

        {/* CTA principal: proposta */}
        <Link
          href="/proposta"
          className="brand-gradient text-white block rounded-3xl p-5 mt-8 shadow-lg shadow-brand/20 hover:brightness-105 transition"
        >
          <div className="font-bold text-lg flex items-center gap-2">
            <FileText size={20} /> Ver a apresentação
            <ChevronRight size={18} className="ml-auto" />
          </div>
          <div className="text-white/85 text-sm mt-0.5">
            Proposta completa: captação, demonstração, investimento e próximos passos.
          </div>
        </Link>

        {/* Instagram — prioridade nº1 do cliente */}
        <Link
          href="/instagram"
          className="bg-card rounded-3xl border border-brand/30 p-5 mt-4 flex items-center gap-3 hover:border-brand hover:shadow-md transition"
        >
          <Camera size={26} className="text-brand" />
          <div className="flex-1">
            <div className="font-bold">O Instagram pronto pra postar</div>
            <div className="text-muted text-sm">Prévia do feed @clinicarotelli com os 12 posts.</div>
          </div>
          <ChevronRight size={22} className="text-brand" />
        </Link>

        {/* atalhos */}
        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          {ATALHOS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="bg-card rounded-2xl border border-line p-5 hover:border-brand hover:shadow-md transition text-center flex flex-col items-center"
            >
              <a.Icon size={26} className="text-brand" />
              <div className="font-bold mt-1.5">{a.label}</div>
              <div className="text-muted text-xs mt-0.5">{a.sub}</div>
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          <PorTrevocode />
          <span className="text-muted/50 text-xs">· demonstração</span>
        </div>
      </div>
    </main>
  );
}
