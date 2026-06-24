// Armazenamento em memória para a DEMO (reseta ao reiniciar o servidor).
// Em produção vira Postgres + integração com o sistema de consultório da clínica.
// Usa globalThis para sobreviver ao hot-reload do Next em dev.

import type { Conversa, Booking, Escala, SlotAgenda, Doutor } from "./tipos";

// Dois doutores: Dr. Lucas (clínico geral) e Dr. Claudio Rotelli (implante + harmonização = sócio/dono).
export const DOUTORES: Doutor[] = [
  { id: "lucas", nome: "Dr. Lucas", especialidade: "Clínico geral" },
  { id: "socio", nome: "Dr. Claudio Rotelli", especialidade: "Implante e Harmonização Orofacial" },
];

export const HORAS_CANDIDATAS = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function proximosDias(qtd = 7): { data: string; rotulo: string }[] {
  const out: { data: string; rotulo: string }[] = [];
  const hoje = new Date();
  let off = 1;
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
  const pre: Record<string, string[]> = {
    lucas: ["09:00", "10:00", "14:00", "15:00", "16:00"],
    socio: ["10:00", "11:00", "15:00"],
  };
  for (const { data } of proximosDias(5)) {
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
