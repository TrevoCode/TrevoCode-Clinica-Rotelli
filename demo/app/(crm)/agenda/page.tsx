"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Doutor = { id: string; nome: string; especialidade: string };
type Slot = { doutor: string; data: string; hora: string; status: string };
type Grid = {
  doutores: Doutor[];
  dias: { data: string; rotulo: string }[];
  horas: string[];
  slots: Slot[];
};

export default function Agenda() {
  const [g, setG] = useState<Grid | null>(null);
  const [doutor, setDoutor] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    const r = await fetch("/api/agenda", { cache: "no-store" });
    const j: Grid = await r.json();
    setG(j);
    if (!doutor && j.doutores[0]) setDoutor(j.doutores[0].id);
  }
  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function statusDe(data: string, hora: string): string {
    const s = g?.slots.find((x) => x.doutor === doutor && x.data === data && x.hora === hora);
    return s ? s.status : "indisponivel";
  }

  async function toggle(data: string, hora: string) {
    if (salvando) return;
    if (statusDe(data, hora) === "ocupado") return;
    setSalvando(true);
    await fetch("/api/agenda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doutor, data, hora }),
    });
    await carregar();
    setSalvando(false);
  }

  const cor = (st: string) =>
    st === "livre"
      ? "bg-brand text-white border-brand"
      : st === "ocupado"
        ? "bg-amber-400 text-amber-950 border-amber-400 cursor-not-allowed"
        : "bg-cream-2 text-muted/50 border-line hover:border-brand/60";

  const docSel = g?.doutores.find((d) => d.id === doutor);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <header className="mb-3">
        <h1 className="text-2xl font-extrabold tracking-tight">Agenda dos doutores</h1>
        <p className="text-muted text-sm">
          Ligue/desligue os horários livres. O bot marca só nos horários livres do Dr. Lucas (geral);
          implante/harmonização (Dr. Claudio) vai pra atendimento humano.
        </p>
      </header>

      {/* faixa de integração Google Agenda */}
      <div className="rounded-xl border border-line bg-card p-3 mb-4 flex items-center gap-2 text-sm">
        <span className="text-lg">🗓️</span>
        <span className="text-ink/80">
          Agendamentos do bot são gravados direto no <b>Google Agenda</b> do doutor.
        </span>
        <Link href="/integracoes" className="ml-auto text-brand font-semibold whitespace-nowrap hover:underline">
          Gerenciar conexões ›
        </Link>
      </div>

      {!g ? (
        <div className="text-muted">Carregando…</div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {g.doutores.map((d) => (
              <button
                key={d.id}
                onClick={() => setDoutor(d.id)}
                className={`px-3 py-2 rounded-xl text-sm border text-left ${
                  d.id === doutor ? "border-brand bg-brand-soft" : "border-line bg-card text-muted"
                }`}
              >
                <span className="font-semibold text-ink">{d.nome}</span>
                <span className="block text-[10px] text-muted">{d.especialidade}</span>
              </button>
            ))}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-sm">
            <table className="w-full text-center text-sm">
              <thead>
                <tr className="bg-cream-2">
                  <th className="p-2 text-left text-muted font-medium">Dia</th>
                  {g.horas.map((h) => (
                    <th key={h} className="p-2 text-muted font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {g.dias.map((dia) => (
                  <tr key={dia.data} className="border-t border-line">
                    <td className="p-2 text-left text-ink/70 whitespace-nowrap">{dia.rotulo}</td>
                    {g.horas.map((h) => {
                      const st = statusDe(dia.data, h);
                      return (
                        <td key={h} className="p-1">
                          <button
                            onClick={() => toggle(dia.data, h)}
                            disabled={salvando || st === "ocupado"}
                            title={st}
                            className={`w-full py-1.5 rounded-lg border text-[11px] ${cor(st)}`}
                          >
                            {st === "livre" ? "livre" : st === "ocupado" ? "agendado" : "—"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted">
            <span><span className="inline-block w-3 h-3 rounded-sm bg-brand align-middle mr-1" /> livre (bot pode marcar)</span>
            <span><span className="inline-block w-3 h-3 rounded-sm bg-amber-400 align-middle mr-1" /> agendado</span>
            <span><span className="inline-block w-3 h-3 rounded-sm bg-cream-2 border border-line align-middle mr-1" /> indisponível</span>
          </div>
          <p className="text-muted/70 text-xs mt-3">
            {docSel?.nome}: {g.slots.filter((s) => s.doutor === doutor && s.status === "livre").length} horários livres.
          </p>
        </>
      )}
    </div>
  );
}
