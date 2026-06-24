# CLAUDE.md — Instruções pro Claude neste projeto

Este arquivo é lido automaticamente pelo Claude Code ao abrir este repositório.
Se você é o Claude trabalhando aqui: leia tudo antes de mexer no código. As regras de
colaboração (seção 3) são **obrigatórias** — este projeto é codado por dois devs ao mesmo tempo.

---

## 1. O que é o projeto

Plataforma de captação e atendimento para a **Clínica Rotelli** (odontologia + harmonização
orofacial), entregue pela **Trevocode**. O núcleo é um **bot de WhatsApp com IA** que responde
na hora, agenda no Google Agenda e escala pra equipe o que é delicado.

- App em **`demo/`** — Next.js 15 + React 19 + Tailwind v4, gerenciado com **bun**.
- CRM com menu lateral: Painel · Atendimento · Agenda · Integrações.
- Bot **anti-alucinação**: nunca inventa, nunca diagnostica nem prescreve. Roteia por doutor
  (geral → Dr. Lucas, o bot agenda; implante/harmonização → Dr. Claudio, escala pro humano).
- Integrações: IA provider-agnóstica (prod = Gemini), **Google Agenda** (service account),
  **WhatsApp Cloud API** (Meta).
- Deck de fechamento em `/proposta`. Planos e requisitos nos `*.md` da raiz.

> Preços, endereço e horários no app são **dados de demonstração** até o cliente fechar.

## 2. Como rodar

```bash
cd demo
cp .env.local.example .env.local   # preencha LLM_PROVIDER / LLM_MODEL / LLM_API_KEY
bun install
bun run dev                        # http://localhost:3000
```

Integrações extras: `demo/setup-google.sh` (Google Agenda) e `demo/setup-vercel-bot.sh` (envs na Vercel).

---

## 3. REGRAS DE COLABORAÇÃO (obrigatório)

Este repo (`TrevoCode/TrevoCode-Clinica-Rotelli`) é codado por **dois devs**: Fabricio e Yuri,
ambos Owners da org GitHub **TrevoCode**. Trabalhamos **sem divisão fixa** de arquivos, então a
disciplina abaixo é o que evita um atrapalhar o outro. O plano é Free → **não há trava técnica**
na `main`; a regra vale no combinado e **você (Claude) deve respeitá-la**.

### Regra de ouro
**NUNCA faça `git push` direto na `main`.** Todo trabalho vai pra uma branch e entra via Pull Request.

### O ciclo de cada tarefa
```bash
git checkout main && git pull          # 1. sincroniza antes de começar
git checkout -b feat/nome-da-tarefa    # 2. branch (feat/ = feature, fix/ = correção)
# ... codar ...
git add -A && git commit -m "msg"      # 3. commits pequenos e frequentes
git push -u origin feat/nome-da-tarefa # 4. envia
gh pr create --fill --base main        # 5. abre o PR (o outro dev revisa e mergeia)
```
Depois do merge, a branch é **apagada automaticamente** no GitHub (`delete_branch_on_merge` ligado).
Pra recomeçar: `git checkout main && git pull`.

### Atalhos já instalados (use se existirem na máquina)
- `git nova feat/x` → sincroniza main + cria a branch
- `git salva "msg"` → add + commit
- `git envia` → push + abre o PR (precisa do `gh` logado)
- `git sincroniza` → traz pra branch atual o que já entrou na main
- `git atualiza` → volta pra main + pull

Se os atalhos não existirem nesta máquina, instale com o bloco em `CONTRIBUTING.md`.

### Evitar conflito (trabalhamos sem divisão fixa)
- **Sincronize com frequência.** Se a branch está demorando e o outro já mergeou, rode `git sincroniza`
  (ou `git merge origin/main`) pra resolver conflitos cedo, em pedaços pequenos.
- **Branches curtas** (1–2 dias) e **PRs pequenos** — mergeiam rápido e divergem menos.
- **Uma tarefa = um dono.** Confirme no chat/Projects que ninguém está no mesmo arquivo antes de começar.
- Antes de tocar em arquivo "quente" (rota central, layout, config, tipos compartilhados), avise o outro dev.

## 4. Segurança — segredos NUNCA no Git

- `.env`, `.env.local`, `*.key`, `*.pem`, service accounts já estão no `.gitignore`. **Não force.**
- O único arquivo de ambiente versionado é `demo/.env.local.example`, e ele só tem **placeholders**.
- Chave nova → vai no `.env.local` local **e** nas Environment Variables da **Vercel**. Nunca no código.
- Se uma chave vazar por engano: avise o time, **rotacione** (gere outra) e remova do histórico —
  apenas trocar o arquivo não resolve.

## 5. Convenções de código

- Stack: Next.js 15 (App Router) + React 19 + Tailwind v4, **bun** como package manager (use `bun`, não `npm`).
- TypeScript. Siga o estilo dos arquivos vizinhos (nomes, densidade de comentários, idioma).
- O bot é anti-alucinação por design: ao mexer no fluxo de IA, **preserve** as travas de "nunca
  diagnostica/prescreve/inventa" e o roteamento por doutor. Não derrube isso em refactor.
- Antes de declarar pronto: rode `bun run build` no `demo/` e confira que passa.

---

Construído com IA, entregue com rigor. 🍀 **Trevocode**
