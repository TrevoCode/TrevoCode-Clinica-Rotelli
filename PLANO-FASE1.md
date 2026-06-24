# Plano de Execução — Fase 1: Atendimento + Agendamento

> Trevocode × Clínica do Lucas. v0.1 (2026-06-21). Complementa `PLANO.md`.
> Travado: WhatsApp **Cloud API oficial** (número ainda não existe → provisionar). Agenda: **descoberta na Fase 0**, build agnóstico. Instagram fica pra Fase 2.

---

## Objetivo da Fase 1
Bot de WhatsApp que **atende** (responde ancorado na base, sem inventar, sem diagnosticar, escala pra humano) e **agenda** (sugere horário, marca, lembra, reagenda), com **painel** mínimo pra clínica operar e auditar.

**Critério de "pronto" (Definition of Done):**
- 20 perguntas reais respondidas corretamente OU escaladas (0 alucinação) no teste-armadilha.
- Agendamento ponta-a-ponta: marcar → confirmar → lembrete 24h/2h → reagendar → cancelar, sem conflito.
- Painel: ver conversas, ver/editar agenda, editar base, pausar IA, ver logs.
- LGPD baseline ativo (aviso de privacidade, retenção, contrato operador assinado).

---

## Fase 0 — Onboarding & pré-requisitos (bloqueia o build)

### 0.1 Provisionar WhatsApp (não existe número ainda)
- [ ] Criar **Meta Business Manager** da clínica (ou usar o existente).
- [ ] Criar **WhatsApp Business Account (WABA)**.
- [ ] **Decidir o número:** recomendo **número novo dedicado** (chip/virtual) — a Cloud API "toma" o número e ele **não funciona mais no app normal do WhatsApp**. Não usar o celular pessoal do Lucas.
- [ ] **Verificação do negócio (Business Verification)** na Meta — pode levar dias; iniciar cedo.
- [ ] Registrar número na Cloud API + gerar tokens.
- [ ] Cadastrar **templates** de mensagem (lembrete, confirmação) p/ aprovação Meta.

### 0.2 Descoberta da agenda (D2)
- [ ] Perguntar ao Lucas o que usa hoje (Google Calendar / software odonto / caderno).
- [ ] Definir o **adapter** a implementar (ver M5). Padrão provisório: Google Calendar.

### 0.3 Base de conhecimento (Trevocode levanta — clínica NÃO preenche nada)
> Modelo turnkey: nós montamos a base. Fontes: **1 conversa curta (~30 min) com o Lucas** + materiais que já existem (tabela de preços atual, site, Instagram, o que a recepção já responde). A clínica só valida no final.
- [ ] Extrair: procedimentos + **preços** + convênios aceitos.
- [ ] Extrair: horário, endereço, formas de pagamento.
- [ ] Extrair: FAQ real (perguntas que mais chegam hoje à recepção).
- [ ] Extrair: política de cancelamento/reagendamento, tempo médio por procedimento.
- [ ] Definir com o Lucas: tom de voz + nome do "assistente".

### 0.4 Jurídico & contas
- [ ] **Contrato de tratamento de dados** (clínica = Controladora, Trevocode = Operadora) assinado.
- [ ] Texto do **aviso de privacidade** (1º contato) aprovado.
- [ ] Conta **Claude API** (billing) + conta de hospedagem (Vercel) + banco (Supabase/Neon).

---

## Módulos a construir (Fase 1)

### M1 — Infra base
- Repo (Next.js + Tailwind), deploy Vercel, banco Postgres (Supabase/Neon) + pgvector.
- Cofre de variáveis (tokens), CI básico, ambientes (preview/prod).
- Esquema inicial do banco: `conversas`, `mensagens`, `base_conhecimento`, `agendamentos`, `logs_auditoria`, `usuarios`.

### M2 — Conector WhatsApp
- Webhook de recebimento (com **validação de assinatura Meta**).
- Envio de mensagens (texto + templates aprovados).
- Janela de 24h e uso de template fora dela.
- Idempotência (não processar a mesma mensagem 2x).

### M3 — Base de conhecimento + RAG
- Editor no painel (CRUD de itens da base) + ingestão (chunk + embedding → pgvector).
- Recuperação por similaridade com **limiar de confiança**.
- Sem trecho relevante → não responde (entrega ao orquestrador o sinal "escalar").

