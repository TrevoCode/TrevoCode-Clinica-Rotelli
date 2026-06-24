# Plano de Ação — Máquina de Captação de Pacientes (Clínica do Lucas)

> Trevocode. v0.2 (2026-06-21). Grounded em `REQUISITOS-LUCAS.md` (áudios do Lucas) + refinamentos do Nobre.
> Liga: PLANO.md · PLANO-FASE1.md · BOT-PROMPT.md · BASE-CONHECIMENTO-MODELO.md · DEMO-SCOPE.md.

## Produto em uma frase
**Captação:** Instagram + anúncios → lead cai no WhatsApp → **bot responde na hora, resolve o simples e agenda**; **escala pro humano** o que é clínico/delicado (implante, dor, remédio) — **sem inventar**. Meta do Lucas: ~10 pacientes/mês já é ótimo.

## Quem é quem
- **Lucas** — clínico geral; faz tudo **menos implante**. Bot pode marcar nos horários livres dele.
- **Sócio/"chefe"** — dono, **implante** (delicado). É o **decisor**, quer a proposta "mastigada". Implante **não** é auto-marcado.

---

## 🧭 REGRA CENTRAL — quem atende o quê (roteamento)

**BOT resolve sozinho:**
- Informação da base: preço, horário, convênios, endereço, formas de pagamento, FAQ.
- Dúvidas simples (ex.: "quero marcar uma limpeza").
- **Agenda procedimentos gerais** (limpeza, avaliação, restauração… = serviços do Lucas), lendo a **agenda dos doutores** e gravando o procedimento no horário livre.

**Passa pro HUMANO (Lucas/secretária), com resumo e SEM inventar:**
- **Clínico:** dor/sintoma em alguma região, "qual remédio tomar" → nunca diagnostica/prescreve.
- **Implante** → especialidade do chefe, delicado → direciona pro humano.
- Qualquer coisa **fora do alcance / sem fonte na base / dúvida** → handoff.

> O bot **inicia toda conversa** e identifica o próprio limite. Anti-alucinação é o que sustenta isso (RAG ancorado + guardrails).

---

## Pilares (em paralelo)

### Pilar A — Captação (Instagram + anúncios) — *prioridade do Lucas*
- [ ] **A1.** Plano de conteúdo do Instagram: posts por especialidade (Lucas = geral, chefe = implante) + **estrutura da clínica**.
- [ ] **A2.** Exemplos de post prontos (pra apresentação "mastigada" do sócio).
- [ ] **A3.** Anúncios pagos: estrutura de campanha pra captar leads → cair no WhatsApp.
- [ ] **A4.** (Fase 2) Automação de postagem (legenda IA + melhor horário) — depende de Meta/app review.

### Pilar B — Atendimento + Agendamento (bot)
- [ ] **B1.** Base de conhecimento real (preços, convênios, horário, FAQ) — Trevocode levanta.
- [ ] **B2.** Bot responde o simples + **agenda geral** lendo a agenda dos doutores.
- [ ] **B3.** **Roteamento por procedimento/profissional** + regras de escalonamento (clínico, implante, fora de escopo).
- [ ] **B4.** **Agenda dos doutores** (Lucas geral / chefe implante): horário livre por profissional + procedimento. No início, agenda própria simples do bot; depois **integrar com o sistema de consultório deles** (agenda + anamnese, que já existe).
- [ ] **B5.** Handoff humano (Lucas + secretária) com resumo da conversa.
- [ ] **B6.** Painel da secretária: leads, conversas (IA/humano), agendamentos, fila de escalonamento.

### Transversal
- [ ] **T1.** Tela simples pra clínica editar o essencial (preço/FAQ/horário/pausa) — sem código.
- [ ] **T2.** Canal WhatsApp: provisionar nº + Meta (demora) → **apresentação roda no simulador** já pronto.
- [ ] **T3.** **Proposta comercial "mastigada"** pro sócio (o que entrega, como funciona, preço) + link clicável.

---

## Sequência pra montar a apresentação
1. **Insumos reais** (base + serviços do Lucas + confirmação implante=chefe + horários dos doutores).
2. **Reposicionar o demo do bot:** agenda por doutor + roteamento + escalonamento (implante/clínico) + reframe captação.
3. **Pilar A:** exemplos de post do Instagram (por especialidade + estrutura).
4. **Proposta comercial mastigada** pro sócio.
5. **Publicar link** + apresentar.

## O que já temos vs. o que falta
- **Temos** (`/demo`): chat WhatsApp + bot + agendamento simples + painel + guardrails + motor de IA trocável. Build OK.
- **Ajustar no demo:** agenda **por doutor** (Lucas/chefe); regra **"implante → humano"**; reforçar **"dor/remédio → humano"**; reframe pra captação.
- **Adicionar:** Pilar A (Instagram) + proposta comercial.

## Insumos rápidos que ainda preciso
- Lista dos procedimentos que o **Lucas** faz (geral) + confirmar **implante = só o chefe**.
- **Horários de atendimento de cada doutor** (pra montar a agenda).
- Convênios/preços reais (ou aproximados) pra base.
- Print/acesso do **sistema de consultório** e do **site** (pra ver integração).
- @ do **Instagram** da clínica (quando for montar conteúdo).
