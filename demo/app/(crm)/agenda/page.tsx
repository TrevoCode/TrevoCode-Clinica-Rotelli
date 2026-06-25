"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Doutor = { id: string; nome: string; especialidade: string };
type Slot = { doutor: string; data: string; hora: string; status: string };
type Evento = { id: string; doutor: string; data: string; hora: string; fim: string; titulo: string };
type Grid = {
  doutores: Doutor[];
  dia: { data: string; rotulo: string };
  hoje: string;
  horas: string[];
  slots: Slot[];
  eventos: Evento[];
  sincronizado: boolean;
};

const ROW_H = 46;
const TOP = 10;
const PROCS = ["Avaliação", "Limpeza", "Restauração", "Clareamento", "Canal", "Extração", "Retorno", "Consulta"];
const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);

function addDias(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  while (d.getUTCDay() === 0) d.setUTCDate(d.getUTCDate() + (n >= 0 ? 1 : -1));
  return d.toISOString().slice(0, 10);
}
function agoraMin(): number {
  const s = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
  return toMin(s);
}

export default function Agenda() {
  const [g, setG] = useState<Grid | null>(null);
  const [doutor, setDoutor] = useState("");
  const [dataSel, setDataSel] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [nowMin, setNowMin] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);

  // edição
  const [novo, setNovo] = useState<{ hora: string } | null>(null);
  const [ver, setVer] = useState<Evento | null>(null);
  const [tipo, setTipo] = useState<"consulta" | "bloqueio">("consulta");
  const [paciente, setPaciente] = useState("");
  const [procedimento, setProcedimento] = useState("Consulta");
  const [motivo, setMotivo] = useState("Bloqueado");
  const [horaIni, setHoraIni] = useState("09:00");
  const [dur, setDur] = useState(30);
  const [salvando, setSalvando] = useState(false);

  async function carregar(dia?: string) {
    setCarregando(true);
    try {
      const j: Grid = await fetch(`/api/agenda${dia ? `?dia=${dia}` : ""}`, { cache: "no-store" }).then((r) => r.json());
      setG(j);
      setDoutor((d) => d || j.doutores[0]?.id || "");
      setDataSel(j.dia.data);
    } catch {
      /* ignore */
    }
    setCarregando(false);
  }
  useEffect(() => {
    carregar();
  }, []);
  useEffect(() => {
    const tick = () => setNowMin(agoraMin());
    tick();
    const t = setInterval(tick, 60000);
    return () => clearInterval(t);
  }, []);

  const times = g?.horas ?? [];
  const baseMin = times.length ? toMin(times[0]) : 420;
  const lastMin = times.length ? toMin(times[times.length - 1]) + 30 : 1080;
  const isHoje = !!g && g.dia.data === g.hoje;
  const eventosDoDia = (g?.eventos ?? []).filter((e) => e.doutor === doutor);
  const livresNoDia = (g?.slots ?? []).filter((s) => s.doutor === doutor && s.status === "livre").length;
  const nowPos = ((nowMin - baseMin) / 30) * ROW_H + TOP;
  const docNome = g?.doutores.find((d) => d.id === doutor)?.nome ?? "";

  useEffect(() => {
    if (!g || !scrollRef.current) return;
    const alvo = isHoje && nowMin >= baseMin && nowMin <= lastMin ? nowPos - 120 : ((toMin("08:00") - baseMin) / 30) * ROW_H - 8;
    scrollRef.current.scrollTop = Math.max(0, alvo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g]);

  function abrirNovo(hora: string) {
    setHoraIni(hora);
    setTipo("consulta");
    setPaciente("");
    setProcedimento("Consulta");
    setMotivo("Bloqueado");
    setDur(30);
    setNovo({ hora });
  }
  async function salvar() {
    if (!g) return;
    setSalvando(true);
    const fim = hhmm(Math.min(toMin(horaIni) + dur, lastMin));
    const summary = tipo === "consulta" ? `${procedimento}${paciente.trim() ? ` — ${paciente.trim()}` : ""}` : motivo.trim() || "Bloqueado";
    await fetch("/api/agenda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doutor, summary, data: g.dia.data, hora: horaIni, fim }),
    });
    setNovo(null);
    setSalvando(false);
    await carregar(dataSel);
  }
  async function remover() {
    if (!ver) return;
    setSalvando(true);
    await fetch("/api/agenda", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doutor, id: ver.id }),
    });
    setVer(null);
    setSalvando(false);
    await carregar(dataSel);
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl font-extrabold tracking-tight">Agenda</h1>
        <p className="text-muted text-sm flex items-center gap-2 flex-wrap mt-0.5">
          {g?.sincronizado ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> sincronizada com o Google Agenda
            </span>
          ) : (
            <span>modo demonstração</span>
          )}
          <span className="text-muted/40">·</span>
          <Link href="/integracoes" className="text-brand font-semibold hover:underline">
            conexões ›
          </Link>
        </p>
      </header>

      {!g ? (
        <div className="text-muted">Carregando…</div>
      ) : (
        <>
          {/* doutor */}
          <div className="flex gap-2 mb-3">
            {g.doutores.map((d) => (
              <button
                key={d.id}
                onClick={() => setDoutor(d.id)}
                className={`flex-1 min-w-0 px-3 py-2 rounded-2xl text-sm border text-left transition ${
                  d.id === doutor ? "border-brand bg-brand-soft" : "border-line bg-card text-muted hover:border-brand/40"
                }`}
              >
                <span className="font-bold text-ink block truncate">{d.nome}</span>
                <span className="text-[10px] text-muted block truncate">{d.especialidade}</span>
              </button>
            ))}
          </div>

          {/* controles de data */}
          <div className="bg-card border border-line rounded-2xl px-2 py-1.5 mb-2 shadow-sm flex items-center gap-1.5 flex-wrap justify-center">
            <button onClick={() => carregar(addDias(dataSel, -1))} disabled={carregando} className="w-9 h-9 rounded-xl text-ink/70 hover:bg-brand-soft text-lg disabled:opacity-30" aria-label="dia anterior">‹</button>
            <div className="text-center leading-tight px-1 min-w-[116px]">
              <div className="font-bold text-sm capitalize">
                {g.dia.rotulo}
                {isHoje && <span className="text-brand"> · hoje</span>}
              </div>
              <div className="text-[11px] text-brand font-semibold">{livresNoDia} livres</div>
            </div>
            <button onClick={() => carregar(addDias(dataSel, 1))} disabled={carregando} className="w-9 h-9 rounded-xl text-ink/70 hover:bg-brand-soft text-lg disabled:opacity-30" aria-label="próximo dia">›</button>
            <span className="w-px h-6 bg-line mx-0.5" />
            <button onClick={() => carregar(g.hoje)} disabled={carregando || isHoje} className="text-xs font-bold rounded-lg border border-line px-2.5 h-9 text-ink/70 hover:bg-brand-soft disabled:opacity-40">Hoje</button>
            <input type="date" value={dataSel} onChange={(e) => e.target.value && carregar(e.target.value)} className="text-xs rounded-lg border border-line px-2 h-9 text-ink/80 bg-card" aria-label="escolher data" />
            <button onClick={() => abrirNovo(hhmm(clamp(isHoje && nowMin >= baseMin ? Math.ceil(nowMin / 30) * 30 : baseMin, baseMin, lastMin - 30)))} className="text-xs font-bold rounded-lg brand-gradient text-white px-3 h-9 shadow-sm hover:brightness-105">+ Agendar</button>
          </div>

          {eventosDoDia.length === 0 && <p className="text-muted/70 text-xs text-center mb-2">📭 Nenhuma consulta marcada — toque num horário pra agendar.</p>}

          {/* linha do tempo */}
          <div className="rounded-2xl border border-line bg-card shadow-sm overflow-hidden">
            <div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
              <div className="relative" style={{ height: times.length * ROW_H + TOP + 6 }}>
                {times.map((t, i) => (
                  <div key={t} className="absolute left-0 right-0 flex items-stretch" style={{ top: i * ROW_H + TOP, height: ROW_H }}>
                    <div className="w-11 shrink-0 -translate-y-2 text-[10px] text-muted text-right pr-2">{t.endsWith(":00") ? t : ""}</div>
                    <button onClick={() => abrirNovo(t)} className={`flex-1 border-t hover:bg-brand-soft/40 transition ${t.endsWith(":00") ? "border-line" : "border-line/40"}`} aria-label={`agendar ${t}`} />
                  </div>
                ))}

                {isHoje && nowMin >= baseMin && nowMin <= lastMin && (
                  <div className="absolute left-9 right-0 z-20 flex items-center pointer-events-none" style={{ top: nowPos }}>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow" />
                    <div className="flex-1 border-t-2 border-red-500" />
                  </div>
                )}

                {eventosDoDia.map((e) => {
                  const sMin = toMin(e.hora);
                  let eMin = toMin(e.fim);
                  if (eMin <= sMin) eMin = sMin + 30;
                  const startIdx = clamp(Math.round((sMin - baseMin) / 30), 0, times.length - 1);
                  const span = clamp(Math.round((eMin - sMin) / 30), 1, times.length - startIdx);
                  const bloqueio = /bloque|almo|pausa|folga|f[eé]rias|indispon|ocupad|fechad|reuni/i.test(e.titulo);
                  const icon = /almo/i.test(e.titulo) ? "☕" : bloqueio ? "🔒" : "🦷";
                  return (
                    <button
                      key={e.id}
                      onClick={() => setVer(e)}
                      className={`absolute left-11 right-1.5 z-10 text-left rounded-lg px-2.5 py-1.5 overflow-hidden shadow-sm border-l-4 border hover:brightness-105 transition ${
                        bloqueio ? "bg-cream-2 border-line border-l-muted/40 text-muted" : "bg-brand border-brand border-l-brand-dark text-white"
                      }`}
                      style={{ top: startIdx * ROW_H + 2 + TOP, height: span * ROW_H - 4 }}
                    >
                      <div className="text-[10px] font-bold leading-tight opacity-90">{icon} {e.hora}–{e.fim}</div>
                      <div className="text-[13px] font-semibold leading-tight truncate">{e.titulo}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="text-muted/70 text-xs mt-3">
            Toque num horário vazio pra <b className="text-ink/70">agendar</b>, ou num agendamento pra <b className="text-ink/70">remover</b>. Tudo grava direto na agenda Google do {docNome}.
          </p>
        </>
      )}

      {/* MODAL: novo agendamento */}
      {novo && g && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center p-3" onClick={() => setNovo(null)}>
          <div className="bg-card rounded-2xl p-4 w-full max-w-sm shadow-xl" onClick={(ev) => ev.stopPropagation()}>
            <div className="font-extrabold text-lg mb-1">Novo na agenda</div>
            <div className="text-muted text-xs mb-3">{docNome} · {g.dia.rotulo}</div>

            <div className="flex gap-2 mb-3">
              {(["consulta", "bloqueio"] as const).map((t) => (
                <button key={t} onClick={() => setTipo(t)} className={`flex-1 py-2 rounded-xl text-sm font-semibold border capitalize ${tipo === t ? "border-brand bg-brand-soft text-brand-dark" : "border-line text-muted"}`}>
                  {t === "consulta" ? "🦷 Consulta" : "🔒 Bloqueio"}
                </button>
              ))}
            </div>

            {tipo === "consulta" ? (
              <div className="space-y-2 mb-3">
                <div>
                  <label className="text-xs text-muted">Procedimento</label>
                  <select value={procedimento} onChange={(e) => setProcedimento(e.target.value)} className="w-full border border-line rounded-lg px-2 py-2 text-sm bg-card mt-0.5">
                    {PROCS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted">Paciente (nome e sobrenome)</label>
                  <input value={paciente} onChange={(e) => setPaciente(e.target.value)} placeholder="Ex.: Maria Silva" className="w-full border border-line rounded-lg px-2 py-2 text-sm bg-card mt-0.5" />
                </div>
              </div>
            ) : (
              <div className="mb-3">
                <label className="text-xs text-muted">Motivo</label>
                <input value={motivo} onChange={(e) => setMotivo(e.target.value)} className="w-full border border-line rounded-lg px-2 py-2 text-sm bg-card mt-0.5" />
                <div className="flex gap-1.5 mt-1.5">
                  {["Almoço", "Reunião", "Folga"].map((m) => (
                    <button key={m} onClick={() => setMotivo(m)} className="text-[11px] border border-line rounded-full px-2 py-0.5 text-muted hover:bg-brand-soft">{m}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <label className="text-xs text-muted">Início</label>
                <select value={horaIni} onChange={(e) => setHoraIni(e.target.value)} className="w-full border border-line rounded-lg px-2 py-2 text-sm bg-card mt-0.5">
                  {times.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted">Duração</label>
                <select value={dur} onChange={(e) => setDur(Number(e.target.value))} className="w-full border border-line rounded-lg px-2 py-2 text-sm bg-card mt-0.5">
                  {[30, 60, 90, 120].map((d) => <option key={d} value={d}>{d} min</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setNovo(null)} className="flex-1 py-2.5 rounded-xl border border-line text-muted font-semibold">Cancelar</button>
              <button onClick={salvar} disabled={salvando || (tipo === "consulta" && !paciente.trim())} className="flex-1 py-2.5 rounded-xl brand-gradient text-white font-bold shadow-sm disabled:opacity-50">
                {salvando ? "Salvando…" : "Agendar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ver / remover */}
      {ver && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center p-3" onClick={() => setVer(null)}>
          <div className="bg-card rounded-2xl p-4 w-full max-w-sm shadow-xl" onClick={(ev) => ev.stopPropagation()}>
            <div className="text-muted text-xs mb-1">{ver.hora}–{ver.fim} · {docNome}</div>
            <div className="font-extrabold text-lg mb-4">{ver.titulo}</div>
            <div className="flex gap-2">
              <button onClick={() => setVer(null)} className="flex-1 py-2.5 rounded-xl border border-line text-muted font-semibold">Fechar</button>
              <button onClick={remover} disabled={salvando} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold shadow-sm disabled:opacity-50">
                {salvando ? "Removendo…" : "Remover"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
