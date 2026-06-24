# Plano-Mestre — Automação Clínica Odontológica (Lucas)

> Entregue por **Trevocode Tecnologia**. Documento vivo — v0.1 (2026-06-21).
> Cliente: clínica de odontologia. Requisito explícito do cliente: **anti-alucinação** (a IA nunca inventa).

---

## 0. Princípios inegociáveis (guiam todo o resto)

1. **A IA nunca inventa.** Sem fonte na base → não responde → escala pra humano. RAG + fallback obrigatório.
2. **A IA não diagnostica.** "Dor no siso" não recebe diagnóstico do bot (é ato médico/odontológico, responsabilidade do CD). O bot **acolhe + dá orientação geral + agenda + escala**. Nunca prescreve, nunca afirma causa.
3. **Dado de saúde é dado sensível (LGPD art. 11).** Tratamento com base legal, minimização, retenção definida, e operador (nós) sob contrato.
4. **Humano no comando.** Botão de pausa em tudo (atendimento e Instagram). Nada externo (postar, confirmar agendamento) sem trilha de auditoria.
5. **Entregue com rigor** (lema Trevocode). Cada pilar passa por teste ponta-a-ponta antes do "pronto".
6. **Operação turnkey — a clínica NÃO opera nada.** Lucas e o dono não querem mexer com isso: o dentista só atende, o paciente só senta na cadeira. **Trevocode constrói e mantém** base de conhecimento, conteúdo e sistema (serviço gerenciado / done-for-you). Único toque da clínica: a recepção assume a conversa quando o bot escala (o que já fazem hoje). Sem formulários, sem aprovações, sem painel pra operar.
7. **Meta de automação: o bot resolve o máximo sozinho.** A clínica tem secretária mas quer resposta automática — então o bot resolve informação, FAQ e **agendamento completo (marca direto na agenda, sem a secretária confirmar cada um)**. O escalonamento à secretária é a **exceção segura** que honra o "nunca inventa" (não dá pra automatizar diagnóstico/preço sem fonte). Quanto mais rica a base, menor a fatia que escala.

---

## 1. Escopo & Pilares

### Pilar A — Atendimento IA no WhatsApp
- Responde dúvidas comuns (horário, endereço, convênios, preços de procedimento, "como funciona X").
- Triagem: entende a intenção (dúvida / quer agendar / urgência / reclamação) e roteia.
- Escala pra humano o que não resolve, **com handoff limpo** (resumo da conversa pro atendente).
- **Não diagnostica.** Orientação geral + convite pra avaliação presencial.

### Pilar B — Agendamento automático
- IA consulta horários livres do dentista, sugere o melhor, confirma e grava (nome, dia/hora, procedimento).
- Lembrete automático (24h e 2h antes) → reduz falta (no-show).
- Reagendar / cancelar pelo WhatsApp.
- Bloqueio de conflito (não marca dois no mesmo slot).

### Pilar C — Instagram automático
- Clínica sobe mídia(s) num painel → IA gera legenda (tom da marca) → agenda/posta no melhor horário.
- "Melhor horário" via histórico de desempenho (Insights).
- Limite diário configurável (ex.: 1 reels + 1 post/dia) + **botão de pausa**.
- Aprovação opcional: rascunho gerado → humano aprova com 1 toque → publica.

---

## 2. Funcionalidades por pilar (checklist de entrega)

### A — Atendimento
- [ ] Base de conhecimento curada (FAQ, procedimentos, preços, convênios, políticas, endereço/horário).
- [ ] RAG com citação interna da fonte (toda resposta ancorada na base).
- [ ] Guardrails: tópicos proibidos (diagnóstico, prescrição, valores não autorizados).
- [ ] Fallback "não sei" → escala com resumo.
- [ ] Detecção de urgência → resposta prioritária + alerta pro time.
- [ ] Handoff humano (assume/devolve a conversa) e histórico unificado.
- [ ] Horário comercial vs fora do horário (mensagem + fila).

### B — Agendamento
- [ ] Leitura de disponibilidade da agenda real da clínica.
- [ ] Sugestão de horário + confirmação em linguagem natural.
- [ ] Gravação do evento (nome, procedimento, contato).
- [ ] Lembretes automáticos (24h/2h) + confirmação de presença.
- [ ] Reagendamento e cancelamento.
- [ ] Anti-conflito / anti-overbooking.
- [ ] Painel: ver/editar agendamentos feitos pela IA.

### C — Instagram
- [ ] Painel de upload de mídia (imagem, carrossel, reels).
- [ ] Geração de legenda + hashtags no tom da clínica.
- [ ] Agendamento por melhor horário (baseado em Insights).
- [ ] Limite diário configurável + pausa global.
- [ ] Fila de aprovação (rascunho → aprova → publica).
- [ ] Métricas pós-publicação no painel.

