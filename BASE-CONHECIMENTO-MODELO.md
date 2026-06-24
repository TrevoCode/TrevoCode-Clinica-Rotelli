# Base de Conhecimento Modelo — Clínica do Lucas

> Trevocode × Clínica do Lucas. v0.1 (2026-06-21). Insumo da Fase 0; alimenta o RAG (M3) e o CONTEXTO do bot (`BOT-PROMPT.md` §3).
> **Quem preenche: a Trevocode** (a clínica NÃO mexe nisso — serviço gerenciado). Levantamos o conteúdo numa conversa curta com o Lucas + materiais que a clínica já tem (tabela de preços, site, Instagram, o que a recepção já responde). Este é um **doc interno de trabalho nosso**, não um formulário pro cliente. Os `[PREENCHER]` e números são preenchidos por nós com os dados reais e autorizados. O que estiver aqui é a **única fonte de verdade** do bot: o que não estiver, ele escala (não inventa).

---

## 1. Como funciona (regras de ouro do conteúdo)

- **1 item = 1 fato atômico.** Um tópico por item (não misture preço com política num item só) → recuperação melhor.
- **O campo `conteudo` é o que o bot lê e usa.** Escreva como uma resposta curta e natural ao paciente.
- **Inclua sinônimos e gírias** (`sinonimos`) — paciente fala "siso", "limpeza", "obturação", não "terceiro molar", "profilaxia", "restauração".
- **Nunca escreva diagnóstico nem conduta clínica** na base (ex.: "se doer, é cárie"). Só fatos: preços, prazos, políticas, o que a clínica faz.
- **Preço sempre em campo estruturado** (`preco`) — o validador do bot confere que ele não cita valor fora da base.
- **Marque o que muda** (`atualizado_em`) e o que **exige autorização** (`requer_autorizacao: true` em preços/convênios).

---

## 2. Schema do item

```yaml
- id: inst-horario              # único, prefixo por categoria
  categoria: institucional      # institucional | localizacao | pagamento | convenios | procedimento | politica | faq
  titulo: Horário de funcionamento
  conteudo: >                   # ISTO vira o CONTEXTO do bot — texto natural, curto
    A clínica funciona de segunda a sexta, das 8h às 18h, e aos sábados das 8h às 12h.
  sinonimos: [horario, que horas abre, funciona sábado, atendimento]
  preco: null                   # só em procedimentos: { valor: 0, tipo: "fixo|a_partir_de|faixa", min:0, max:0, moeda: "BRL" }
  duracao: null                 # ex.: "40 min" (procedimentos)
  requer_autorizacao: false     # true em preço/convênio (não publica sem ok do dono)
  atualizado_em: 2026-06-21
  status: rascunho              # rascunho | ativo
```

---

## 3. Exemplo legível por máquina (3 itens prontos)

```yaml
- id: inst-sobre
  categoria: institucional
  titulo: Sobre a clínica
  conteudo: >
    A [PREENCHER: Nome da Clínica] é uma clínica odontológica em [PREENCHER: bairro/cidade],
    focada em [PREENCHER: ex. odontologia geral, estética e implantes].
  sinonimos: [quem são vocês, sobre, o que é a clínica]
  requer_autorizacao: false
  atualizado_em: 2026-06-21
  status: rascunho

- id: proc-limpeza
  categoria: procedimento
  titulo: Limpeza (profilaxia)
  conteudo: >
    Fazemos limpeza dental (profilaxia), que remove placa e tártaro e ajuda a prevenir
    cáries e problemas na gengiva. O valor final pode variar conforme a avaliação.
  sinonimos: [limpeza, profilaxia, tártaro, tartaro, raspagem]
  preco: { valor: 150, tipo: "a_partir_de", moeda: "BRL" }   # EXEMPLO — substituir
  duracao: "40 min"
  requer_autorizacao: true
  atualizado_em: 2026-06-21
  status: rascunho

- id: pol-cancelamento
  categoria: politica
  titulo: Cancelamento e reagendamento
  conteudo: >
    Você pode remarcar ou cancelar pelo WhatsApp. Pedimos que avise com pelo menos
    [PREENCHER: 24h] de antecedência para liberar o horário a outro paciente.
  sinonimos: [cancelar, desmarcar, remarcar, reagendar, faltar]
  requer_autorizacao: false
  atualizado_em: 2026-06-21
  status: rascunho
```

---

## 4. Base modelo preenchível (por categoria)

