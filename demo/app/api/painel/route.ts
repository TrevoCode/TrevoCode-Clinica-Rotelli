import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const conversas = Array.from(store.conversas.values());
  const totalConversas = conversas.length;
  const comHumano = conversas.filter((c) => c.status === "humano").length;
  const resolvidasIA = totalConversas - comHumano;
  const pctIA = totalConversas ? Math.round((resolvidasIA / totalConversas) * 100) : 0;

  return NextResponse.json({
    kpis: {
      conversas: totalConversas,
      pctResolvidasIA: pctIA,
      agendamentos: store.bookings.length,
      escalonamentos: store.escalas.length,
      slotsLivres: store.agenda.filter((s) => s.status === "livre").length,
    },
    bookings: [...store.bookings].reverse(),
    escalas: [...store.escalas].reverse(),
    conversas: conversas.map((c) => ({
      id: c.id,
      status: c.status,
      ultima: c.mensagens[c.mensagens.length - 1]?.texto ?? "",
      qtd: c.mensagens.length,
    })),
  });
}
