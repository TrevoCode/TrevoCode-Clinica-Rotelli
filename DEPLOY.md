# Deploy — Clínica Rotelli (demo)

Como rodar localmente e publicar na Vercel. O app Next.js fica em **`demo/`** (não na raiz do repo).
Motor de IA da demo: **OpenRouter + Gemini Flash**.

---

## Variáveis de ambiente

O bot lê três variáveis (server-side — **nunca** use prefixo `NEXT_PUBLIC_`, senão a chave vaza pro navegador):

| Name | Value |
|------|-------|
| `LLM_PROVIDER` | `openrouter` |
| `LLM_MODEL` | `google/gemini-2.0-flash-001` |
| `LLM_API_KEY` | `sk-or-...` (gere em https://openrouter.ai) |

Sem a chave o app funciona, mas o chat mostra um aviso em vez de responder. Todas as outras telas
(Instagram, proposta, painel, agenda) funcionam sem chave.

---

## 1. Testar localmente (antes de publicar)

```bash
cd demo
cp .env.local.example .env.local     # edite e cole a LLM_API_KEY
bun install && bun run dev           # ou: npm install && npm run dev
# abre http://localhost:3000
```

Roteiro de teste em `/atendimento`:
- "Quanto custa uma limpeza?" → responde o preço da base
- "Tô com dor no siso" → acolhe, **não diagnostica**, oferece agendar
- "Quero marcar uma limpeza terça de manhã" → **agenda** com o Dr. Lucas
- "Quero um implante" → **escala** pro Dr. Claudio (humano)
- "Atende convênio X?" (fora da base) → **escala**, não inventa
- Abre `/painel` → vê a conversa, o agendamento e o escalonamento aparecerem

`.env.local` **nunca** vai pro Git (está no `.gitignore`). A chave fica só na máquina.

---

## 2. Publicar na Vercel (pelo site — recomendado)

1. **vercel.com → Add New… → Project** → importa `TrevoCode/TrevoCode-Clinica-Rotelli`.
   - Se a org não aparecer: **Adjust GitHub App Permissions** e autoriza a Vercel na TrevoCode.
2. **Framework:** detecta Next.js sozinho (usa `bun` pelo `bun.lock`). Não mexer no build.
3. **⚠️ Root Directory = `demo`** (Edit → seleciona `demo`). Sem isso o deploy quebra
   ("no Next.js app found") — o app não está na raiz.
4. **Environment Variables:** adiciona as três da tabela acima (marca **Production**, e **Preview**
   se quiser que os previews dos PRs respondam).
5. **Deploy.** Em ~1-2 min sai a URL. Testa `/atendimento`; se a Sofia responder, está pronto.
   - Se aparecer "Demo sem motor de IA": a env var não pegou → confere o passo 4 e **Redeploy**.
6. Manda a URL pro cliente (sugestão: a raiz `/` ou direto `/proposta`).

Depois disso a Vercel fica ligada no repo: **todo PR vira um Preview Deploy** com URL própria.

### Alternativa: pela CLI

O repo tem `demo/setup-vercel-bot.sh`. Dois cuidados:
- Use **`printf`** (não `echo`) ao setar env var: `printf "sk-or-..." | vercel env add LLM_API_KEY production`
  (o `echo` adiciona `\n` na chave e dá erro de auth).
- O **Root Directory `demo`** continua valendo (configure no `vercel link` ou rode de dentro de `demo/`).

---

## Troubleshooting

| Sintoma | Causa | Solução |
|---------|-------|---------|
| "Demo sem motor de IA configurado" | `.env.local`/env var não lida | Confere que está em `demo/` e **reinicia** o dev (env só carrega no boot) |
| "Chave inválida (401)" | Chave errada/incompleta | Recopia a `sk-or-...` inteira, sem espaço/quebra |
| `command not found: bun` | Sem bun | Usa `npm install && npm run dev` |
| Porta 3000 ocupada | Outro app rodando | `npm run dev -- -p 3100`, ou libera a porta: `lsof -ti:3000 \| xargs kill` |
| Deploy Vercel "no Next.js app found" | Root Directory errado | Seta **Root Directory = `demo`** nas settings do projeto |
