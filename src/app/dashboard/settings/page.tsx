import { Shield, Server, Database, Activity, Layout, Globe } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-[fade-in_0.3s_ease-out]">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-surface-100 tracking-tight">
          Definições do <span className="text-brand-600">Sistema</span>
        </h1>
        <p className="text-surface-500 font-medium">
          Gerencie os parâmetros globais da plataforma RoboPulse
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Health */}
        <div className="bg-white border border-surface-800 rounded-[2rem] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-surface-800">
            <Activity className="w-5 h-5 text-accent-indigo" />
            <h2 className="text-lg font-black text-surface-100 uppercase tracking-tight">Estado do Servidor</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-950/20 border border-surface-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-brand-600" />
                <span className="text-sm font-bold text-surface-100">Banco de Dados (Neon)</span>
              </div>
              <span className="px-2 py-1 bg-green-500/10 text-green-600 text-[10px] font-black uppercase rounded-lg">Online</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-surface-950/20 border border-surface-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-accent-amber" />
                <span className="text-sm font-bold text-surface-100">Autenticação (Firebase)</span>
              </div>
              <span className="px-2 py-1 bg-green-500/10 text-green-600 text-[10px] font-black uppercase rounded-lg">Estável</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-950/20 border border-surface-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <Server className="w-4 h-4 text-surface-400" />
                <span className="text-sm font-bold text-surface-100">Storage (Vercel Blob)</span>
              </div>
              <span className="px-2 py-1 bg-green-500/10 text-green-600 text-[10px] font-black uppercase rounded-lg">Ativo</span>
            </div>
          </div>
        </div>

        {/* Branding & Platform */}
        <div className="bg-white border border-surface-800 rounded-[2rem] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-surface-800">
            <Layout className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-black text-surface-100 uppercase tracking-tight">Marca e Identidade</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Nome da Plataforma</label>
              <input
                defaultValue="RoboPulse"
                className="w-full px-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-medium focus:ring-2 focus:ring-brand-600/20 transition-all font-sans"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Cor Primária (HEX)</label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600 border border-surface-800" />
                <input
                  defaultValue="#0F62FE"
                  className="flex-1 px-4 py-2.5 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-mono uppercase focus:ring-2 focus:ring-brand-600/20 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Global Policies */}
        <div className="lg:col-span-2 bg-white border border-surface-800 rounded-[2rem] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-surface-800">
            <Globe className="w-5 h-5 text-accent-rose" />
            <h2 className="text-lg font-black text-surface-100 uppercase tracking-tight">Políticas Globais</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-surface-950/10 border border-surface-800 rounded-2xl space-y-2">
              <h4 className="text-xs font-black text-surface-100 uppercase tracking-wide">Limites de Mensagens</h4>
              <p className="text-xs text-surface-500 font-medium">Resetar contagem de mensagens a cada 24h em todos os perfis.</p>
              <button className="text-[10px] font-black text-brand-600 uppercase pt-2">Ativado</button>
            </div>
            
            <div className="p-4 bg-surface-950/10 border border-surface-800 rounded-2xl space-y-2">
              <h4 className="text-xs font-black text-surface-100 uppercase tracking-wide">Novos Registros</h4>
              <p className="text-xs text-surface-500 font-medium font-sans">Permitir que novos admins sejam criados apenas por Super Admins.</p>
              <button className="text-[10px] font-black text-brand-600 uppercase pt-2">Ativado</button>
            </div>

            <div className="p-4 bg-surface-950/10 border border-surface-800 rounded-2xl space-y-2">
              <h4 className="text-xs font-black text-surface-100 uppercase tracking-wide">Modo de Manutenção</h4>
              <p className="text-xs text-surface-500 font-medium font-sans">Suspender temporariamente o processamento de mensagens.</p>
              <button className="text-[10px] font-black text-accent-rose uppercase pt-2">Desativado</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
