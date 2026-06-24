import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clínica Rotelli — Atendimento por IA no WhatsApp",
  description:
    "Clínica Rotelli · Odontologia e Harmonização Orofacial — atendimento e agendamento por IA no WhatsApp.",
  icons: { icon: "/rotelli-logo.jpg", apple: "/rotelli-logo.jpg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
