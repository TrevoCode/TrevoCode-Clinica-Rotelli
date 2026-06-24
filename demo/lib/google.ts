// Integração REAL com o Google Agenda via conta de serviço (service account).
// Sem dependências externas: assina um JWT RS256 com a chave da SA e chama a Calendar API.
//
// Variáveis de ambiente (setadas pelo Nobre depois de criar a SA no Google Cloud):
//   GOOGLE_SA_KEY   = base64 do arquivo JSON da conta de serviço (client_email + private_key)
//   GCAL_LUCAS      = ID da agenda do Dr. Lucas (o e-mail Google dele)
//   GCAL_CLAUDIO    = ID da agenda do Dr. Claudio (o e-mail Google dele)
// Cada doutor compartilha a agenda dele com o client_email da SA ("Fazer alterações nos eventos").

import crypto from "node:crypto";

const FUSO = "America/Sao_Paulo";

interface SA {
  client_email: string;
  private_key: string;
}

function sa(): SA | null {
  const raw = process.env.GOOGLE_SA_KEY;
  if (!raw) return null;
  try {
    const json = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    if (json.client_email && json.private_key) return { client_email: json.client_email, private_key: json.private_key };
  } catch {
    /* chave inválida */
  }
  return null;
}

export function calendarId(doutorId: string): string | null {
  if (doutorId === "lucas") return process.env.GCAL_LUCAS || null;
  if (doutorId === "socio") return process.env.GCAL_CLAUDIO || null;
  return null;
}

export function contaServicoEmail(): string | null {
  return sa()?.client_email ?? null;
}

// configurado = tem a chave da SA E a agenda daquele doutor definida
export function googleConfigurado(doutorId: string): boolean {
  return !!sa() && !!calendarId(doutorId);
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

let cache: { token: string; exp: number } | null = null;

async function accessToken(): Promise<string | null> {
  const key = sa();
  if (!key) return null;
  const now = Math.floor(Date.now() / 1000);
  if (cache && cache.exp - 60 > now) return cache.token;

  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: key.client_email,
      scope: "https://www.googleapis.com/auth/calendar",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  const sig = b64url(signer.sign(key.private_key.replace(/\\n/g, "\n")));
  const jwt = `${header}.${claim}.${sig}`;

  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!r.ok) return null;
  const j = (await r.json()) as { access_token?: string; expires_in?: number };
  if (!j.access_token) return null;
  cache = { token: j.access_token, exp: now + (j.expires_in ?? 3600) };
  return j.access_token;
}

// Cria o evento no Google Agenda do doutor. Retorna o link do evento ou null (sem quebrar o agendamento).
export async function criarEventoGoogle(
  doutorId: string,
  ev: { procedimento: string; paciente?: string; data: string; hora: string },
): Promise<string | null> {
  const calId = calendarId(doutorId);
  const token = await accessToken();
  if (!calId || !token) return null;

  const [h, m] = ev.hora.split(":").map(Number);
  const fim = `${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const body = {
    summary: `${ev.procedimento}${ev.paciente ? " — " + ev.paciente : ""}`,
    description: `Agendado pela Sofia (assistente virtual da Clínica Rotelli).\nProcedimento: ${ev.procedimento}.`,
    start: { dateTime: `${ev.data}T${ev.hora}:00`, timeZone: FUSO },
    end: { dateTime: `${ev.data}T${fim}:00`, timeZone: FUSO },
  };
  try {
    const r = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}/events`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    if (!r.ok) return null;
    const j = (await r.json()) as { htmlLink?: string; id?: string };
    return j.htmlLink ?? j.id ?? null;
  } catch {
    return null;
  }
}

// Testa se a SA enxerga a agenda do doutor (precisa ter sido compartilhada).
export async function testarGoogle(doutorId: string): Promise<{ ok: boolean; erro?: string }> {
  if (!sa()) return { ok: false, erro: "Conta de serviço não configurada (GOOGLE_SA_KEY)." };
  const calId = calendarId(doutorId);
  if (!calId) return { ok: false, erro: "Agenda do doutor não configurada (GCAL_*)." };
  const token = await accessToken();
  if (!token) return { ok: false, erro: "Falha ao autenticar a conta de serviço (chave inválida?)." };
  try {
    const r = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (r.ok) return { ok: true };
    if (r.status === 404)
      return { ok: false, erro: "Agenda não encontrada / não compartilhada com a conta de serviço." };
    return { ok: false, erro: `Google respondeu ${r.status}.` };
  } catch {
    return { ok: false, erro: "Erro de rede ao falar com o Google." };
  }
}
