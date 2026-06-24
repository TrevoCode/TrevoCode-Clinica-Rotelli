// Adapter de agenda (DEMO: em memória, por doutor). Interface única pro orquestrador.
// O bot só agenda procedimentos GERAIS com o Dr. Lucas; implante vai pra humano.
// Em produção, troca a implementação pelo sistema de consultório da clínica.

import { store, DOUTORES, HORAS_CANDIDATAS, proximosDias, rotuloData } from "./store";
import type { Booking } from "./tipos";

const GERAL = "lucas"; // procedimentos gerais → Dr. Lucas

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
  data: string;
  hora: string;
  conversaId: string;
}): Booking | null {
  const slot = store.agenda.find(
    (s) => s.doutor === GERAL && s.data === args.data && s.hora === args.hora && s.status === "livre",
  );
  if (!slot) return null;
  slot.status = "ocupado";
  const booking: Booking = {
    id: `bk_${store.bookings.length + 1}_${args.data}_${args.hora}`,
    procedimento: args.procedimento,
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
