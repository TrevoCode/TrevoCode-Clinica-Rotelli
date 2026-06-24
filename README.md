# Clínica Rotelli — Plataforma (Trevocode)

Plataforma de captação e atendimento para a **Clínica Rotelli** (Odontologia · Harmonização Orofacial).
Bot de WhatsApp com IA que responde na hora, agenda e escala o que é delicado para a equipe — entregue pela **Trevocode**.

> ⚠️ Os preços, endereço e horários no app são **dados de demonstração**. Os reais entram após o fechamento.

## O que tem aqui

- **`demo/`** — app Next.js 15 + Tailwind v4 (a plataforma)
  - **CRM** com menu lateral: Painel · Atendimento · Agenda · Integrações
  - **Bot anti-alucinação** (nunca inventa, nunca diagnostica/prescreve) com roteamento por doutor:
    geral → Dr. Lucas (bot agenda) · implante/harmonização → Dr. Claudio (escala pro humano)
  - **Integração real com o Google Agenda** (service account) — agendamento do bot vira evento no calendário do doutor
  - **Deck de apresentação** de fechamento em `/proposta`
- **`apresentacao/`** — plano de Instagram (12 posts), tráfego pago (Meta) e o deck em markdown
- **`*.md`** (raiz) — planos, requisitos e base de conhecimento

## Rodar localmente

```bash
cd demo
cp .env.local.example .env.local   # preencha LLM_PROVIDER / LLM_MODEL / LLM_API_KEY
bun install
bun run dev                        # http://localhost:3000
```

## Integrações

- **Motor de IA** — provider-agnóstico (OpenRouter / Gemini / Groq / OpenAI / Anthropic) via env. Em produção: **Gemini** (`gemini-2.5-flash`).
- **Google Agenda** — conta de serviço; envs `GOOGLE_SA_KEY` (base64 do JSON), `GCAL_LUCAS`, `GCAL_CLAUDIO`. Cada doutor compartilha a agenda com o e-mail da conta de serviço. Setup: `demo/setup-google.sh`.
- **WhatsApp** — Cloud API oficial (Meta), conexão na Fase 0 (número dedicado).

## Deploy

Vercel — `demo/setup-vercel-bot.sh` (seta as envs do bot a partir do `.env.local` + redeploy).

---
Construído com IA, entregue com rigor. 🍀 **Trevocode**
