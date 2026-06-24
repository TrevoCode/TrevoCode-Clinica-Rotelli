// Orquestrador do bot: monta o prompt, chama o LLM com saída em JSON e aplica os
// guardrails em código (camada 2). É o coração do anti-alucinação.
//
// PROVIDER-AGNÓSTICO: funciona com qualquer motor hospedado via OpenAI-compatible
// (OpenRouter, Groq, OpenAI, Gemini) ou Anthropic direto. Troca por variável de ambiente:
//   LLM_PROVIDER = openrouter | groq | openai | gemini | ollama | anthropic   (default openrouter)
//   LLM_MODEL    = slug do modelo (ex.: "anthropic/claude-sonnet-4.5", "google/gemini-2.0-flash-001")
//   LLM_API_KEY  = chave do provedor (Anthropic usa ANTHROPIC_API_KEY)
//   LLM_BASE_URL = (opcional) sobrescreve a URL base
// Spec do prompt/guardrails: ../BOT-PROMPT.md

import Anthropic from "@anthropic-ai/sdk";
import type { Mensagem, RespostaBot } from "./tipos";
import { baseComoContexto } from "./base-conhecimento";
import { disponibilidadeComoContexto } from "./agenda";

const ASSISTENTE = "Sofia";
const CLINICA = "Clínica Rotelli";

const PRESETS: Record<string, string> = {
  openrouter: "https://openrouter.ai/api/v1",
  groq: "https://api.groq.com/openai/v1",
  openai: "https://api.openai.com/v1",
  gemini: "https://generativelanguage.googleapis.com/v1beta/openai",
  ollama: "http://localhost:11434/v1",
};

function provider(): string {
  return process.env.LLM_PROVIDER || "openrouter";
}
function baseUrl(): string {
  return process.env.LLM_BASE_URL || PRESETS[provider()] || PRESETS.openrouter;
}
function model(): string {
  return process.env.LLM_MODEL || "";
}

// O motor está pronto pra responder ao vivo?
export function llmConfigurado(): boolean {
  const p = provider();
  if (p === "ollama") return !!model();
  if (p === "anthropic") return !!process.env.ANTHROPIC_API_KEY;
  return !!process.env.LLM_API_KEY && !!model();
}

const FORMATO_JSON = `

# FORMATO DE SAÍDA — responda SOMENTE com um JSON válido, sem nenhum texto fora dele, com estas chaves:
{
  "intencao": "duvida | agendar | urgencia | reclamacao | pedir_humano | fora_escopo | saudacao",
  "acao": "responder | escalar | agendar",
  "mensagem": "texto que será enviado ao paciente",
  "fontes": ["ids [xxx] do CONTEXTO usados; [] se nenhum"],
  "urgencia": true | false,
  "motivo_escala": "preencha só se acao=escalar; interno",
  "agendamento": { "procedimento": "...", "data": "YYYY-MM-DD", "hora": "HH:MM" }
}
Use "agendamento" só quando acao="agendar" (senão omita ou use null).`;

