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
    <div className="h-[100dvh] bg-surface-950 flex flex-col font-sans overflow-hidden py-2 md:py-0">

      {/* Hero (Centralizado) */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 pt-10 pb-4 w-full">
        <div className="text-center max-w-4xl mx-auto animate-[fade-in_0.5s_ease-out] w-full">
          {/* Logo */}
          <div className="w-full max-w-[180px] sm:max-w-[220px] md:max-w-[260px] mx-auto mb-6 md:mb-8">
            <Image
              src="/logo.png"
              alt="RoboPulse Logo"
              width={500}
              height={250}
              className="w-full h-auto object-contain drop-shadow-2xl animate-heartbeat"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 rounded-full bg-brand-100 border border-brand-200 text-brand-700 text-[10px] md:text-xs font-bold mb-5 md:mb-6 uppercase tracking-wider">
            <Zap className="w-3 h-3 md:w-3.5 md:h-3.5 fill-brand-600 text-brand-600" />
            Inteligência Artificial para Negócios
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-surface-100 leading-[1.1] tracking-tight">
            Atendimento WhatsApp
            <span className="block bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent mt-1">
              Integrado e Automático
            </span>
          </h1>

          <p className="mt-4 md:mt-5 text-xs sm:text-sm md:text-base lg:text-lg text-surface-400 leading-relaxed max-w-2xl mx-auto font-medium px-4">
            Automatize o atendimento da sua empresa com IA. 
            Treine o seu robô com documentos reais e agende reuniões 
            diretamente no seu calendário.
          </p>

          <div className="mt-8 md:mt-10 flex flex-col items-center justify-center">
            <Link
              href="/login"
              className="w-full sm:w-auto group flex justify-center items-center gap-2 px-8 py-3.5 md:px-10 md:py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm md:text-base rounded-2xl transition-all duration-300 shadow-xl shadow-brand-600/30 hover:-translate-y-1"
            >
              Começar
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Compacto */}
      <footer className="border-t border-surface-800/50 py-3 md:py-4 bg-white/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center p-0.5 shadow-sm bg-white">
              <Image
                src="/logo.png"
                alt="RoboPulse"
                width={16}
                height={16}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-[10px] md:text-[11px] text-surface-300">RoboPulse © {new Date().getFullYear()}</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 text-[9px] md:text-[10px] font-semibold text-surface-400 uppercase tracking-widest">
            <Link href="#" className="hover:text-brand-600 transition-colors">Privacidade</Link>
            <Link href="#" className="hover:text-brand-600 transition-colors">Termos</Link>
            <Link href="#" className="hover:text-brand-600 transition-colors">Suporte</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
