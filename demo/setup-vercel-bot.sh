#!/bin/bash
# Liga o bot (Gemini) no link público da Vercel: seta as env vars de produção + redeploy.
# Lê os valores do .env.local (NÃO versionado) — nenhuma chave fica no script.
# Uso:  ! bash /Users/nobre/trevocode-clinica-lucas/demo/setup-vercel-bot.sh
set -e
export PATH="$HOME/.bun/bin:$PATH"
DIR=/Users/nobre/trevocode-clinica-lucas/demo
ENV_FILE="$DIR/.env.local"

if [ ! -f "$ENV_FILE" ]; then
  echo "✗ Falta $ENV_FILE (com LLM_PROVIDER / LLM_MODEL / LLM_API_KEY). Veja .env.local.example."
  exit 1
fi
get() { grep -E "^$1=" "$ENV_FILE" | head -1 | cut -d= -f2-; }
PROVIDER=$(get LLM_PROVIDER); MODEL=$(get LLM_MODEL); KEY=$(get LLM_API_KEY)

setvar() {
  vercel env rm "$1" production -y --cwd "$DIR" >/dev/null 2>&1 || true
  printf '%s' "$2" | vercel env add "$1" production --cwd "$DIR"
}

echo "→ 1/4 LLM_PROVIDER"; setvar LLM_PROVIDER "$PROVIDER"
echo "→ 2/4 LLM_MODEL";    setvar LLM_MODEL "$MODEL"
echo "→ 3/4 LLM_API_KEY";  setvar LLM_API_KEY "$KEY"

echo "→ 4/4 Redeploy de produção (pega as novas variáveis)..."
vercel deploy --prod --yes --cwd "$DIR"

echo ""
echo "✅ Pronto. Teste: https://trevocode-rotelli.vercel.app/chat"
