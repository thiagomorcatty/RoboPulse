import Link from "next/link";
import Image from "next/image";
import {
  MessageSquare,
  Bot,
  Calendar,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-surface-800/50 backdrop-blur-md bg-surface-950/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
              <Image
                src="/logo.png"
                alt="RoboPulse"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-surface-100">Robo</span>
              <span className="text-brand-600">Pulse</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-brand-600/20 active:scale-95"
            >
              Entrar no Painel
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center max-w-4xl mx-auto animate-[fade-in_0.5s_ease-out]">
          {/* Logo central com sombra suave */}
          <div className="w-32 h-32 mx-auto mb-10 rounded-3xl overflow-hidden shadow-2xl shadow-brand-600/20 ring-4 ring-white">
            <Image
              src="/logo.png"
              alt="RoboPulse Logo"
              width={128}
              height={128}
              className="object-cover"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 border border-brand-200 text-brand-700 text-sm font-bold mb-8 uppercase tracking-wider">
            <Zap className="w-4 h-4 fill-brand-600 text-brand-600" />
            Inteligência Artificial para Negócios
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-surface-100 leading-[1.1] tracking-tight">
            Atendimento WhatsApp
            <span className="block bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              Integrado e Automático
            </span>
          </h1>

          <p className="mt-8 text-xl text-surface-400 leading-relaxed max-w-2xl mx-auto font-medium">
            Automatize o atendimento da sua empresa com IA. 
            Treine o seu robô com documentos reais e agende reuniões 
            diretamente no seu calendário.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/login"
              className="group flex items-center gap-2 px-10 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-xl shadow-brand-600/30 hover:-translate-y-1"
            >
              Começar
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-800/50 py-10 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="RoboPulse"
              width={24}
              height={24}
              className="rounded-lg shadow-sm"
            />
            <span className="font-bold text-surface-200">RoboPulse © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-8 text-sm font-semibold text-surface-500">
            <Link href="#" className="hover:text-brand-600 transition-colors">Privacidade</Link>
            <Link href="#" className="hover:text-brand-600 transition-colors">Termos de Uso</Link>
            <Link href="#" className="hover:text-brand-600 transition-colors">Suporte</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
