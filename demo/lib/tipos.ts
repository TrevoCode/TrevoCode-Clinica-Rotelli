// Tipos compartilhados entre o bot, a API e o painel.

export type Intencao =
  | "duvida"
  | "agendar"
  | "urgencia"
  | "reclamacao"
  | "pedir_humano"
  | "fora_escopo"
  | "saudacao";

export type Acao = "responder" | "escalar" | "agendar";

export interface Agendamento {
  procedimento: string;
  data: string; // "YYYY-MM-DD" — deve bater com um slot livre da agenda
  hora: string; // "HH:MM"
}

// Saída estruturada do bot (o que torna o anti-alucinação verificável em código).
export interface RespostaBot {
  intencao: Intencao;
  acao: Acao;
  mensagem: string;
  fontes: string[];
  urgencia: boolean;
  motivo_escala?: string;
  agendamento?: Agendamento | null;
}

export interface Mensagem {
  autor: "paciente" | "bot" | "sistema";
  texto: string;
  ts: number;
  meta?: {
    acao?: Acao;
    intencao?: Intencao;
    urgencia?: boolean;
    fontes?: string[];
    bloqueadoPorGuardrail?: string;
  };
}

export interface Conversa {
  id: string;
  mensagens: Mensagem[];
  status: "ia" | "humano" | "resolvido";
  criadaEm: number;
}

export interface Booking {
  id: string;
  procedimento: string;
  doutor: string;
  data: string;
  hora: string;
  conversaId: string;
  criadoEm: number;
  via: "ia";
  googleEventLink?: string | null; // link do evento criado no Google Agenda (se integrado)
}

export interface Escala {
  id: string;
  conversaId: string;
  motivo: string;
  urgencia: boolean;
  trecho: string;
  ts: number;
}

export interface Doutor {
  id: string;
  nome: string;
  especialidade: string;
}

export type StatusSlot = "livre" | "ocupado";

export interface SlotAgenda {
  doutor: string;
  data: string;
  hora: string;
  status: StatusSlot;
}