function buildSystem(comFormato: boolean): string {
  const corpo = `Você é ${ASSISTENTE}, a assistente virtual de WhatsApp da ${CLINICA}, uma clínica
odontológica. Fala português do Brasil, em tom acolhedor, claro, frases curtas, sem jargão.

# REGRA DE OURO — NUNCA INVENTE
Você só pode afirmar FATOS (preços, horários, endereço, convênios, procedimentos, políticas)
que estejam EXPLICITAMENTE no bloco CONTEXTO. Se a informação não estiver lá, NÃO invente,
NÃO chute: defina "acao":"escalar". É sempre melhor escalar do que arriscar.

# VOCÊ NÃO É DENTISTA — NUNCA DIAGNOSTIQUE
- Não diga a causa de um sintoma ("isso é cárie", "deve ser canal", "parece infecção").
- Não indique, ajuste nem comente medicação ("pode tomar X", "tome antibiótico").
- Não opine sobre conduta clínica nem resultado de exame.
Diante de sintoma/dor/dúvida clínica: ACOLHA, diga que só uma avaliação presencial com o
dentista pode dizer, e ofereça agendar. Se houver sinais de urgência, trate como urgência.

# QUEM FAZ O QUÊ (roteamento por alçada)
- Dr. Lucas — clínico geral: limpeza, avaliação, restauração, canal, extração, clareamento, etc.
- Dr. Claudio Rotelli — IMPLANTE e HARMONIZAÇÃO OROFACIAL (especialidades dele; casos mais delicados).
- Você resolve o simples e agenda os procedimentos GERAIS com o Dr. Lucas.
- Escale pra equipe (acao:"escalar"), SEM inventar, quando: dor/sintoma em alguma região,
  "qual remédio tomar", IMPLANTE, HARMONIZAÇÃO OROFACIAL, ou qualquer coisa que fuja da base ou do seu alcance.

# URGÊNCIA
Dor forte, trauma, inchaço importante, sangramento que não para, ou febre com dor:
defina "urgencia":true, acolha, ofereça o encaixe mais próximo e avise a equipe. Se descrever
algo grave (muito inchaço com dificuldade de respirar/engolir, trauma severo), oriente procurar
um pronto-socorro — sem dar diagnóstico.

# ESCALAR (acao:"escalar") quando: a info não está no CONTEXTO; o paciente pede uma pessoa;
é reclamação, assunto sensível ou fora do escopo da clínica; ou você está em dúvida.
Ao escalar, escreva uma "mensagem" curta e gentil e preencha "motivo_escala" (interno).

# AGENDAMENTO (só procedimentos GERAIS, com o Dr. Lucas)
- Você agenda só procedimentos GERAIS (limpeza, avaliação, restauração, etc.) com o Dr. Lucas.
- IMPLANTE e HARMONIZAÇÃO OROFACIAL você NUNCA agenda: são com o Dr. Claudio Rotelli, casos delicados → acao:"escalar".
- Os horários livres estão em HORÁRIOS DISPONÍVEIS. NUNCA proponha um horário que não esteja lá.
- Enquanto o paciente não escolheu: proponha 2–3 horários REAIS da lista e pergunte qual prefere (acao:"responder").
- Quando ele CONFIRMAR um horário da lista: acao:"agendar" + "agendamento" {procedimento, data
  (YYYY-MM-DD), hora (HH:MM)} EXATAMENTE como na lista. A "mensagem" já confirma de forma calorosa.

# ESTILO: WhatsApp, curto, SEM emojis. Sempre que citar um preço, lembre que o valor
final depende da avaliação. Cite em "fontes" os ids [xxx] do CONTEXTO que você usou.

# CONTEXTO (única fonte de verdade)
${baseComoContexto()}

# HORÁRIOS DISPONÍVEIS (agenda real — não invente outros)
${disponibilidadeComoContexto()}`;
  return comFormato ? corpo + FORMATO_JSON : corpo;
}

// Schema usado só no caminho Anthropic (saída estruturada nativa).
const SCHEMA = {
  type: "object",
  properties: {
    intencao: {
      type: "string",
      enum: ["duvida", "agendar", "urgencia", "reclamacao", "pedir_humano", "fora_escopo", "saudacao"],
    },
    acao: { type: "string", enum: ["responder", "escalar", "agendar"] },
    mensagem: { type: "string" },
    fontes: { type: "array", items: { type: "string" } },
    urgencia: { type: "boolean" },
    motivo_escala: { type: "string" },
    agendamento: {
      type: "object",
      properties: {
        procedimento: { type: "string" },
        data: { type: "string" },
        hora: { type: "string" },
      },
      required: ["procedimento", "data", "hora"],
      additionalProperties: false,
    },
  },
  required: ["intencao", "acao", "mensagem", "fontes", "urgencia"],
  additionalProperties: false,
};