### Transversal — Painel Admin (a clínica vê tudo num lugar)
- [ ] Login (papéis: dono/atendente).
- [ ] Conversas do WhatsApp + status (IA / humano / resolvido).
- [ ] Agenda + agendamentos da IA.
- [ ] Fila e histórico do Instagram.
- [ ] Editor da base de conhecimento (a clínica atualiza preços/FAQ sem nos chamar).
- [ ] Botões de pausa (atendimento IA / postagem) e logs de auditoria.

---

## 3. Workflows (fluxos críticos)

### 3.1 Atendimento (mensagem recebida)
```
Mensagem → classifica intenção
  ├─ Dúvida → RAG na base
  │     ├─ achou resposta confiável → responde (ancorada) 
  │     └─ não achou / baixa confiança → "vou te conectar com a equipe" → escala + resumo
  ├─ Quer agendar → entra no fluxo de Agendamento (3.2)
  ├─ Urgência (dor forte/trauma) → resposta acolhedora + alerta humano imediato
  └─ Reclamação/sensível → escala humano direto (não deixa IA improvisar)
```

### 3.2 Agendamento
```
Intenção "agendar" → coleta {procedimento, preferência de dia/turno}
  → consulta disponibilidade real
  → propõe 2-3 horários → cliente escolhe
  → confirma dados → grava evento (lock anti-conflito)
  → dispara confirmação + agenda lembretes (24h/2h)
  → registra no painel
```

### 3.3 Lembrete / no-show
```
Cron 24h antes → "confirma sua consulta? (1 sim / 2 reagendar)"
  ├─ sim → marca confirmado
  ├─ reagendar → volta a 3.2
  └─ sem resposta → 2h antes reenvia → se nada, marca "não confirmado" e avisa recepção
```

### 3.4 Instagram
```
Clínica sobe mídia no painel → IA gera legenda+hashtags
  → (modo aprovação? sim → fila humana → aprova) 
  → agenda no melhor horário (respeitando limite diário + pausa)
  → publica via API → coleta métricas → alimenta histórico de "melhor horário"
```

### 3.5 Escalonamento humano (handoff)
```
Gatilho (não sei / urgência / reclamação / cliente pediu humano)
  → marca conversa como "humano"
  → IA para de responder aquela conversa
  → notifica atendente (painel + push) com resumo
  → atendente assume; ao resolver, pode devolver pra IA
```

---

## 4. Arquitetura & Stack (recomendação)

**Frontend (painel):** Next.js + Tailwind (padrão Trevocode). Hospedagem Vercel.
**Backend/API:** Next.js API routes ou serviço Node dedicado; fila para jobs assíncronos (lembretes, postagens).
**Banco:** Postgres (Supabase ou Neon) — conversas, agendamentos, base de conhecimento, logs, métricas IG.
**Vetor (RAG):** pgvector no mesmo Postgres (simples) ou índice dedicado.
**LLM:** Claude (família 4.x) via API — bom seguimento de instrução e baixa alucinação com RAG bem montado.
**Agendador/cron:** jobs para lembretes e postagens (Vercel Cron / fila + worker).
**WhatsApp:** ver §6 (decisão).
**Calendar/Agenda:** ver §6 (depende do que a clínica usa hoje).
**Instagram:** Instagram Graph API (Content Publishing) — exige conta Business + Página FB + app review.

```
WhatsApp  ─┐
            ├─► Webhook ─► Orquestrador (intenção→RAG→guardrails) ─► Claude API
Painel ────┘                     │
                                 ├─► Postgres (+pgvector)
                                 ├─► Agenda (Calendar/PMS)
                                 └─► Fila ─► Workers (lembretes, IG posting)
```

---

## 5. Segurança & Compliance (crítico — saúde + LGPD)

### 5.1 LGPD (dado sensível de saúde)
- **Base legal** definida (consentimento e/ou tutela da saúde) — registrar no contrato e no fluxo.
- **Minimização:** só coletar o necessário (nome, contato, procedimento). Nada de histórico clínico no chat.
- **Retenção:** prazo definido para apagar conversas/dados; rotina de expurgo.
- **Operador vs Controlador:** a clínica é Controladora; Trevocode é Operadora → **contrato de tratamento de dados** + cláusula de confidencialidade.
- **Direitos do titular:** mecanismo para acesso/exclusão a pedido do paciente.
- **Aviso de privacidade** no primeiro contato do WhatsApp (transparência + que está falando com IA).