### 4.1 Institucional
| id | título | conteúdo (preencher) |
|----|--------|----------------------|
| inst-sobre | Sobre a clínica | A [PREENCHER] é uma clínica odontológica em [PREENCHER], focada em [PREENCHER]. |
| inst-equipe | Equipe / dentistas | Nosso time: [PREENCHER nomes + especialidades + CRO, se quiser divulgar]. |
| inst-diferenciais | Diferenciais | [PREENCHER: ex. atendimento humanizado, tecnologia X, sedação, etc.] |

### 4.2 Localização & horário
| id | título | conteúdo |
|----|--------|----------|
| loc-endereco | Endereço | Estamos na [PREENCHER: rua, nº, bairro, cidade]. Ponto de referência: [PREENCHER]. |
| loc-comochegar | Como chegar / estacionamento | [PREENCHER: tem estacionamento? convênio? transporte público próximo?] |
| inst-horario | Horário de funcionamento | [PREENCHER: ex. seg–sex 8h–18h, sáb 8h–12h]. |
| inst-contato | Contatos | WhatsApp: este número. Telefone: [PREENCHER]. Instagram: [PREENCHER]. |

### 4.3 Pagamento & convênios
| id | título | conteúdo | requer_autorizacao |
|----|--------|----------|--------------------|
| pag-formas | Formas de pagamento | Aceitamos [PREENCHER: dinheiro, Pix, débito, crédito]. | false |
| pag-parcelamento | Parcelamento | Parcelamos em até [PREENCHER]x [PREENCHER: com/sem juros]. | true |
| conv-lista | Convênios aceitos | Atendemos os convênios: [PREENCHER lista]. Não atendemos: [PREENCHER, se quiser deixar explícito]. | true |
| conv-particular | Atendimento particular | Atendemos também particular. Valores conforme a avaliação. | false |

> ⚠️ Convênios e preços = `requer_autorizacao: true`. Só entram "ativos" com ok do dono. Se um convênio não estiver listado, o bot **escala** (não chuta).

### 4.4 Procedimentos & preços
> Cada linha vira um item `categoria: procedimento`. Preço no campo estruturado. **Números abaixo são exemplos — substituir.**

| id | procedimento | descrição curta (conteúdo) | preço (exemplo) | duração | sinônimos |
|----|--------------|----------------------------|-----------------|---------|-----------|
| proc-avaliacao | Avaliação / 1ª consulta | Consulta de avaliação para entender seu caso e montar o plano de tratamento. | [PREENCHER: ex. grátis / R$ X] | 30 min | consulta, avaliação, primeira vez |
| proc-limpeza | Limpeza (profilaxia) | Remove placa e tártaro; ajuda a prevenir cáries e problemas de gengiva. | a partir de R$ 150 | 40 min | limpeza, profilaxia, tártaro, raspagem |
| proc-restauracao | Restauração (obturação) | Restaura o dente afetado por cárie ou fratura. | a partir de R$ [PREENCHER] | 40 min | obturação, tapar dente, restauração |
| proc-extracao | Extração simples | Remoção de dente quando indicado pelo dentista. | a partir de R$ [PREENCHER] | 30 min | arrancar dente, extrair |
| proc-siso | Extração de siso | Remoção do dente do siso (terceiro molar) conforme avaliação. | a partir de R$ [PREENCHER] | 45 min | siso, dente do juízo, terceiro molar |
| proc-canal | Canal (endodontia) | Tratamento de canal para salvar o dente. | a partir de R$ [PREENCHER] | 60 min | canal, endodontia, tratar a raiz |
| proc-clareamento | Clareamento | Clareamento dental para deixar os dentes mais brancos. | a partir de R$ [PREENCHER] | varia | clarear, branquear, clareamento |
| proc-aparelho | Ortodontia (aparelho) | Aparelhos para alinhar os dentes; tipo e valor definidos na avaliação. | sob avaliação | varia | aparelho, ortodontia, alinhar dentes |
| proc-implante | Implante | Reposição de dente perdido com implante, conforme avaliação. | sob avaliação | varia | implante, dente novo, parafuso |
| proc-protese | Prótese / coroa | Prótese ou coroa para repor/cobrir dentes. | sob avaliação | varia | prótese, coroa, dentadura, ponte |
| proc-odontoped | Odontopediatria | Atendimento odontológico para crianças. | [PREENCHER] | 30 min | criança, infantil, filho, pediatria |

