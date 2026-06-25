// Armazenamento em memória para a DEMO (reseta ao reiniciar o servidor).
// Em produção vira Postgres + integração com o sistema de consultório da clínica.
// Usa globalThis para sobreviver ao hot-reload do Next em dev.

import type { Conversa, Booking, Escala, SlotAgenda, Doutor } from "./tipos";

// Dois doutores: Dr. Lucas (clínico geral) e Dr. Claudio Rotelli (implante + harmonização = sócio/dono).
export const DOUTORES: Doutor[] = [
  { id: "lucas", nome: "Dr. Lucas", especialidade: "Clínico geral" },
  { id: "socio", nome: "Dr. Claudio Rotelli", especialidade: "Implante e Harmonização Orofacial" },
];

// Horário de atendimento: 07:00 às 18:00, de 30 em 30 min.
// (Almoço/pausas são bloqueados criando eventos na agenda Google — o site acompanha.)
export const HORAS_CANDIDATAS = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00",
];
const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

// Data de hoje (YYYY-MM-DD) no fuso da clínica.
export function hojeISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function proximosDias(qtd = 7): { data: string; rotulo: string }[] {
  const out: { data: string; rotulo: string }[] = [];
  const hoje = new Date();
  let off = 0;
  while (out.length < qtd && off < 21) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() + off);
    off += 1;
    if (d.getDay() === 0) continue; // pula domingo
    const data = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    out.push({ data, rotulo: `${DIAS[d.getDay()]} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}` });
  }
  return out;
}

export function rotuloData(data: string): string {
  const [y, m, dd] = data.split("-").map(Number);
  const d = new Date(y, m - 1, dd);
  return `${DIAS[d.getDay()]} ${pad(dd)}/${pad(m)}`;
}

interface Store {
  conversas: Map<string, Conversa>;
  bookings: Booking[];
  escalas: Escala[];
  agenda: SlotAgenda[];
}

// Disponibilidade inicial de demo (a clínica ajusta na tela /agenda).
function gerarAgenda(): SlotAgenda[] {
  const slots: SlotAgenda[] = [];
  // Fallback de demo (só usado quando a agenda Google não está conectada).
  const pre: Record<string, string[]> = {
    lucas: HORAS_CANDIDATAS,
    socio: HORAS_CANDIDATAS.filter((_, i) => i % 2 === 0),
  };
  for (const { data } of proximosDias(7)) {
    for (const doutor of Object.keys(pre)) {
      for (const hora of pre[doutor]) slots.push({ doutor, data, hora, status: "livre" });
    }
  }
  return slots;
}

const g = globalThis as unknown as { __demoStore?: Store };

export const store: Store =
  g.__demoStore ??
  (g.__demoStore = {
    conversas: new Map<string, Conversa>(),
    bookings: [],
    escalas: [],
    agenda: gerarAgenda(),
  });