### M4 — Orquestrador do atendimento
- Classificação de intenção (dúvida / agendar / urgência / reclamação / pedir humano).
- Pipeline: intenção → RAG → **guardrails** → resposta ancorada **ou** escala.
- System prompt de escopo fechado (proíbe diagnóstico, prescrição, preço fora da base).
- Validação de saída (bloqueia promessa de preço/horário não confirmado).
- Handoff humano: marca conversa "humano", IA silencia, notifica painel com resumo.

### M5 — Agendamento (agnóstico) + lembretes
- **Adapter de agenda** com interface única (`getDisponibilidade`, `criarEvento`, `cancelar`, `reagendar`) → implementação Google Calendar primeiro; troca de adapter se a clínica usar outro sistema, sem mexer no fluxo.
- Lock anti-conflito (não marca 2 no mesmo slot).
- Cron de lembretes (24h/2h) + confirmação (1 sim / 2 reagendar).
- Reagendamento e cancelamento pelo WhatsApp.

### M6 — Painel v1
> **Operado pela Trevocode**, não pela clínica (turnkey). Único toque da clínica: a recepção **assumir uma conversa** quando o bot escala (já fazem isso hoje no WhatsApp). Sem data entry, sem aprovações.
- Login + RBAC (dono / atendente).
- Inbox de conversas (status IA/humano/resolvido) + assumir/devolver.
- Agenda (ver/editar agendamentos da IA).
- Editor da base de conhecimento.
- **Botão de pausa** da IA + tela de **logs de auditoria**.

### M7 — Segurança/LGPD baseline
- TLS + criptografia em repouso; segredos no cofre; escopos mínimos nos tokens.
- Aviso de privacidade no 1º contato; rotina de **retenção/expurgo**; RBAC; auditoria.
- Rate limiting no webhook público.

### M8 — Testes ponta-a-ponta
- **Suite de testes-armadilha** (perguntas que tentam fazer a IA diagnosticar/inventar preço) → deve escalar, nunca chutar.
- Fluxo de agendamento completo simulado.
- Roda a cada mudança de prompt/base (anti-regressão).

---

## Sequência sugerida (sprints)

| Sprint | Foco | Entrega |
|--------|------|---------|
| S0 | Fase 0 (em paralelo ao build) | Meta/WABA iniciados, insumos coletados, contrato |
| S1 | M1 + M2 | Bot "eco" no WhatsApp respondendo via webhook |
| S2 | M3 + M4 | Atendimento real ancorado + escala humana |
| S3 | M5 | Agendamento + lembretes funcionando |
| S4 | M6 | Painel v1 operável pela clínica |
| S5 | M7 + M8 | Hardening LGPD + testes-armadilha → **DoD** |

> Verificação de negócio na Meta (Fase 0) roda em paralelo desde o S0 porque pode demorar.

---

## O que precisamos da clínica (checklist único)
- [ ] Acesso/criação do Meta Business Manager.
- [ ] Definição do número WhatsApp dedicado.
- [ ] Resposta sobre a agenda atual (D2).
- [ ] ~30 min do Lucas + materiais que já existem (tabela de preço/site/IG) — **sem formulário pra preencher**.
- [ ] Contrato + aviso de privacidade aprovados (§0.4).

---

## Métricas de sucesso (medir desde o go-live)
- % de conversas resolvidas pela IA sem humano (**meta ≥ 80%**) — KPI principal do modelo turnkey.
- Tempo médio de 1ª resposta.
- **Taxa de no-show** antes × depois dos lembretes.
- Nº de agendamentos feitos pela IA.
- 0 incidentes de alucinação/diagnóstico (auditoria de amostras).

---

## Próximo nível de detalhe (é só pedir)
- **Arquitetura técnica** → diagrama + esquema de banco + escolha fila/cron.
- **Copy/prompt do bot** → system prompt completo + guardrails + mensagens-padrão + testes-armadilha.
- **Design do painel** → wireframe das telas + identidade Trevocode.
- **Contrato/LGPD/cobrança** → minuta de operador + aviso de privacidade + faixas de preço.
