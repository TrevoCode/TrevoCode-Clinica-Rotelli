#!/bin/bash
# Liga a integração REAL do Google Agenda na Vercel + redeploy.
# Uso:
#   bash setup-google.sh <caminho-do-json-da-conta-de-servico> <email-agenda-Lucas> <email-agenda-Claudio>
# Ex:
#   ! bash /Users/nobre/trevocode-clinica-lucas/demo/setup-google.sh ~/Downloads/sa.json dr.lucas@gmail.com dr.claudio@gmail.com
set -e
KEY_FILE="$1"; LUCAS="$2"; CLAUDIO="$3"
export PATH="$HOME/.bun/bin:$PATH"
DIR=/Users/nobre/trevocode-clinica-lucas/demo

if [ -z "$KEY_FILE" ] || [ ! -f "$KEY_FILE" ]; then
  echo "✗ Passe o caminho do JSON da conta de serviço. Ex: bash setup-google.sh ~/Downloads/sa.json lucas@gmail.com claudio@gmail.com"
  exit 1
fi

SA_EMAIL=$(grep -o '"client_email"[^,]*' "$KEY_FILE" | head -1 | sed 's/.*: *"//; s/".*//')
B64=$(base64 -i "$KEY_FILE" | tr -d '\n')

setvar() {
  vercel env rm "$1" production -y --cwd "$DIR" >/dev/null 2>&1 || true
  printf '%s' "$2" | vercel env add "$1" production --cwd "$DIR"
}

echo "→ GOOGLE_SA_KEY";  setvar GOOGLE_SA_KEY "$B64"
echo "→ GCAL_LUCAS";     setvar GCAL_LUCAS "$LUCAS"
echo "→ GCAL_CLAUDIO";   setvar GCAL_CLAUDIO "$CLAUDIO"

echo "→ Redeploy de produção..."
vercel deploy --prod --yes --cwd "$DIR"

echo ""
echo "✅ Variáveis setadas e deploy feito."
echo "⚠️  IMPORTANTE: cada doutor precisa COMPARTILHAR a agenda Google dele com:"
echo "      $SA_EMAIL"
echo "    (permissão: 'Fazer alterações nos eventos')."
echo "    Depois teste em https://trevocode-rotelli.vercel.app/integracoes"
