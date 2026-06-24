import { NextRequest, NextResponse } from "next/server";
import { gridAgenda, toggleSlot } from "@/lib/agenda";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(gridAgenda());
}

export async function POST(req: NextRequest) {
  const { doutor, data, hora } = (await req.json()) as { doutor: string; data: string; hora: string };
  if (!doutor || !data || !hora) {
    return NextResponse.json({ erro: "doutor, data e hora são obrigatórios" }, { status: 400 });
  }
  const status = toggleSlot(doutor, data, hora);
  return NextResponse.json({ ok: true, status });
}
