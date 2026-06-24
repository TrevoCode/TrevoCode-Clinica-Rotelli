"use client";

import { useEffect, useState } from "react";

type DoutorG = { id: string; nome: string; especialidade: string; configurado: boolean };
type Status = {
  google: { saEmail: string | null; doutores: DoutorG[] };
  whatsapp: { conectado: boolean };
};
type Teste = { ok?: boolean; erro?: string; loading?: boolean };

function Badge({ on, label }: { on: boolean; label?: string }) {
  return (
    <span
      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
        on ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"
      }`}
    >
      {label ?? (on ? "● configurado" : "○ não configurado")}
    </span>
  );
}

export default function Integracoes() {
  const [s, setS] = useState<Status | null>(null);
  const [testes, setTestes] = useState<Record<string, Teste>>({});
  const [waMsg, setWaMsg] = useState(false);

  useEffect(() => {
    fetch("/api/integracoes", { cache: "no-store" })
      .then((r) => r.json())
      .then(setS)
      .catch(() => {});
  }, []);

  async function testar(id: string) {
    setTestes((t) => ({ ...t, [id]: { loading: true } }));
    try {
      const r = await fetch("/api/integracoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doutor: id }),
      });
      const j = await r.json();
      setTestes((t) => ({ ...t, [id]: { ok: j.ok, erro: j.erro } }));
    } catch {
      setTestes((t) => ({ ...t, [id]: { ok: false, erro: "Erro de rede." } }));
    }
  }

  const saEmail = s?.google.saEmail ?? null;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <header className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Integrações</h1>
        <p className="text-muted text-sm">Conecte as contas da clínica. A plataforma cuida do resto.</p>
      </header>

      {/* GOOGLE AGENDA */}
      <section className="rounded-2xl border border-line bg-card shadow-sm p-5 mb-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🗓️</span>
          <div className="flex-1">
            <h2 className="font-bold">Google Agenda</h2>
            <p className="text-muted text-sm">
              Todo agendamento que o bot fizer é criado <b className="text-ink/70">direto no Google
              Agenda</b> do doutor — com paciente, procedimento e horário.
            </p>
          </div>
          <Badge on={!!saEmail} label={saEmail ? "● ativo" : "○ a configurar"} />
        </div>

        {/* e-mail da conta de serviço (compartilhar a agenda com ele) */}
        {saEmail ? (
          <div className="mt-3 rounded-xl bg-cream/60 border border-line p-3 text-sm">
            <div className="text-muted text-xs mb-1">
              Para conectar um doutor, compartilhe a agenda Google dele com este e-mail (permissão
              “Fazer alterações nos eventos”):
            </div>
            <code className="font-mono text-xs break-all text-brand-dark">{saEmail}</code>
          </div>
        ) : (
          <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-[12px] text-amber-900">
            ⓘ Integração com o Google ainda não ativada. A Trevocode configura a conta de serviço e aqui
            aparece o e-mail pra compartilhar as agendas dos doutores.
          </div>
        )}

        <div className="mt-4 space-y-2">
          {(s?.google.doutores ?? []).map((d) => {
            const t = testes[d.id] ?? {};
            return (
              <div key={d.id} className="rounded-xl border border-line bg-cream/40 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{d.nome}</div>
                    <div className="text-muted text-xs">{d.especialidade}</div>
                  </div>
                  <Badge on={d.configurado} />
                  <button
                    onClick={() => testar(d.id)}
                    disabled={t.loading}
                    className="text-sm font-semibold rounded-lg px-3 py-1.5 border border-line text-ink/70 hover:bg-stone-100 disabled:opacity-60"
                  >
                    {t.loading ? "Testando…" : "Testar conexão"}
                  </button>
                </div>
                {t.ok === true && (
                  <div className="text-emerald-700 text-xs mt-2">✓ Conectado — agenda acessível pela plataforma.</div>
                )}
                {t.ok === false && <div className="text-red-600 text-xs mt-2">✗ {t.erro}</div>}
              </div>
            );
          })}
          {!s && <p className="text-muted text-sm">Carregando…</p>}
        </div>
      </section>

      {/* WHATSAPP */}
      <section className="rounded-2xl border border-line bg-card shadow-sm p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💬</span>
          <div className="flex-1">
            <h2 className="font-bold">WhatsApp da clínica</h2>
            <p className="text-muted text-sm">
              O número oficial da clínica conecta aqui; as mensagens dos pacientes{" "}
              <b className="text-ink/70">caem na plataforma</b> e o bot responde na hora.
            </p>
          </div>
          <Badge on={false} label="○ Fase 0" />
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl border border-line bg-cream/40 p-3">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">Número da Clínica Rotelli</div>
            <div className="text-muted text-xs">aguardando provisionamento</div>
          </div>
          <button
            onClick={() => setWaMsg(true)}
            className="text-sm font-semibold rounded-lg px-3 py-1.5 border border-line text-ink/70 hover:bg-stone-100"
          >
            Conectar WhatsApp
          </button>
        </div>
        {waMsg && (
          <p className="text-[12px] text-amber-900 mt-3 rounded-lg bg-amber-50 border border-amber-200 p-2">
            ⓘ A conexão real é feita na <b>Fase 0</b> (pós-fechamento): provisionamos o número dedicado e o
            app oficial na Meta. O código e esta tela já estão prontos pra plugar.
          </p>
        )}
      </section>
    </div>
  );
}
