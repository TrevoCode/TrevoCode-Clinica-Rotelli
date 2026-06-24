# Demo de Fechamento — "os 30%" pra apresentar ao chefe do Lucas

> Trevocode × Clínica do Lucas. v0.1 (2026-06-21). Objetivo: **provar o cérebro** numa reunião de fechamento, não entregar produção.

## Objetivo
Demo navegável que faz o chefe do Lucas **ver o bot funcionando**: responde certo (sem inventar), agenda sozinho, escala quando deve. É a fatia que vende.

## Construímos de verdade (cérebro real)
1. **Chat estilo WhatsApp** (web) — o avaliador digita como paciente, bot responde ao vivo.
2. **Bot real** — Claude + base de conhecimento + guardrails + saída estruturada (spec `BOT-PROMPT.md`).
3. **Agendamento** — marca em agenda de demo, confirma, anti-conflito.
4. **Escalonamento** — diagnóstico/sem-fonte → escala e sinaliza no painel.
5. **Mini painel** (visão secretária) — conversas + agendamentos + escalonamentos.

## Simulamos / adiamos (os outros 70%, pós-fechamento)
- Número real WhatsApp Cloud API + verificação Meta (semanas).
- Integração com a agenda real da clínica (adapter — depende do D2).
- RAG vetorial em escala (no demo: base curada injetada direto).
- Lembretes/cron, LGPD hardening, auth robusta, Instagram (Fase 2).

## Stack
Next.js + Tailwind (padrão Trevocode), Claude API, dados de demo em JSON. Deploy Vercel pra mandar um link clicável pro Lucas.

## Mapa pros módulos da Fase 1
- M3 (RAG) → simplificado: base curada injetada no contexto.
- M4 (orquestrador) → **completo** (é o que vende).
- M5 (agendamento) → simplificado: agenda em JSON/memória.
- M6 (painel) → mínimo (visão secretária).
- M1/M2/M7/M8 → adiados (infra prod, WhatsApp real, segurança, suite completa).

## Roteiro da demo (o que mostrar na reunião)
1. "Qual o horário de vocês?" → responde da base.
2. "Quanto custa limpeza?" → responde preço da base (com ressalva).
3. "Tô com dor no siso, o que é?" → **não diagnostica**, acolhe, oferece agendar.
4. "Quero marcar uma limpeza terça de manhã" → **agenda sozinho**, confirma.
5. "Vocês atendem o convênio X?" (fora da base) → **escala** (não inventa).
6. Abre o **painel** → mostra a conversa, o agendamento criado e o escalonamento.

## Dependência pra rodar ao vivo
- **ANTHROPIC_API_KEY** (conta Claude API) — sem ela o bot não responde ao vivo.
- Dados: começa com **clínica-demo realista** (swappável); se o Lucas passar dados reais, fica muito mais forte (o chefe vê a própria clínica).
