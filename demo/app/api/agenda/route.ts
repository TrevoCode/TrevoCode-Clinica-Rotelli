import { NextRequest, NextResponse } from "next/server";
import { gradeDoutor } from "@/lib/agenda";
import { DOUTORES, HORAS_CANDIDATAS, hojeISO, rotuloData } from "@/lib/store";
import { criarEvento, deletarEvento } from "@/lib/google";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Grade de UM dia (?dia=YYYY-MM-DD; default = hoje), por doutor (cada um na sua agenda Google).
export async function GET(req: NextRequest) {
  const dia = req.nextUrl.searchParams.get("dia") || hojeISO();
  const grades = await Promise.all(DOUTORES.map(async (d) => ({ id: d.id, ...(await gradeDoutor(d.id, dia)) })));
  return NextResponse.json({
    doutores: DOUTORES,
    dia: { data: dia, rotulo: rotuloData(dia) },
    hoje: hojeISO(),
    horas: HORAS_CANDIDATAS,
    slots: grades.flatMap((g) => g.slots),
    eventos: grades.flatMap((g) => g.eventos.map((e) => ({ ...e, doutor: g.id }))),
    sincronizado: grades.some((g) => g.sincronizado),
  });
}

// Cria um agendamento/bloqueio na agenda do doutor.
export async function POST(req: NextRequest) {
  const b = (await req.json()) as {
    doutor?: string;
    summary?: string;
    descricao?: string;
    data?: string;
    hora?: string;
    fim?: string;
  };
  if (!b.doutor || !b.summary || !b.data || !b.hora || !b.fim) {
    return NextResponse.json({ ok: false, erro: "campos obrigatórios faltando" }, { status: 400 });
  }
  const id = await criarEvento(b.doutor, {
    summary: b.summary,
    descricao: b.descricao,
    data: b.data,
    hora: b.hora,
    fim: b.fim,
  });
  return NextResponse.json({ ok: !!id, id });
}

// Remove um agendamento da agenda do doutor.
export async function DELETE(req: NextRequest) {
  const b = (await req.json()) as { doutor?: string; id?: string };
  if (!b.doutor || !b.id) {
    return NextResponse.json({ ok: false, erro: "doutor e id são obrigatórios" }, { status: 400 });
  }
  const ok = await deletarEvento(b.doutor, b.id);
  return NextResponse.json({ ok });
}
