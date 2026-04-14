import {
  MessageSquare,
  Users,
  CalendarCheck,
  TrendingUp,
  Bot,
  Clock,
} from "lucide-react";

const stats = [
  {
    label: "Conversas Hoje",
    value: "0",
    change: "+0%",
    icon: MessageSquare,
    color: "text-brand-400",
    bg: "bg-brand-600/10",
  },
  {
    label: "Contactos Ativos",
    value: "0",
    change: "+0%",
    icon: Users,
    color: "text-accent-sky",
    bg: "bg-accent-sky/10",
  },
  {
    label: "Reuniões Agendadas",
    value: "0",
    change: "+0%",
    icon: CalendarCheck,
    color: "text-accent-amber",
    bg: "bg-accent-amber/10",
  },
  {
    label: "Taxa de Resolução IA",
    value: "0%",
    change: "+0%",
    icon: Bot,
    color: "text-brand-300",
    bg: "bg-brand-600/10",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-[fade-in_0.3s_ease-out]">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-surface-50">
          Painel de Controlo
        </h1>
        <p className="text-surface-400 mt-1">
          Visão geral do seu atendimento automatizado.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-2xl bg-surface-900/60 border border-surface-800/50 hover:border-surface-700/50 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-xs font-medium text-brand-400 bg-brand-600/10 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-surface-50">{stat.value}</p>
            <p className="text-sm text-surface-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-2xl bg-surface-900/60 border border-surface-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-50 flex items-center gap-2">
              <Clock className="w-5 h-5 text-surface-400" />
              Atividade Recente
            </h3>
          </div>
          <div className="flex items-center justify-center h-48 text-surface-500 text-sm">
            <div className="text-center">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 text-surface-600" />
              <p>Nenhuma atividade registada.</p>
              <p className="text-surface-600 mt-1">
                As conversas do WhatsApp aparecerão aqui.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl bg-surface-900/60 border border-surface-800/50 p-6">
          <h3 className="text-lg font-semibold text-surface-50 flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-surface-400" />
            Ações Rápidas
          </h3>
          <div className="space-y-3">
            {[
              { label: "Criar Novo Perfil", href: "/dashboard/tenants" },
              { label: "Carregar Documento", href: "/dashboard/knowledge" },
              { label: "Configurar WhatsApp", href: "/dashboard/settings" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="block w-full px-4 py-3 text-sm font-medium text-surface-300 bg-surface-800/40 hover:bg-surface-800/80 rounded-xl transition-all duration-200 hover:text-surface-100"
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
