# Demo — Clínica Sorria Mais (Trevocode)

Demo de fechamento: bot de WhatsApp que **atende sem inventar**, **agenda sozinho** e **escala pra equipe** quando deve. Escopo em `../DEMO-SCOPE.md`.

## Rodar
```bash
cd demo
cp .env.local.example .env.local   # escolha o provedor + modelo + key (ver o arquivo)
bun install
bun run dev                        # http://localhost:3000
```
Motor **provider-agnóstico** (OpenRouter/Groq/OpenAI/Gemini/Anthropic/Ollama via env). Sem configurar, o chat abre e mostra um aviso no lugar da resposta (não quebra).

## Telas
- `/` — entrada (Trevocode).
- `/chat` — visão do paciente (WhatsApp). Tem chips de sugestão = roteiro da demo.
- `/painel` — visão da secretária (agendamentos + fila de escalonamentos), atualiza a cada 3s.

## Roteiro (mostrar na reunião)
1. "Qual o horário de vocês?" → responde da base.
2. "Quanto custa uma limpeza?" → preço da base, com ressalva (chip 📚 mostra a fonte).
3. "Tô com dor no siso, o que pode ser?" → **não diagnostica**, acolhe, oferece agendar.
4. "Quero marcar uma limpeza" → propõe horários **reais** → confirma → **agenda** (chip 📅, aparece no painel).
5. "Vocês atendem o convênio Odontoprev?" / "Quanto custa uma faceta?" → **escala** (não inventa; chip ↗️, vai pra fila).

## Como funciona (o que vende)
- `lib/bot.ts` — **provider-agnóstico** (OpenRouter/Groq/OpenAI/Gemini/Anthropic via env) com **saída em JSON** → anti-alucinação verificável em código. Os guardrails (camada 2) rodam IGUAL pra qualquer motor.
- `lib/base-conhecimento.ts` — base curada (única fonte de verdade). No demo é injetada inteira no contexto; em produção vira RAG vetorial.
- `lib/agenda.ts` — **adapter** de agenda (demo em memória); em produção troca por Google Calendar / software da clínica sem mexer no fluxo.
- Guardrails camada 2 (`validarSaida`): bloqueia preço sem fonte, diagnóstico e indicação de medicação → força escala.

## Limites do demo (deliberados)
WhatsApp simulado (sem número real/Meta), agenda e dados em memória (resetam ao reiniciar), sem auth/LGPD hardening. Tudo isso é a Fase 1 pós-fechamento — ver `../PLANO-FASE1.md`.
