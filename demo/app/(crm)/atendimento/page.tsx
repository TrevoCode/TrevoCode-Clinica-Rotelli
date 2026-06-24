"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  Search,
  Send,
  ShieldCheck,
  BookOpen,
  CalendarCheck,
  ArrowUpRight,
  AlertTriangle,
  CheckCheck,
  Phone,
  MoreVertical,
  ChevronLeft,
  Radio,
  Stethoscope,
} from "lucide-react";

type Status = "live" | "ia" | "humano" | "urgencia";
type Autor = "paciente" | "bot" | "sistema";
type Meta = { acao?: string; urgencia?: boolean; fontes?: string[]; bloqueadoPorGuardrail?: string };
type Msg = { autor: Autor; texto: string; meta?: Meta };
type Conversa = {
  id: string;
  nome: string;
  telefone: string;
  status: Status;
  hora: string;
  preview: string;
  msgs: Msg[];
};

const SAUDACAO =
  "Olá! Você está falando com a Sofia, assistente virtual da Clínica Rotelli. Posso ajudar com informações e agendamentos. Suas mensagens são tratadas conforme a LGPD, apenas para o seu atendimento. Quer falar com uma pessoa? É só pedir. Como posso ajudar?";

const SUGESTOES = [
  "Qual o horário de vocês?",
  "Quanto custa uma limpeza?",
  "Tô com dor no siso, o que pode ser?",
  "Quero marcar uma limpeza",
  "Quero fazer um implante",
  "Vocês atendem o convênio Odontoprev?",
];

// Conversas de exemplo (somente leitura) — populam o CRM e mostram a gama do bot.
const SEEDS: Conversa[] = [
  {
    id: "marina", nome: "Marina Souza", telefone: "+55 11 99812-4471", status: "ia", hora: "09:24",
    preview: "Perfeito, Marina! Limpeza confirmada para terça às 10h.",
    msgs: [
      { autor: "paciente", texto: "Oi, queria marcar uma limpeza" },
      { autor: "bot", texto: "Claro! Temos com o Dr. Lucas terça (10h), quarta (14h) ou sexta (09h). Qual fica melhor pra você?", meta: { fontes: ["[proc-limpeza]"] } },
      { autor: "paciente", texto: "Pode ser terça às 10h" },
      { autor: "bot", texto: "Perfeito, Marina! Limpeza confirmada para terça às 10h com o Dr. Lucas. Qualquer coisa é só me chamar por aqui.", meta: { acao: "agendar" } },
    ],
  },
  {
    id: "roberto", nome: "Roberto Lima", telefone: "+55 11 99745-2208", status: "humano", hora: "08:51",
    preview: "Vou te conectar com nossa equipe pra cuidar do seu implante.",
    msgs: [
      { autor: "paciente", texto: "Bom dia, quero colocar um implante. Quanto custa?" },
      { autor: "bot", texto: "Implante é com o nosso especialista, o Dr. Claudio Rotelli. Como é um caso mais delicado, vou te conectar com a nossa equipe pra cuidar disso com você e passar o valor na avaliação. Um instante!", meta: { acao: "escalar", fontes: ["[proc-implante]"] } },
    ],
  },
  {
    id: "juliana", nome: "Juliana Alves", telefone: "+55 11 99633-0915", status: "urgencia", hora: "ontem",
    preview: "Sinto muito que esteja com dor. Já estou avisando a equipe.",
    msgs: [
      { autor: "paciente", texto: "Tô com muita dor e meu rosto inchou desde ontem" },
      { autor: "bot", texto: "Sinto muito que esteja passando por isso. Não consigo dizer a causa por aqui, mas isso precisa de avaliação o quanto antes. Já estou avisando a nossa equipe pra te dar um encaixe hoje. Se piorar muito (dificuldade pra respirar ou engolir), procure um pronto-socorro.", meta: { acao: "escalar", urgencia: true } },
    ],
  },
  {
    id: "carlos", nome: "Carlos Mendes", telefone: "+55 11 99521-7733", status: "humano", hora: "ontem",
    preview: "Vou confirmar isso com a nossa equipe pra não te passar errado.",
    msgs: [
      { autor: "paciente", texto: "Vocês atendem o convênio Odontoprev?" },
      { autor: "bot", texto: "Boa pergunta! Esse convênio não está na minha lista por aqui, e prefiro não te passar uma informação errada. Vou confirmar com a nossa equipe e já te retornam, tá?", meta: { acao: "escalar" } },
    ],
  },
  {
    id: "patricia", nome: "Patrícia Gomes", telefone: "+55 11 99410-6620", status: "ia", hora: "seg",
    preview: "O clareamento começa a partir de R$ 800; o método é definido na avaliação.",
    msgs: [
      { autor: "paciente", texto: "Quanto custa um clareamento?" },
      { autor: "bot", texto: "O clareamento dental começa a partir de R$ 800. O melhor método é definido na avaliação, e o valor final depende dela. Quer que eu veja um horário pra você?", meta: { fontes: ["[proc-clareamento]"] } },
    ],
  },
];

