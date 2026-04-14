import { MessageSquare } from "lucide-react";

export default function InboxPage() {
  return (
    <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
      <div>
        <h1 className="text-2xl font-bold text-surface-50">Conversas</h1>
        <p className="text-surface-400 mt-1">
          Caixa de entrada unificada. Gerir atendimentos do WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 rounded-2xl border border-surface-800/50 overflow-hidden min-h-[calc(100vh-220px)]">
        {/* Conversations List */}
        <div className="bg-surface-900/80 border-r border-surface-800/50 flex flex-col">
          <div className="p-4 border-b border-surface-800/50">
            <input
              type="text"
              placeholder="Pesquisar conversas..."
              className="w-full px-4 py-2.5 bg-surface-800/60 border border-surface-700/30 rounded-xl text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:border-brand-600/50 transition-colors"
            />
          </div>
          <div className="flex-1 flex items-center justify-center text-surface-500 text-sm p-6">
            <div className="text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-surface-600" />
              <p>Sem conversas ainda.</p>
              <p className="text-xs text-surface-600 mt-1">
                Ligue o webhook do WhatsApp para começar.
              </p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-surface-950/50 flex items-center justify-center text-surface-500 text-sm">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-800/40 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-surface-600" />
            </div>
            <p className="font-medium text-surface-400">
              Selecione uma conversa
            </p>
            <p className="text-xs text-surface-600 mt-1">
              As mensagens serão apresentadas aqui.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
