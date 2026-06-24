"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./brand";

const NAV = [
  { href: "/painel", label: "Painel", icon: "📊" },
  { href: "/atendimento", label: "Atendimento", icon: "💬" },
  { href: "/agenda", label: "Agenda", icon: "🗓️" },
  { href: "/integracoes", label: "Integrações", icon: "🔌" },
];

function Itens({ pathname, onNav }: { pathname: string; onNav?: () => void }) {
  return (
    <>
      {NAV.map((n) => {
        const ativo = pathname === n.href;
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={onNav}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              ativo
                ? "bg-brand text-white shadow-sm shadow-brand/20"
                : "text-ink/70 hover:bg-brand-soft hover:text-brand-dark"
            }`}
          >
            <span className="text-base">{n.icon}</span>
            {n.label}
          </Link>
        );
      })}
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <>
      {/* desktop: sidebar fixa */}
      <aside className="hidden md:flex md:flex-col md:w-60 md:shrink-0 md:h-screen md:sticky md:top-0 border-r border-line bg-card/60 backdrop-blur px-3 py-4">
        <Link href="/" className="flex items-center gap-2.5 px-2 mb-6">
          <Logo size={40} />
          <div className="leading-tight">
            <div className="font-extrabold text-sm">Clínica Rotelli</div>
            <div className="text-muted text-[10px]">plataforma</div>
          </div>
        </Link>
        <nav className="flex flex-col gap-1">
          <Itens pathname={pathname} />
        </nav>
        <div className="mt-auto px-2 pt-4 border-t border-line">
          <Link href="/proposta" className="text-muted text-xs hover:text-brand">
            ← ver a apresentação
          </Link>
          <div className="text-muted/60 text-[10px] mt-2">tecnologia Trevocode 🍀</div>
        </div>
      </aside>

      {/* mobile: barra superior com nav horizontal */}
      <div className="md:hidden sticky top-0 z-20 bg-card/90 backdrop-blur border-b border-line">
        <div className="flex items-center gap-2 px-4 py-2.5">
          <Logo size={32} />
          <span className="font-extrabold text-sm">Clínica Rotelli</span>
          <span className="text-muted text-[10px] ml-auto">plataforma</span>
        </div>
        <nav className="flex gap-1 px-2 pb-2 overflow-x-auto">
          <Itens pathname={pathname} />
        </nav>
      </div>
    </>
  );
}