function parseJson(s: string): RespostaBot {
  try {
    return JSON.parse(s) as RespostaBot;
  } catch {
    const m = s.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]) as RespostaBot;
    throw new Error("LLM não retornou JSON válido");
  }
}

export async function chamarBot(mensagens: Mensagem[]): Promise<RespostaBot> {
  const historico = mensagens
    .filter((m) => m.autor === "paciente" || m.autor === "bot")
    .map((m) => ({
      role: m.autor === "paciente" ? ("user" as const) : ("assistant" as const),
      content: m.texto,
    }));

  // Caminho Anthropic direto (saída estruturada nativa).
  if (provider() === "anthropic") {
    const client = new Anthropic();
    const params = {
      model: model() || "claude-sonnet-4-6",
      max_tokens: 1024,
      system: [{ type: "text", text: buildSystem(false), cache_control: { type: "ephemeral" } }],
      messages: historico,
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
    };
    const resp = (await client.messages.create(params as never)) as unknown as {
      content: { type: string; text?: string }[];
    };
    const bloco = resp.content.find((b) => b.type === "text");
    if (!bloco?.text) throw new Error("resposta sem texto");
    return parseJson(bloco.text);
  }

  // Caminho OpenAI-compatible (OpenRouter / Groq / OpenAI / Gemini / Ollama).
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.LLM_API_KEY) headers["Authorization"] = `Bearer ${process.env.LLM_API_KEY}`;
  if (provider() === "openrouter") {
    headers["HTTP-Referer"] = "https://trevocode.com";
    headers["X-Title"] = "Trevocode Clinica Demo";
  }

  const body: Record<string, unknown> = {
    model: model(),
    messages: [{ role: "system", content: buildSystem(true) }, ...historico],
    max_tokens: 1024,
    temperature: 0.2,
  };
  if (process.env.LLM_JSON_MODE !== "off") body.response_format = { type: "json_object" };

  const r = await fetch(`${baseUrl()}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const txt = await r.text();
    throw { status: r.status, message: txt };
  }
  const j = (await r.json()) as { choices?: { message?: { content?: string } }[] };
  const content = j.choices?.[0]?.message?.content;
  if (!content) throw new Error("LLM sem conteúdo");
  return parseJson(content);
}

// Guardrails camada 2 (sobre a saída do modelo) — rodam IGUAL pra qualquer motor.
const PRECO = /R\$\s?\d/;
const DIAGNOSTICO = /\b(é\s+(uma?\s+)?(cárie|carie|infecç\w+|abscesso|canal))\b|\bvocê\s+(tem|está\s+com)\s+(uma?\s+)?(cárie|carie|infecç\w+|abscesso)/i;
const PRESCRICAO = /\b(tome|tomar|use|usar|recomendo)\s+(o\s+|um\s+|uma\s+)?(antibiótic\w+|amoxicilina|ibuprofeno|analgésic\w+|remédio|antiinflamatóri\w+)/i;

export function validarSaida(r: RespostaBot): { resp: RespostaBot; bloqueio?: string } {
  let bloqueio: string | undefined;

  if (r.acao === "responder" && (r.fontes?.length ?? 0) === 0 && PRECO.test(r.mensagem)) {
    bloqueio = "preço afirmado sem fonte na base";
  } else if (DIAGNOSTICO.test(r.mensagem)) {
    bloqueio = "afirmação de diagnóstico";
  } else if (PRESCRICAO.test(r.mensagem)) {
    bloqueio = "indicação de medicação";
  }

  if (bloqueio) {
    return {
      bloqueio,
      resp: {
        ...r,
        acao: "escalar",
        agendamento: null,
        motivo_escala: `[guardrail] ${bloqueio}`,
        mensagem:
          "Pra te orientar com segurança, vou te conectar com a nossa equipe. Um instante!",
      },
    };
  }
  return { resp: r };
}
