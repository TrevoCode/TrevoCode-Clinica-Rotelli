"use client";

import { useEffect, useState } from "react";

type Painel = {
  kpis: {
    conversas: number;
    pctResolvidasIA: number;
    agendamentos: number;
    escalonamentos: number;
    slotsLivres: number;
  };
  bookings: { id: string; procedimento: string; data: string; hora: string; googleEventLink?: string | null }[];
  escalas: { id: string; motivo: string; urgencia: boolean; trecho: string }[];
  conversas: { id: string; status: string; ultima: string; qtd: number }[];
};

function Kpi({ label, valor, sufixo }: { label: string; valor: number; sufixo?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4 shadow-sm">
      <div className="text-2xl font-extrabold text-brand">
        {valor}
        {sufixo}
      </div>
      <div className="text-muted text-xs mt-1">{label}</div>
    </div>
  );
}

export default function Painel() {
  const [d, setD] = useState<Painel | null>(null);

  useEffect(() => {
    let vivo = true;
    const carregar = async () => {
      try {
        const r = await fetch("/api/painel", { cache: "no-store" });
        const j = await r.json();
        if (vivo) setD(j);
      } catch {
        /* ignore */
      }
    };
    carregar();
    const t = setInterval(carregar, 3000);
    return () => {
      vivo = false;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <header className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Painel da recepção</h1>
        <p className="text-muted text-sm">Visão geral · atualiza sozinho a cada 3s</p>
      </header>

      {!d ? (
        <div className="text-muted">Carregando…</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi label="conversas" valor={d.kpis.conversas} />
            <Kpi label="resolvidas pela IA" valor={d.kpis.pctResolvidasIA} sufixo="%" />
            <Kpi label="agendamentos (IA)" valor={d.kpis.agendamentos} />
            <Kpi label="escalonamentos" valor={d.kpis.escalonamentos} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-5">
            <section className="rounded-2xl border border-line bg-card p-4 shadow-sm">
              <h2 className="font-bold mb-2">📅 Agendamentos feitos pela IA</h2>
              {d.bookings.length === 0 ? (
                <p className="text-muted text-sm">Nenhum ainda.</p>
              ) : (
                <ul className="space-y-2">
                  {d.bookings.map((b) => (
                    <li key={b.id} className="text-sm border-l-2 border-brand pl-2">
                      <span className="font-medium">{b.procedimento}</span>
                      <span className="text-muted"> — {b.data} às {b.hora}</span>
                      {b.googleEventLink ? (
                        <a
                          href={b.googleEventLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1 text-[10px] text-emerald-700 bg-emerald-100 rounded px-1 py-0.5 hover:underline"
                        >
                          ↗ Google Agenda
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-line bg-card p-4 shadow-sm">
              <h2 className="font-bold mb-2">↗️ Fila da recepção (escalonados)</h2>
              {d.escalas.length === 0 ? (
                <p className="text-muted text-sm">Nenhum ainda.</p>
              ) : (
                <ul className="space-y-2">
                  {d.escalas.map((e) => (
                    <li
                      key={e.id}
                      className={`text-sm border-l-2 pl-2 ${e.urgencia ? "border-red-500" : "border-amber-500"}`}
                    >
                      <div className="text-ink/80">
                        {e.urgencia ? "⚠️ URGÊNCIA — " : ""}
                        {e.motivo}
                      </div>
                      <div className="text-muted text-xs">“{e.trecho}”</div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section className="rounded-2xl border border-line bg-card p-4 shadow-sm mt-4">
            <h2 className="font-bold mb-2">💬 Conversas</h2>
            {d.conversas.length === 0 ? (
              <p className="text-muted text-sm">Nenhuma conversa ainda — abra o Atendimento e teste.</p>
            ) : (
              <ul className="space-y-1">
                {d.conversas.map((c) => (
                  <li key={c.id} className="text-sm flex items-center gap-2">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        c.status === "humano" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {c.status === "humano" ? "humano" : "IA"}
                    </span>
                    <span className="text-muted truncate flex-1">{c.ultima}</span>
                    <span className="text-muted/60 text-xs">{c.qtd} msgs</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <p className="text-muted/70 text-xs mt-4">{d.kpis.slotsLivres} horários livres na agenda de demo.</p>
        </>
      )}
    </div>
  );
}
