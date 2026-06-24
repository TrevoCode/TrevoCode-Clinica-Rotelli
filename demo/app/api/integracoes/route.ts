import { NextRequest, NextResponse } from "next/server";
import { DOUTORES } from "@/lib/store";
import { contaServicoEmail, googleConfigurado, testarGoogle } from "@/lib/google";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Status das integrações (real, lido do ambiente).
export async function GET() {
  return NextResponse.json({
    google: {
      saEmail: contaServicoEmail(),
      doutores: DOUTORES.map((d) => ({
        id: d.id,
        nome: d.nome,
        especialidade: d.especialidade,
        configurado: googleConfigurado(d.id),
      })),
    },
    whatsapp: { conectado: false }, // real só na Fase 0 (número + Meta)
  });
}

// Testa a conexão com a agenda de um doutor.
export async function POST(req: NextRequest) {
  const { doutor } = (await req.json()) as { doutor?: string };
  if (!doutor) return NextResponse.json({ ok: false, erro: "doutor é obrigatório" }, { status: 400 });
  const r = await testarGoogle(doutor);
  return NextResponse.json(r);
}
