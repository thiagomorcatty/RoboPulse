import Link from "next/link";
import {
  MessageSquare,
  Bot,
  Calendar,
  Zap,
  ArrowRight,
  Shield,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-surface-800/50 backdrop-blur-md bg-surface-950/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-50 tracking-tight">
              RoboPulse
            </span>
          </div>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-brand-600/25"
          >
            Entrar no Painel
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24">
        <div className="text-center max-w-3xl mx-auto animate-[fade-in_0.5s_ease-out]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-600/10 border border-brand-600/20 text-brand-400 text-sm font-medium mb-8">
            <Bot className="w-4 h-4" />
            Automação com Inteligência Artificial
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-surface-50 leading-tight tracking-tight">
            Atendimento WhatsApp
            <span className="block bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
              100% Automatizado
            </span>
          </h1>

          <p className="mt-6 text-lg text-surface-300 leading-relaxed max-w-2xl mx-auto">
            Treine a IA com os documentos do seu negócio e deixe o robô atender
            os seus clientes 24 horas por dia. Agende reuniões automaticamente
            no Google Calendar.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-brand-600/30"
            >
              Começar Agora
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20 animate-[slide-up_0.6s_ease-out]">
          {[
            {
              icon: MessageSquare,
              title: "Inbox Centralizada",
              description:
                "Veja todas as conversas em tempo real. Desligue o robô quando quiser e assuma o atendimento.",
            },
            {
              icon: Shield,
              title: "Multi-Perfis",
              description:
                "Configure perfis diferentes para cada negócio: contabilidade, seguros, imobiliária.",
            },
            {
              icon: Calendar,
              title: "Agendamento Automático",
              description:
                "A IA agenda reuniões directamente no Google Calendar quando o cliente está pronto.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-surface-900/60 border border-surface-800/50 hover:border-brand-600/30 transition-all duration-300 hover:bg-surface-800/40"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-600/10 flex items-center justify-center mb-4 group-hover:bg-brand-600/20 transition-colors">
                <feature.icon className="w-5 h-5 text-brand-400" />
              </div>
              <h3 className="text-lg font-semibold text-surface-50 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-surface-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-800/50 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-surface-500">
          © {new Date().getFullYear()} RoboPulse. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
