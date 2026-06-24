"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "../../_components/brand";

type Meta = { acao?: string; urgencia?: boolean; fontes?: string[]; bloqueadoPorGuardrail?: string };
type Bolha = { autor: "paciente" | "bot" | "sistema"; texto: string; meta?: Meta };

const SAUDACAO =
  "Olá! 👋 Você está falando com a Sofia, assistente virtual da Clínica Rotelli. Posso ajudar com informações e agendamentos. Suas mensagens são tratadas conforme a LGPD, apenas para o seu atendimento. Quer falar com uma pessoa? É só pedir. Como posso ajudar? 🙂";

const SUGESTOES = [
  "Qual o horário de vocês?",
  "Quanto custa uma limpeza?",
  "Tô com dor no siso, o que pode ser?",
  "Quero marcar uma limpeza",
  "Quero fazer um implante",
  "Quero saber sobre harmonização orofacial",
  "Vocês atendem o convênio Odontoprev?",
  "Quanto custa uma faceta de porcelana?",
];

function Chip({ meta }: { meta: Meta }) {
  const chips: { txt: string; cls: string }[] = [];
  if (meta.urgencia) chips.push({ txt: "⚠️ urgência", cls: "bg-red-100 text-red-700" });
  if (meta.acao === "escalar") chips.push({ txt: "↗️ escalado pra equipe", cls: "bg-amber-100 text-amber-800" });
  if (meta.acao === "agendar") chips.push({ txt: "📅 agendado", cls: "bg-emerald-100 text-emerald-800" });
  if (meta.bloqueadoPorGuardrail) chips.push({ txt: `🛡️ ${meta.bloqueadoPorGuardrail}`, cls: "bg-stone-200 text-stone-700" });
  if (chips.length === 0 && meta.fontes && meta.fontes.length > 0)
    chips.push({ txt: `📚 ${meta.fontes.join(", ")}`, cls: "bg-stone-100 text-stone-500" });
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {chips.map((c, i) => (
        <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded ${c.cls}`}>{c.txt}</span>
      ))}
    </div>
  );
}

export default function Atendimento() {
  const [convId, setConvId] = useState("");
  const [bolhas, setBolhas] = useState<Bolha[]>([{ autor: "bot", texto: SAUDACAO }]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const fim = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setConvId(crypto.randomUUID());
  }, []);
  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: "smooth" });
  }, [bolhas, enviando]);

  async function enviar(msg: string) {
    const t = msg.trim();
    if (!t || enviando || !convId) return;
    setTexto("");
    setBolhas((b) => [...b, { autor: "paciente", texto: t }]);
    setEnviando(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversaId: convId, texto: t }),
      });
      const data = await r.json();
      const resp = data.resposta ?? {};
      setBolhas((b) => [
        ...b,
        {
          autor: "bot",
          texto: resp.mensagem ?? "…",
          meta: { acao: resp.acao, urgencia: resp.urgencia, fontes: resp.fontes, bloqueadoPorGuardrail: data.bloqueio },
        },
      ]);
    } catch {
      setBolhas((b) => [...b, { autor: "sistema", texto: "Erro de conexão. Tente de novo." }]);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <header className="mb-4 max-w-md mx-auto md:mx-0">
        <h1 className="text-2xl font-extrabold tracking-tight">Atendimento</h1>
        <p className="text-muted text-sm">
          Prévia do WhatsApp do paciente — o bot responde em tempo real. O que ele escala cai na fila do
          <span className="font-medium text-ink/70"> Painel</span>.
        </p>
      </header>

      <div className="w-full max-w-md mx-auto md:mx-0 flex flex-col h-[78vh] bg-[#0b141a] rounded-3xl shadow-xl shadow-brand/10 overflow-hidden border border-line">
        {/* header WhatsApp com a logo */}
        <div className="bg-[#202c33] text-white px-3 py-2.5 flex items-center gap-3">
          <Logo size={36} className="ring-white/20" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold leading-tight truncate">Clínica Rotelli</div>
            <div className="text-[11px] text-white/55 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Sofia • assistente virtual • online
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#0b141a]">
          {bolhas.map((b, i) => (
            <div key={i} className={`flex ${b.autor === "paciente" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[82%]">
                <div
                  className={`px-3 py-2 rounded-lg text-[14px] whitespace-pre-wrap shadow-sm ${
                    b.autor === "paciente"
                      ? "bg-[#005c4b] text-white rounded-tr-none"
                      : b.autor === "sistema"
                        ? "bg-amber-50 text-amber-900 border border-amber-200"
                        : "bg-[#202c33] text-white rounded-tl-none"
                  }`}
                >
                  {b.texto}
                </div>
                {b.meta && b.autor === "bot" ? <Chip meta={b.meta} /> : null}
              </div>
            </div>
          ))}
          {enviando ? (
            <div className="flex justify-start">
              <div className="bg-[#202c33] text-white/50 px-3 py-2 rounded-lg text-sm rounded-tl-none">digitando…</div>
            </div>
          ) : null}
          <div ref={fim} />
        </div>

        <div className="px-2 pb-1 flex gap-1 overflow-x-auto bg-[#0b141a]">
          {SUGESTOES.map((s) => (
            <button
              key={s}
              onClick={() => enviar(s)}
              disabled={enviando}
              className="shrink-0 text-[11px] text-white/70 border border-white/15 rounded-full px-2.5 py-1 hover:border-emerald-400 disabled:opacity-40"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            enviar(texto);
          }}
          className="bg-[#202c33] p-2 flex items-center gap-2"
        >
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Mensagem"
            className="flex-1 bg-[#2a3942] text-white placeholder-white/40 rounded-full px-4 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={enviando || !texto.trim()}
            className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center disabled:opacity-40"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
