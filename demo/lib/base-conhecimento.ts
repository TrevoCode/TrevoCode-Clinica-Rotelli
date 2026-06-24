// Base de conhecimento de DEMO da Clínica Rotelli.
// Preços, endereço e horários aqui são EXEMPLOS de demonstração — os reais entram após o fechamento.
// É a ÚNICA fonte de verdade do bot: o que não estiver aqui, ele escala (não inventa).
// Em produção, isto vira RAG vetorial alimentado pela base real da Clínica Rotelli.

export interface ItemBase {
  id: string;
  categoria: string;
  titulo: string;
  conteudo: string;
  sinonimos?: string[];
}

export const BASE: ItemBase[] = [
  {
    id: "inst-sobre",
    categoria: "institucional",
    titulo: "Sobre a clínica",
    conteudo:
      "A Clínica Rotelli é uma clínica odontológica em São Bernardo do Campo/SP, com odontologia geral, implantes e harmonização orofacial.",
    sinonimos: ["quem são vocês", "sobre"],
  },
  {
    id: "equipe-doutores",
    categoria: "institucional",
    titulo: "Equipe",
    conteudo:
      "Nossa equipe: Dr. Lucas (clínico geral — limpeza, restaurações, canais, extrações, clareamento) e Dr. Claudio Rotelli (especialista em implante e harmonização orofacial).",
    sinonimos: ["dentistas", "equipe", "quem atende", "quem faz implante", "quem faz harmonização", "doutor"],
  },
  {
    id: "inst-horario",
    categoria: "institucional",
    titulo: "Horário de funcionamento",
    conteudo:
      "Funcionamos de segunda a sexta, das 8h às 18h, e aos sábados das 8h às 12h. Não abrimos aos domingos e feriados.",
    sinonimos: ["horario", "que horas abre", "funciona sábado", "atendimento"],
  },
  {
    id: "loc-endereco",
    categoria: "localizacao",
    titulo: "Endereço",
    conteudo:
      "A Clínica Rotelli fica em São Bernardo do Campo/SP. Posso te passar o endereço completo e o ponto de referência junto da confirmação do seu horário. (endereço exato entra na sessão de base com a clínica)",
    sinonimos: ["onde fica", "endereço", "localização", "como chegar"],
  },
  {
    id: "loc-estacionamento",
    categoria: "localizacao",
    titulo: "Estacionamento",
    conteudo: "Há estacionamento conveniado no prédio ao lado, com desconto para pacientes.",
    sinonimos: ["estacionar", "estacionamento", "vaga"],
  },
  {
    id: "pag-formas",
    categoria: "pagamento",
    titulo: "Formas de pagamento",
    conteudo:
      "Aceitamos dinheiro, Pix, cartão de débito e crédito. Parcelamos em até 12x no crédito (consultar condições na avaliação).",
    sinonimos: ["pagamento", "parcelar", "pix", "cartão"],
  },
  {
    id: "conv-lista",
    categoria: "convenios",
    titulo: "Convênios aceitos",
    conteudo:
      "Atendemos os convênios: Amil Dental, Bradesco Dental e SulAmérica Odonto. Também atendemos particular. Se o seu convênio não estiver nesta lista, confirme com a equipe.",
    sinonimos: ["convênio", "plano odontológico", "amil", "bradesco", "sulamérica"],
  },
  {
    id: "proc-avaliacao",
    categoria: "procedimento",
    titulo: "Avaliação / primeira consulta",
    conteudo:
      "A consulta de avaliação é GRATUITA. Nela o dentista entende o seu caso e monta o plano de tratamento.",
    sinonimos: ["consulta", "avaliação", "primeira vez", "primeira consulta"],
  },
  {
    id: "proc-limpeza",
    categoria: "procedimento",
    titulo: "Limpeza (profilaxia)",
    conteudo:
      "Limpeza dental (profilaxia): a partir de R$ 150. Remove placa e tártaro e ajuda a prevenir cáries e problemas na gengiva. O valor final depende da avaliação.",
    sinonimos: ["limpeza", "profilaxia", "tártaro", "tartaro", "raspagem"],
  },
  {
    id: "proc-restauracao",
    categoria: "procedimento",
    titulo: "Restauração (obturação)",
    conteudo:
      "Restauração (obturação): a partir de R$ 200 por dente. Restaura o dente afetado por cárie ou fratura. O valor final depende da avaliação.",
    sinonimos: ["obturação", "restauração", "tapar dente", "cárie"],
  },
  {
    id: "proc-extracao",
    categoria: "procedimento",
    titulo: "Extração simples",
    conteudo: "Extração simples: a partir de R$ 180. O valor final depende da avaliação.",
    sinonimos: ["extração", "arrancar dente", "extrair"],
  },
  {
    id: "proc-siso",
    categoria: "procedimento",
    titulo: "Extração de siso",
    conteudo:
      "Extração de siso (terceiro molar): a partir de R$ 350. O valor e a complexidade são definidos na avaliação.",
    sinonimos: ["siso", "dente do juízo", "terceiro molar"],
  },
  {
    id: "proc-canal",
    categoria: "procedimento",
    titulo: "Canal (endodontia)",
    conteudo: "Tratamento de canal (endodontia): a partir de R$ 600. O valor final depende da avaliação.",
    sinonimos: ["canal", "endodontia", "tratar a raiz"],
  },
  {
    id: "proc-clareamento",
    categoria: "procedimento",
    titulo: "Clareamento",
    conteudo: "Clareamento dental: a partir de R$ 800. Deixa os dentes mais brancos. Avaliação define o melhor método.",
    sinonimos: ["clarear", "branquear", "clareamento"],
  },
  {
    id: "proc-implante",
    categoria: "procedimento",
    titulo: "Implante",
    conteudo:
      "Implante dentário é com o nosso especialista, o Dr. Claudio Rotelli. É um caso mais delicado: a equipe cuida do atendimento e do agendamento. O valor é definido na avaliação.",
    sinonimos: ["implante", "dente novo", "parafuso"],
  },
  {
    id: "proc-harmonizacao",
    categoria: "procedimento",
    titulo: "Harmonização orofacial",
    conteudo:
      "Harmonização orofacial é com o nosso especialista, o Dr. Claudio Rotelli. Procedimento estético/facial mais delicado: a equipe cuida do atendimento e do agendamento. O valor e o plano são definidos na avaliação.",
    sinonimos: ["harmonização", "harmonizacao orofacial", "HOF", "botox", "preenchimento", "estética facial"],
  },
  {
    id: "proc-aparelho",
    categoria: "procedimento",
    titulo: "Ortodontia (aparelho)",
    conteudo:
      "Aparelho ortodontico: tipo e valor definidos na avaliação. Alinha os dentes.",
    sinonimos: ["aparelho", "ortodontia", "alinhar dentes"],
  },
  {
    id: "pol-cancelamento",
    categoria: "politica",
    titulo: "Cancelamento e reagendamento",
    conteudo:
      "Você pode remarcar ou cancelar pelo WhatsApp. Pedimos aviso de pelo menos 24h de antecedência para liberar o horário a outro paciente.",
    sinonimos: ["cancelar", "desmarcar", "remarcar", "reagendar"],
  },
  {
    id: "faq-crianca",
    categoria: "faq",
    titulo: "Atendimento infantil",
    conteudo: "Sim, atendemos crianças a partir de 3 anos (odontopediatria).",
    sinonimos: ["criança", "infantil", "filho", "pediatria"],
  },
  {
    id: "faq-urgencia",
    categoria: "faq",
    titulo: "Urgências",
    conteudo:
      "Em casos de dor forte ou trauma, fazemos encaixe no mesmo dia sempre que possível. Avise pelo WhatsApp que priorizamos o seu atendimento.",
    sinonimos: ["urgência", "emergência", "dor forte", "encaixe"],
  },
  {
    id: "faq-encaminhamento",
    categoria: "faq",
    titulo: "Encaminhamento",
    conteudo: "Não é preciso encaminhamento — é só agendar uma avaliação com a gente.",
    sinonimos: ["encaminhamento", "precisa de pedido"],
  },
];

// No demo, a "recuperação" do RAG = injetar a base inteira (é pequena).
// Em produção, aqui entraria a busca vetorial por similaridade com limiar de confiança.
export function baseComoContexto(): string {
  return BASE.map(
    (i) => `- [${i.id}] (${i.categoria}) ${i.titulo}: ${i.conteudo}`,
  ).join("\n");
}