### 5.2 Segurança técnica
- Segredos (tokens WhatsApp/IG/LLM) em cofre de variáveis, nunca no código.
- Criptografia em trânsito (TLS) e em repouso (banco).
- Validação de webhook (assinatura Meta) — rejeitar payload não assinado.
- Princípio do menor privilégio nos tokens (escopos mínimos do Graph API).
- RBAC no painel (dono ≠ atendente).
- **Logs de auditoria** (quem mudou base, quem assumiu conversa, o que a IA postou/agendou).
- Rate limiting + proteção contra abuso no webhook público.
- Backups do banco.

### 5.3 Segurança da IA (anti-alucinação como engenharia, não promessa)
- RAG com *grounding* obrigatório: sem trecho relevante recuperado → não responde.
- System prompt com **escopo fechado** + lista de proibições (diagnóstico, prescrição, preço fora da base).
- Validação de saída: detectar promessa de preço/horário não confirmado e bloquear.
- "Confiança baixa → escala" em vez de chutar.
- Conjunto de testes de regressão (perguntas-armadilha) rodado a cada mudança de prompt/base.

---

## 6. Decisões em aberto (precisam de definição) ⚠️

| # | Decisão | Recomendação Trevocode | Por quê |
|---|---------|------------------------|---------|
| D1 | **WhatsApp: Cloud API oficial vs gateway** | ✅ **TRAVADO: Cloud API oficial.** Obs: clínica **ainda não tem número** → provisionar número dedicado na Fase 0 | Saúde + compliance: número não cai/bane; templates aprovados; trilha legal. |
| D2 | **Agenda atual da clínica** | ⏳ **Descoberta na Fase 0.** Padrão provisório = Google Calendar; agendamento desenhado **agnóstico** (adapter) pra não travar | Define a complexidade do Pilar B; resolvemos sem bloquear o build. |
| D3 | **MVP faseado** | ✅ **TRAVADO: Fase 1 = Atendimento + Agendamento.** Instagram = Fase 2 | Gera valor/receita rápido; IG depende de app review da Meta. |
| D4 | **Instagram (Fase 2): quem aprova o post** | **Trevocode cura/aprova (managed)** — clínica não aprova nada | Cliente quer hands-off; a revisão fica com a gente, não com a clínica. |
| D5 | **Cobrança** | **Setup (one-time) + mensalidade** (inclui hospedagem, manutenção, custo de API repassado/embutido) | Modelo recorrente sustenta manutenção e dá previsibilidade. Definir faixas. |
| D6 | **Quem mantém a base de conhecimento** | ✅ **Trevocode mantém (managed).** Clínica avisa mudança por mensagem; a gente atualiza | Cliente não quer operar nada (turnkey). |
| D7 | **Quem atende quando o bot escala** | ✅ **Secretária atual da clínica** — mas escalonamento é exceção. Bot resolve o máximo sozinho (info + FAQ + agendamento completo); secretária só pega urgência/reclamação/fora de escopo | Clínica tem secretária e quer resposta automática. Sem camada humana Trevocode. |

---

## 7. Roadmap por fases

**Fase 0 — Descoberta & contrato (1 sem)**
Fechar D1–D6, mapear FAQ/procedimentos/preços/convênios, contrato + LGPD, acessos (WhatsApp Business, conta Meta, agenda).

**Fase 1 — Atendimento + Agendamento (MVP)**
Base de conhecimento + RAG + guardrails; WhatsApp conectado; agendamento + lembretes; painel v1 (conversas, agenda, base). Teste ponta-a-ponta com casos reais.

**Fase 2 — Instagram automático**
App review Meta; painel de mídia; geração de legenda; agendamento por melhor horário; aprovação humana → automático.

**Fase 3 — Refino & escala**
Métricas (no-show ↓, tempo de resposta ↓), relatórios pro dono, otimização de custo de API, hardening de segurança. Possível template reusável p/ outras clínicas (ativo Trevocode).

---

## 8. Riscos & mitigação

| Risco | Mitigação |
|-------|-----------|
| IA dar info médica errada | Escopo fechado + proibição de diagnóstico + escala; testes-armadilha |
| Ban do número WhatsApp | API oficial; respeitar políticas; opt-in |
| Vazamento de dado sensível | LGPD by design, criptografia, RBAC, retenção curta, auditoria |
| App review Meta atrasar IG | Iniciar cedo (Fase 0); não bloquear Fases 1 |
| Clínica não manter base atualizada | Editor simples no painel + lembrete de revisão |
| Custo de API estourar | Cache, modelo certo por tarefa, teto de uso, repasse no preço |

---

## 9. Próximos passos imediatos
1. Confirmar D1–D6 (principalmente **D2 — qual agenda a clínica usa hoje**).
2. Coletar material da base (FAQ, tabela de procedimentos/preços, convênios, horários).
3. Garantir acessos: WhatsApp Business, conta Meta/Business Manager, agenda.
4. Eu detalho a parte que você escolher (arquitetura técnica, design do painel, copy do bot, ou contrato/LGPD).
