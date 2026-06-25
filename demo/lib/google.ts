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
    description:
      `Agendado pela Sofia (assistente virtual da Clínica Rotelli).\n\n` +
      `Paciente: ${ev.paciente ?? "—"}\nProcedimento: ${ev.procedimento}\nHorário: ${ev.data} às ${ev.hora}`,
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

// Lê os intervalos OCUPADOS (free/busy) da agenda do doutor entre isoMin e isoMax.
// Retorna [{start,end}] em epoch ms, ou null se não configurado / erro (= "não sincronizado").
export async function ocupadosGoogle(
  doutorId: string,
  isoMin: string,
  isoMax: string,
): Promise<{ start: number; end: number }[] | null> {
  const calId = calendarId(doutorId);
  const token = await accessToken();
  if (!calId || !token) return null;
  try {
    const r = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ timeMin: isoMin, timeMax: isoMax, timeZone: FUSO, items: [{ id: calId }] }),
    });
    if (!r.ok) return null;
    const j = (await r.json()) as {
      calendars?: Record<string, { busy?: { start: string; end: string }[]; errors?: unknown }>;
    };
    const cal = j.calendars?.[calId];
    if (!cal || cal.errors) return null;
    return (cal.busy ?? []).map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) }));
  } catch {
    return null;
  }
}

// Lê os EVENTOS (com título) da agenda do doutor entre isoMin e isoMax — pra mostrar o que está
// agendado (paciente + procedimento + hora) no site. Retorna null se não configurado / erro.
export async function eventosGoogle(
  doutorId: string,
  isoMin: string,
  isoMax: string,
): Promise<{ id: string; start: number; end: number; data: string; hora: string; fim: string; titulo: string }[] | null> {
  const calId = calendarId(doutorId);
  const token = await accessToken();
  if (!calId || !token) return null;
  try {
    const u = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}/events`);
    u.searchParams.set("timeMin", isoMin);
    u.searchParams.set("timeMax", isoMax);
    u.searchParams.set("singleEvents", "true");
    u.searchParams.set("orderBy", "startTime");
    u.searchParams.set("maxResults", "250");
    const r = await fetch(u, { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) return null;
    const j = (await r.json()) as {
      items?: {
        id?: string;
        summary?: string;
        transparency?: string;
        start?: { dateTime?: string; date?: string };
        end?: { dateTime?: string; date?: string };
      }[];
    };
    const fData = new Intl.DateTimeFormat("en-CA", { timeZone: FUSO, year: "numeric", month: "2-digit", day: "2-digit" });
    const fHora = new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, hour: "2-digit", minute: "2-digit", hour12: false });
    const out: { id: string; start: number; end: number; data: string; hora: string; fim: string; titulo: string }[] = [];
    for (const e of j.items ?? []) {
      if (e.transparency === "transparent") continue; // evento marcado como "disponível"
      const s = e.start?.dateTime ?? (e.start?.date ? `${e.start.date}T00:00:00-03:00` : null);
      const en = e.end?.dateTime ?? (e.end?.date ? `${e.end.date}T00:00:00-03:00` : null);
      if (!s || !en) continue;
      const start = Date.parse(s);
      const end = Date.parse(en);
      out.push({ id: e.id ?? "", start, end, data: fData.format(start), hora: fHora.format(start), fim: fHora.format(end), titulo: e.summary || "(ocupado)" });
    }
    return out;
  } catch {
    return null;
  }
}

// Cria um evento avulso (agendamento ou bloqueio) na agenda do doutor. Retorna o id ou null.
export async function criarEvento(
  doutorId: string,
  ev: { summary: string; descricao?: string; data: string; hora: string; fim: string },
): Promise<string | null> {
  const calId = calendarId(doutorId);
  const token = await accessToken();
  if (!calId || !token) return null;
  try {
    const r = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}/events`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: ev.summary,
          description: ev.descricao ?? "",
          start: { dateTime: `${ev.data}T${ev.hora}:00`, timeZone: FUSO },
          end: { dateTime: `${ev.data}T${ev.fim}:00`, timeZone: FUSO },
        }),
      },
    );
    if (!r.ok) return null;
    const j = (await r.json()) as { id?: string };
    return j.id ?? null;
  } catch {
    return null;
  }
}

// Remove um evento da agenda do doutor. true se removeu (ou já não existia).
export async function deletarEvento(doutorId: string, id: string): Promise<boolean> {
  const calId = calendarId(doutorId);
  const token = await accessToken();
  if (!calId || !token) return false;
  try {
    const r = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}/events/${encodeURIComponent(id)}`,
      { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
    );
    return r.ok || r.status === 410;
  } catch {
    return false;
  }
}
