import { Settings, MessageCircle, Calendar, Key } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
      <div>
        <h1 className="text-2xl font-bold text-surface-50">Definições</h1>
        <p className="text-surface-400 mt-1">
          Configurar integrações e preferências do sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WhatsApp Config */}
        <div className="rounded-2xl bg-surface-900/60 border border-surface-800/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-600/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-surface-50">
                WhatsApp Cloud API
              </h3>
              <p className="text-xs text-surface-500">
                Configuração da API oficial da Meta.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">
                Verify Token
              </label>
              <input
                type="text"
                placeholder="Token de verificação do webhook"
                className="w-full px-4 py-2.5 bg-surface-800/60 border border-surface-700/30 rounded-xl text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:border-brand-600/50 transition-colors"
              />
            </div>
            <p className="text-xs text-surface-600">
              Os tokens de acesso por número do WhatsApp são configurados em cada Perfil.
            </p>
          </div>
        </div>

        {/* Google Calendar Config */}
        <div className="rounded-2xl bg-surface-900/60 border border-surface-800/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent-sky/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent-sky" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-surface-50">
                Google Calendar
              </h3>
              <p className="text-xs text-surface-500">
                Integração para agendamento automático de reuniões.
              </p>
            </div>
          </div>
          <button className="w-full px-4 py-2.5 bg-surface-800/60 border border-surface-700/30 hover:border-accent-sky/30 rounded-xl text-sm text-surface-300 hover:text-accent-sky transition-all duration-200">
            Conectar Google Calendar
          </button>
        </div>

        {/* Gemini API Config */}
        <div className="rounded-2xl bg-surface-900/60 border border-surface-800/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent-amber/10 flex items-center justify-center">
              <Key className="w-5 h-5 text-accent-amber" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-surface-50">
                Gemini Pro AI
              </h3>
              <p className="text-xs text-surface-500">
                Motor de inteligência artificial para o chatbot.
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">
              API Key
            </label>
            <input
              type="password"
              placeholder="Chave de API do Google Gemini"
              className="w-full px-4 py-2.5 bg-surface-800/60 border border-surface-700/30 rounded-xl text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:border-brand-600/50 transition-colors"
            />
          </div>
        </div>

        {/* General Settings */}
        <div className="rounded-2xl bg-surface-900/60 border border-surface-800/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-surface-50">
                Geral
              </h3>
              <p className="text-xs text-surface-500">
                Preferências gerais do sistema.
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">
              Idioma da IA
            </label>
            <select className="w-full px-4 py-2.5 bg-surface-800/60 border border-surface-700/30 rounded-xl text-sm text-surface-200 focus:outline-none focus:border-brand-600/50 transition-colors">
              <option value="pt-PT">Português (Portugal)</option>
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
