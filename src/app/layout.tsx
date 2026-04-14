import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RoboPulse | Automação Inteligente para WhatsApp",
  description:
    "Plataforma SaaS de atendimento automatizado via WhatsApp com Inteligência Artificial. Gestão de perfis, base de conhecimento e agendamento integrado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" className="dark">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
