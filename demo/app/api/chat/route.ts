import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { chamarBot, validarSaida, llmConfigurado } from "@/lib/bot";
import { reservar } from "@/lib/agenda";
import { criarEventoGoogle } from "@/lib/google";
import type { Conversa, Mensagem, RespostaBot } from "@/lib/tipos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { conversaId, texto } = (await req.json()) as { conversaId: string; texto: string };
  if (!conversaId || !texto?.trim()) {
    return NextResponse.json({ erro: "conversaId e texto são obrigatórios" }, { status: 400 });
  }

  let conversa = store.conversas.get(conversaId);
  if (!conversa) {
    conversa = { id: conversaId, mensagens: [], status: "ia", criadaEm: Date.now() };
    store.conversas.set(conversaId, conversa);
  }
  conversa.mensagens.push({ autor: "paciente", texto: texto.trim(), ts: Date.now() });

  // Sem motor configurado → demo mostra aviso no lugar da resposta (não quebra).
  if (!llmConfigurado()) {
    const aviso =
      "⚠️ Demo sem motor de IA configurado. Defina LLM_PROVIDER / LLM_MODEL / LLM_API_KEY no .env.local (ver .env.local.example).";
    conversa.mensagens.push({ autor: "sistema", texto: aviso, ts: Date.now() });
    return NextResponse.json({ resposta: { acao: "responder", mensagem: aviso }, conversa });
  }

  let resposta: RespostaBot;
  let bloqueio: string | undefined;
  try {
    const bruta = await chamarBot(conversa.mensagens);
    const v = validarSaida(bruta);
    resposta = v.resp;
    bloqueio = v.bloqueio;
  } catch (e: unknown) {
    const err = e as { status?: number; message?: string };
    const tecnica =
      err.status === 401
        ? "⚠️ Chave do provedor inválida (401). Confira LLM_API_KEY no .env.local."
        : "Tive um problema técnico agora. Vou te conectar com a equipe. 🙏";
    conversa.mensagens.push({ autor: "sistema", texto: tecnica, ts: Date.now() });
    return NextResponse.json({ resposta: { acao: "escalar", mensagem: tecnica }, conversa });
  }

  // Efeito colateral: AGENDAR (só GERAL com o Dr. Lucas; implante vai pra humano).
  if (resposta.acao === "agendar" && resposta.agendamento) {
    if (/implante|harmoniza|orofacial|botox|preenchimento/i.test(resposta.agendamento.procedimento)) {
      // Backstop determinístico: implante/harmonização são do Dr. Claudio → atendimento humano.
      resposta = {
        ...resposta,
        acao: "escalar",
        agendamento: null,
        motivo_escala: "implante/harmonização (especialidades do Dr. Claudio) → atendimento humano",
        mensagem:
          "Esse procedimento é com o nosso especialista, o Dr. Claudio Rotelli. Vou te passar pra nossa equipe pra cuidar disso com você. 🙏",
      };
    } else {
      const bk = reservar({
        procedimento: resposta.agendamento.procedimento,
        data: resposta.agendamento.data,
        hora: resposta.agendamento.hora,
        conversaId,
      });
      if (!bk) {
        resposta = {
          ...resposta,
          acao: "responder",
          agendamento: null,
          mensagem:
            "Esse horário acabou de ser preenchido 😕 Posso te oferecer outro horário disponível?",
        };
      } else {
        // Grava direto no Google Agenda do Dr. Lucas (geral). Não bloqueia o agendamento se falhar/não configurado.
        try {
          const link = await criarEventoGoogle("lucas", {
            procedimento: bk.procedimento,
            data: bk.data,
            hora: bk.hora,
          });
          if (link) bk.googleEventLink = link;
        } catch {
          /* segue sem o evento no Google */
        }
      }
    }
  }

  // Efeito colateral: ESCALAR / URGÊNCIA → entra na fila da secretária + status humano.
  if (resposta.acao === "escalar" || resposta.urgencia) {
    store.escalas.push({
      id: `esc_${store.escalas.length + 1}`,
      conversaId,
      motivo: resposta.motivo_escala ?? (resposta.urgencia ? "urgência" : "escalonamento"),
      urgencia: !!resposta.urgencia,
      trecho: texto.trim().slice(0, 120),
      ts: Date.now(),
    });
    if (resposta.acao === "escalar") conversa.status = "humano";
  }

  const msgBot: Mensagem = {
    autor: "bot",
    texto: resposta.mensagem,
    ts: Date.now(),
    meta: {
      acao: resposta.acao,
      intencao: resposta.intencao,
      urgencia: resposta.urgencia,
      fontes: resposta.fontes,
      bloqueadoPorGuardrail: bloqueio,
    },
  };
  conversa.mensagens.push(msgBot);

  return NextResponse.json({ resposta, conversa, bloqueio });
}