> Para procedimentos sem preço fixo: usar `tipo: "sob_avaliacao"` → o bot diz "o valor é definido na avaliação" e oferece agendar (não inventa número).

### 4.5 Políticas
| id | título | conteúdo |
|----|--------|----------|
| pol-cancelamento | Cancelamento/reagendamento | Pode remarcar/cancelar pelo WhatsApp; avise com [PREENCHER: 24h] de antecedência. |
| pol-atraso | Atrasos | Tolerância de [PREENCHER] min; acima disso pode ser preciso remarcar. |
| pol-primeira-consulta | O que levar na 1ª consulta | Leve documento e, se tiver, exames/radiografias recentes. [PREENCHER] |
| pol-urgencia | Urgências | Em caso de dor forte/trauma, [PREENCHER: como funciona o encaixe]. Casos graves: procurar pronto-socorro. |
| pol-garantia | Garantia de procedimentos | [PREENCHER, se houver política de garantia]. |

### 4.6 FAQ (perguntas frequentes — respostas seguras, sem diagnóstico)
| id | pergunta | conteúdo (resposta) |
|----|----------|---------------------|
| faq-urgencia | Atendem urgência? | [PREENCHER: como funciona o encaixe de urgência]. Em casos graves, oriente procurar pronto-socorro. |
| faq-crianca | Atendem crianças? | [PREENCHER: sim/não; a partir de que idade]. |
| faq-encaminhamento | Preciso de encaminhamento? | Não precisa — é só agendar uma avaliação com a gente. |
| faq-dor | Dói fazer o procedimento? | Trabalhamos para o seu conforto; procedimentos que precisam são feitos com anestesia. Sobre o seu caso, o dentista avalia na consulta. |
| faq-tempo-limpeza | Quanto tempo demora uma limpeza? | Em média [PREENCHER: ~40 min], mas depende da avaliação. |
| faq-parcela | Dá pra parcelar? | Sim, em até [PREENCHER]x [PREENCHER: com/sem juros]. |
| faq-convenio | Atendem meu convênio? | Atendemos: [PREENCHER lista]. Se o seu não estiver na lista, te conecto com a equipe pra confirmar. |
| faq-sus | Atendem pelo SUS? | [PREENCHER: sim/não]. |
| faq-horario | Que horas vocês abrem? | [PREENCHER: ex. seg–sex 8h–18h, sáb 8h–12h]. |
| faq-estacionamento | Tem estacionamento? | [PREENCHER]. |

---

## 5. Diretrizes de escrita (pra base ficar "RAG-friendly")

- **Curto e direto** (1–3 frases por `conteudo`). Frases longas atrapalham a recuperação.
- **Uma ideia por item.** Se um tópico tem 2 perguntas distintas, vira 2 itens.
- **Fale como o paciente fala** nos `sinonimos` (gírias, erros comuns: "tartaro", "siso", "dor de dente").
- **Sem promessa absoluta** em conteúdo clínico ("não dói nada", "cura garantida"). Use "geralmente", "conforme a avaliação".
- **Preço sempre com a ressalva** "valor final depende da avaliação", quando aplicável.
- **Datado:** toda mudança atualiza `atualizado_em`.

---

## 6. O que **NÃO** incluir na base

- ❌ Diagnósticos, causas de sintoma, conduta clínica ("se doer, faça X").
- ❌ Indicação/ajuste de medicação.
- ❌ Dados de pacientes (nome, histórico, exames) — isso é dado sensível, fica fora da base do bot.
- ❌ Promessas de resultado/cura.
- ❌ Preço não autorizado pelo dono.

---

## 7. Manutenção

- **Trevocode mantém** (serviço gerenciado): a clínica não edita nada. Quando mudar um preço/convênio, a clínica só **avisa por uma mensagem** (ex.: "implante subiu pra R$ X") e a gente atualiza.
- **Revisão proativa nossa:** mensal, ou sempre que a clínica avisar.
- Internamente: item alterado entra como `rascunho` → publicamos como `ativo` (gera novo embedding no RAG).

---

## Próximo
- Lucas preenche os `[PREENCHER]` (institucional, preços reais, convênios, políticas).
- A gente ingere no RAG (M3) e roda os **testes-armadilha** (`BOT-PROMPT.md` §8) contra a base real.
- Posso já transformar este modelo num **formulário/planilha** pra clínica preencher mais fácil (ex.: `.xlsx` por categoria), se quiser.
