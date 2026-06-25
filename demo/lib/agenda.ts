// Adapter de agenda (DEMO: em memória, por doutor). Interface única pro orquestrador.
// O bot só agenda procedimentos GERAIS com o Dr. Lucas; implante vai pra humano.
// Em produção, troca a implementação pelo sistema de consultório da clínica.

import { store, DOUTORES, HORAS_CANDIDATAS, proximosDias, rotuloData } from "./store";
import { googleConfigurado, eventosGoogle } from "./google";
import type { Booking } from "./tipos";

const GERAL = "lucas"; // procedimentos gerais → Dr. Lucas

// America/Sao_Paulo = UTC-3 fixo (o Brasil não tem mais horário de verão).
const OFFSET = "-03:00";

function slotMs(data: string, hora: string): { ini: number; fim: number } {
  const ini = Date.parse(`${data}T${hora}:00${OFFSET}`);
  return { ini, fim: ini + 30 * 60 * 1000 };
}

// Grade de disponibilidade do doutor para os próximos dias.
// Se a agenda Google estiver conectada, lê o free/busy REAL (o site acompanha o Google);
// senão, cai no store em memória (modo demo).
export async function gradeDoutor(
  doutorId: string,
  diaISO: string,
): Promise<{
  slots: { doutor: string; data: string; hora: string; status: string; titulo?: string }[];
  eventos: { id: string; data: string; hora: string; fim: string; titulo: string }[];
  sincronizado: boolean;
}> {
  let eventos: { id: string; start: number; end: number; data: string; hora: string; fim: string; titulo: string }[] | null = null;
  if (googleConfigurado(doutorId)) {
    eventos = await eventosGoogle(doutorId, `${diaISO}T00:00:00${OFFSET}`, `${diaISO}T23:59:59${OFFSET}`);
  }
  const slots: { doutor: string; data: string; hora: string; status: string; titulo?: string }[] = [];
  for (const hora of HORAS_CANDIDATAS) {
    if (eventos !== null) {
      const { ini, fim } = slotMs(diaISO, hora);
      const ev = eventos.find((e) => ini < e.end && fim > e.start);
      slots.push({ doutor: doutorId, data: diaISO, hora, status: ev ? "ocupado" : "livre", ...(ev ? { titulo: ev.titulo } : {}) });
    } else {
      const s = store.agenda.find((x) => x.doutor === doutorId && x.data === diaISO && x.hora === hora);
      slots.push({ doutor: doutorId, data: diaISO, hora, status: s ? s.status : "indisponivel" });
    }
  }
  return {
    slots,
    eventos: (eventos ?? []).map((e) => ({ id: e.id, data: e.data, hora: e.hora, fim: e.fim, titulo: e.titulo })),
    sincronizado: eventos !== null,
  };
}

export function getDisponibilidade(doutor = GERAL): { data: string; hora: string }[] {
  return store.agenda
    .filter((s) => s.doutor === doutor && s.status === "livre")
    .map(({ data, hora }) => ({ data, hora }));
}

// Texto pro CONTEXTO do bot — só os horários livres do Dr. Lucas (geral).
export function disponibilidadeComoContexto(): string {
  const livres = store.agenda.filter((s) => s.doutor === GERAL && s.status === "livre");
  if (livres.length === 0) return "(sem horários livres com o Dr. Lucas no momento)";
  const porDia = new Map<string, string[]>();
  for (const s of livres) {
    if (!porDia.has(s.data)) porDia.set(s.data, []);
    porDia.get(s.data)!.push(s.hora);
  }
  return Array.from(porDia.entries())
    .map(([data, horas]) => `- ${rotuloData(data)} (${data}): ${horas.join(", ")}`)
    .join("\n");
}

// Reserva (geral, com o Dr. Lucas), com trava anti-conflito.
export function reservar(args: {
  procedimento: string;
  paciente?: string;
  data: string;
  hora: string;
  conversaId: string;
}): Booking | null {
  // Quando a agenda Google está conectada, ELA é a fonte da verdade (o evento criado no Google é a
  // reserva real). Sem Google, valida/ocupa o slot em memória (demo).
  if (!googleConfigurado(GERAL)) {
    const slot = store.agenda.find(
      (s) => s.doutor === GERAL && s.data === args.data && s.hora === args.hora && s.status === "livre",
    );
    if (!slot) return null;
    slot.status = "ocupado";
  }
  const booking: Booking = {
    id: `bk_${store.bookings.length + 1}_${args.data}_${args.hora}`,
    procedimento: args.procedimento,
    paciente: args.paciente,
    doutor: GERAL,
    data: args.data,
    hora: args.hora,
    conversaId: args.conversaId,
    criadoEm: Date.now(),
    via: "ia",
  };
  store.bookings.push(booking);
  return booking;
}

// --- Admin: a clínica define os horários livres de cada doutor por dia ---
export function gridAgenda() {
  return { doutores: DOUTORES, dias: proximosDias(7), horas: HORAS_CANDIDATAS, slots: store.agenda };
}

// Liga/desliga um horário. Não mexe em horário já agendado (ocupado).
export function toggleSlot(doutor: string, data: string, hora: string): string {
  const i = store.agenda.findIndex((s) => s.doutor === doutor && s.data === data && s.hora === hora);
  if (i === -1) {
    store.agenda.push({ doutor, data, hora, status: "livre" });
    return "livre";
  }
  if (store.agenda[i].status === "ocupado") return "ocupado";
  store.agenda.splice(i, 1);
  return "indisponivel";
}
