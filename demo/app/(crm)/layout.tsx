import { Sidebar } from "../_components/sidebar";

// Shell da plataforma (CRM): menu lateral fixo + área de conteúdo.
// Envolve /painel, /atendimento, /agenda, /integracoes. Home e /proposta ficam de fora.
export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream text-ink md:flex">
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