const STATUS_META: Record<Status, { label: string; cls: string; Icon: typeof Bot }> = {
  live: { label: "ao vivo", cls: "text-brand bg-brand-soft", Icon: Radio },
  ia: { label: "IA", cls: "text-emerald-700 bg-emerald-100", Icon: Bot },
  humano: { label: "humano", cls: "text-amber-800 bg-amber-100", Icon: ArrowUpRight },
  urgencia: { label: "urgência", cls: "text-red-700 bg-red-100", Icon: AlertTriangle },
};

function Avatar({ nome, status }: { nome: string; status: Status }) {
  const iniciais = nome.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const { Icon } = STATUS_META[status];
  return (
    <div className="relative shrink-0">
      <div className="w-11 h-11 rounded-full bg-brand-soft text-brand-dark font-bold flex items-center justify-center text-sm">
        {status === "live" ? <Radio size={18} /> : iniciais}
      </div>
      <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-card flex items-center justify-center shadow-sm">
        <Icon size={11} className={STATUS_META[status].cls.split(" ")[0]} />
      </span>
    </div>
  );
}

function ChipsMeta({ meta }: { meta: Meta }) {
  const chips: { txt: string; cls: string; Icon: typeof Bot }[] = [];
  if (meta.urgencia) chips.push({ txt: "urgência", cls: "bg-red-100 text-red-700", Icon: AlertTriangle });
  if (meta.acao === "escalar") chips.push({ txt: "escalado pra equipe", cls: "bg-amber-100 text-amber-800", Icon: ArrowUpRight });
  if (meta.acao === "agendar") chips.push({ txt: "agendado", cls: "bg-emerald-100 text-emerald-800", Icon: CalendarCheck });
  if (meta.bloqueadoPorGuardrail) chips.push({ txt: meta.bloqueadoPorGuardrail, cls: "bg-stone-200 text-stone-700", Icon: ShieldCheck });
  if (chips.length === 0 && meta.fontes && meta.fontes.length > 0)
    chips.push({ txt: meta.fontes.join(", "), cls: "bg-stone-100 text-stone-500", Icon: BookOpen });
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {chips.map((c, i) => (
        <span key={i} className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${c.cls}`}>
          <c.Icon size={11} /> {c.txt}
        </span>
      ))}
    </div>
  );
}

function Bolha({ m }: { m: Msg }) {
  const paciente = m.autor === "paciente";
  const sistema = m.autor === "sistema";
  return (
    <div className={`flex ${paciente ? "justify-start" : "justify-end"}`}>
      <div className="max-w-[78%]">
        <div
          className={`px-3 py-2 rounded-2xl text-[14px] whitespace-pre-wrap shadow-sm ${
            sistema
              ? "bg-amber-50 text-amber-900 border border-amber-200 rounded-tl-sm"
              : paciente
                ? "bg-card text-ink border border-line rounded-tl-sm"
                : "bg-brand text-white rounded-tr-sm"
          }`}
        >
          {m.texto}
        </div>
        {m.meta && !paciente ? <ChipsMeta meta={m.meta} /> : null}
      </div>
    </div>
  );
}

export default function Atendimento() {
  const liveBase: Conversa = useMemo(
    () => ({
      id: "live", nome: "Paciente (demonstração)", telefone: "simulador ao vivo", status: "live",
      hora: "agora", preview: "Digite como se fosse o paciente e veja a Sofia responder.",
      msgs: [{ autor: "bot", texto: SAUDACAO }],
    }),
    [],
  );

  const [liveMsgs, setLiveMsgs] = useState<Msg[]>(liveBase.msgs);
  const [livePreview, setLivePreview] = useState(liveBase.preview);
  const [convId, setConvId] = useState("");
  const [selId, setSelId] = useState("live");
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mobileChat, setMobileChat] = useState(false);
  const fim = useRef<HTMLDivElement>(null);

  useEffect(() => setConvId(crypto.randomUUID()), []);

  const conversas: Conversa[] = useMemo(
    () => [{ ...liveBase, msgs: liveMsgs, preview: livePreview }, ...SEEDS],
    [liveBase, liveMsgs, livePreview],
  );
  const sel = conversas.find((c) => c.id === selId) ?? conversas[0];
  const live = sel.id === "live";

  useEffect(() => {
    if (live) fim.current?.scrollIntoView({ behavior: "smooth" });
  }, [liveMsgs, enviando, live, selId]);

  async function enviar(msg: string) {
    const t = msg.trim();
    if (!t || enviando || !convId) return;
    setTexto("");
    setLiveMsgs((b) => [...b, { autor: "paciente", texto: t }]);
    setEnviando(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversaId: convId, texto: t }),
      });
      const data = await r.json();
      const resp = data.resposta ?? {};
      setLivePreview(resp.mensagem ?? "");
      setLiveMsgs((b) => [
        ...b,
        { autor: "bot", texto: resp.mensagem ?? "…", meta: { acao: resp.acao, urgencia: resp.urgencia, fontes: resp.fontes, bloqueadoPorGuardrail: data.bloqueio } },
      ]);
    } catch {
      setLiveMsgs((b) => [...b, { autor: "sistema", texto: "Erro de conexão. Tente de novo." }]);
    } finally {
      setEnviando(false);
    }
  }

  function abrir(id: string) {
    setSelId(id);
    setMobileChat(true);
  }

  return (
    <div className="h-[100dvh] md:h-screen flex flex-col">
      <header className="px-4 sm:px-6 py-3 border-b border-line bg-card/60">
        <h1 className="text-xl font-extrabold tracking-tight">Atendimento</h1>
        <p className="text-muted text-xs">Caixa de entrada do WhatsApp — a Sofia responde e a recepção assume o que ela escala.</p>
      </header>

      <div className="flex-1 min-h-0 flex">
        {/* ESQUERDA — lista de conversas */}
        <aside className={`${mobileChat ? "hidden" : "flex"} md:flex flex-col w-full md:w-[340px] md:shrink-0 border-r border-line bg-card/40`}>
          <div className="p-3 border-b border-line">
            <div className="flex items-center gap-2 rounded-xl border border-line bg-card px-3 py-2 text-sm text-muted">
              <Search size={15} />
              <span>Buscar conversa…</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversas.map((c) => {
              const ativo = c.id === selId;
              const sm = STATUS_META[c.status];
              return (
                <button
                  key={c.id}
                  onClick={() => abrir(c.id)}
                  className={`w-full text-left flex gap-3 px-3 py-3 border-b border-line/60 transition ${
                    ativo ? "bg-brand-soft/60" : "hover:bg-cream-2"
                  }`}
                >
                  <Avatar nome={c.nome} status={c.status} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate flex-1">{c.nome}</span>
                      <span className="text-muted text-[10px] shrink-0">{c.hora}</span>
                    </div>
                    <div className="text-muted text-xs truncate">{c.preview}</div>
                    <span className={`inline-flex items-center gap-1 text-[10px] mt-1 px-1.5 py-0.5 rounded ${sm.cls}`}>
                      <sm.Icon size={10} /> {sm.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* DIREITA — chat ativo */}
        <section className={`${mobileChat ? "flex" : "hidden"} md:flex flex-col flex-1 min-w-0 bg-[#f7f1ea]`}>
          {/* header do chat */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-line bg-card">
            <button onClick={() => setMobileChat(false)} className="md:hidden text-muted">
              <ChevronLeft size={20} />
            </button>
            <Avatar nome={sel.nome} status={sel.status} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold leading-tight truncate">{sel.nome}</div>
              <div className="text-muted text-[11px] truncate">{sel.telefone}</div>
            </div>
            <div className="flex items-center gap-3 text-muted">
              <Phone size={18} />
              <MoreVertical size={18} />
            </div>
          </div>

          {/* thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {sel.msgs.map((m, i) => (
              <Bolha key={i} m={m} />
            ))}
            {live && enviando ? (
              <div className="flex justify-end">
                <div className="bg-brand/70 text-white px-3 py-2 rounded-2xl text-sm rounded-tr-sm">Sofia está digitando…</div>
              </div>
            ) : null}
            <div ref={fim} />
          </div>

          {/* rodapé: ao vivo = input; exemplo = aviso */}
          {live ? (
            <>
              <div className="px-3 pb-1 flex gap-1 overflow-x-auto">
                {SUGESTOES.map((s) => (
                  <button
                    key={s}
                    onClick={() => enviar(s)}
                    disabled={enviando}
                    className="shrink-0 text-[11px] text-brand-dark border border-brand/30 bg-card rounded-full px-2.5 py-1 hover:border-brand disabled:opacity-40"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); enviar(texto); }}
                className="bg-card p-2.5 flex items-center gap-2 border-t border-line"
              >
                <input
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Digite como se fosse o paciente…"
                  className="flex-1 bg-cream-2 rounded-full px-4 py-2.5 text-sm outline-none"
                />
                <button
                  type="submit"
                  disabled={enviando || !texto.trim()}
                  className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center disabled:opacity-40"
                >
                  <Send size={17} />
                </button>
              </form>
            </>
          ) : (
            <div className="bg-card border-t border-line p-3 flex items-center gap-2 text-muted text-xs">
              <Stethoscope size={14} className="text-brand" />
              Conversa de exemplo (somente leitura). Abra <b className="text-ink/70 mx-1">Paciente (demonstração)</b> pra testar a Sofia ao vivo.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
