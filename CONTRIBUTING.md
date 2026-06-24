# Como trabalhamos juntos — Trevocode

Guia de fluxo pra dois (ou mais) devs codarem o mesmo projeto sem um atrapalhar o outro.
Regra de ouro: **ninguém faz `push` direto na `main`. Tudo passa por branch + Pull Request.**

---

## 1. Preparar a máquina (uma vez só)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email-do-github@exemplo.com"   # o mesmo cadastrado no GitHub

git clone https://github.com/TrevoCode/TrevoCode-Clinica-Rotelli.git
cd TrevoCode-Clinica-Rotelli
```

Rodar o app local:

```bash
cd demo
cp .env.local.example .env.local   # preencha LLM_API_KEY etc. — NUNCA commite este arquivo
bun install
bun run dev                        # http://localhost:3000
```

---

## 2. O ciclo de cada tarefa

```bash
# 1. Sincroniza a main antes de começar
git checkout main && git pull

# 2. Cria a branch da tarefa
git checkout -b feat/nome-da-tarefa     # feat/ = nova feature, fix/ = correção

# 3. Codar e ir salvando (commits pequenos e frequentes)
git add .
git commit -m "descreve o que fez"

# 4. Enviar pro GitHub
git push -u origin feat/nome-da-tarefa  # nas próximas vezes nessa branch: só `git push`
```

Depois: abrir o **Pull Request** no GitHub, marcar o sócio como **Reviewer**, ele aprova e clica em **Merge**.

Limpeza depois do merge:

```bash
git checkout main && git pull
git branch -d feat/nome-da-tarefa
```

---

## 3. Evitar conflito (trabalhamos sem divisão fixa de arquivos)

- **Sincronize todo dia.** Se sua branch está demorando e o outro já mergeou coisas, traga a main pra dentro da sua branch:
  ```bash
  git checkout feat/nome-da-tarefa
  git merge main
  ```
  Conflito aqui é normal: o Git marca os arquivos, você escolhe o que fica, depois `git add .` e `git commit`.
- **Branches curtas** (1–2 dias) e **PRs pequenos** — fáceis de revisar, mergeiam rápido, divergem menos.
- **Uma tarefa = um dono.** Antes de começar, faça *assign* em você na aba **Projects/Issues** pra ninguém pegar a mesma coisa.
- **Arquivo "quente"** (rota central, layout, config, tipos compartilhados): avise no chat antes de mexer.

---

## 4. Segredos — nunca no Git

- `.env`, `.env.local`, `*.key`, `*.pem`, service accounts: já bloqueados no `.gitignore`. **Não force.**
- Chave nova → adiciona no seu `.env.local` **e** nas env vars da **Vercel** (Settings → Environment Variables).
- O que vai pro repo é só o `demo/.env.local.example` com placeholders.
- Vazou uma chave por engano? Avise o time, **rotacione a chave** (gere outra) e remova do histórico — trocar o arquivo não basta.

---

## 5. Deploy

A Vercel está ligada neste repo: **cada Pull Request ganha uma URL de Preview automática** — teste a branch ali antes de mergear. O merge na `main` publica em produção.

---

Construído com IA, entregue com rigor. 🍀 **Trevocode**
