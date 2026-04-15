"use client";

import { useAuth } from "@/context/auth-context";
import { 
  UserCircle, 
  Brain, 
  Sparkles, 
  Save, 
  Loader2, 
  CheckCircle,
  MessageSquare,
  Thermometer,
  Info
} from "lucide-react";
import { useState, useEffect } from "react";
import { updateTenant, createTenant } from "./tenant-actions";

export default function PersonaPage() {
  const { dbUser, activeTenant, setActiveTenant } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [temp, setTemp] = useState(0.7);

  useEffect(() => {
    if (activeTenant) {
      setTemp(activeTenant.temperature || 0.7);
    }
  }, [activeTenant]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!activeTenant) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      segment: formData.get("segment"),
      description: formData.get("description"),
      systemPrompt: formData.get("systemPrompt"),
      temperature: temp
    };

    const result = await updateTenant(activeTenant.id, data);
    
    if (result.success) {
      setSuccess(true);
      // Atualizar o contexto local
      setActiveTenant({ ...activeTenant, ...data });
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  }

  if (!activeTenant && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-[fade-in_0.3s_ease-out]">
        <div className="w-24 h-24 rounded-3xl bg-brand-50 flex items-center justify-center text-brand-600 shadow-sm border border-brand-100">
          <Sparkles className="w-12 h-12" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-surface-100 uppercase tracking-tight">Nenhum Atendente Selecionado</h2>
          <p className="text-surface-500 font-medium max-w-sm mx-auto mt-2">
            Crie ou selecione um perfil de atendente no topo para começar a configurar seu robô.
          </p>
        </div>
        <button 
          onClick={async () => {
            setLoading(true);
            const res = await createTenant(dbUser?.id, { name: "Novo Atendente" });
            if (res.success) {
              window.location.reload();
            }
            setLoading(false);
          }}
          className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-brand-600/20 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>+ Criar Meu Primeiro Atendente</>}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-[fade-in_0.3s_ease-out]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-600">
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">IA Persona</span>
          </div>
          <h1 className="text-4xl font-black text-surface-100 tracking-tight leading-none">
            Perfil do <span className="text-brand-600">Atendente</span>
          </h1>
          <p className="text-surface-500 font-medium font-sans">
            Defina o tom de voz, conhecimento base e comportamento da sua inteligência artificial.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-brand-50 border border-brand-200 rounded-xl">
            <span className="text-xs font-bold text-brand-600">Perfil Ativo: {activeTenant?.name}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Essential Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-surface-800 rounded-[2.5rem] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-surface-800">
              <UserCircle className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-black text-surface-100 uppercase tracking-tight">Identidade</h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Nome do Atendente</label>
                <input
                  name="name"
                  defaultValue={activeTenant?.name}
                  placeholder="Ex: Maria da RoboPulse"
                  className="w-full px-5 py-4 bg-surface-950/5 border border-surface-800 rounded-2xl text-surface-100 font-bold focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Segmento do Negócio</label>
                <input
                  name="segment"
                  defaultValue={activeTenant?.segment}
                  placeholder="Ex: Imobiliária, Estética..."
                  className="w-full px-5 py-4 bg-surface-950/5 border border-surface-800 rounded-2xl text-surface-100 font-medium focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Descrição do Negócio</label>
                <textarea
                  name="description"
                  defaultValue={activeTenant?.description || ""}
                  placeholder="Fale um pouco sobre o negócio..."
                  rows={3}
                  className="w-full px-5 py-4 bg-surface-950/5 border border-surface-800 rounded-2xl text-surface-100 font-medium focus:ring-4 focus:ring-brand-500/10 transition-all outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Temperature Selector */}
          <div className="bg-white border border-surface-800 rounded-[2.5rem] p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Thermometer className="w-5 h-5 text-accent-rose" />
                <h2 className="text-[10px] font-black text-surface-100 uppercase tracking-tight tracking-widest">Criatividade da IA</h2>
              </div>
              <span className="px-2 py-1 bg-accent-rose/10 text-accent-rose text-[10px] font-black rounded-lg uppercase">{temp.toFixed(1)}</span>
            </div>

            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.1"
                value={temp}
                onChange={(e) => setTemp(parseFloat(e.target.value))}
                className="w-full h-2 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />
              <div className="flex justify-between text-[10px] font-black text-surface-500 uppercase tracking-widest">
                <span>Rígido</span>
                <span>Equilibrado</span>
                <span>Criativo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Prompt & Intelligence */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-surface-800 rounded-[2.5rem] p-8 shadow-sm space-y-6 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-surface-800">
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-brand-600" />
                <h2 className="text-xl font-black text-surface-100 uppercase tracking-tight leading-none pt-1">O Cérebro da IA <span className="text-brand-600 block text-xs font-black uppercase tracking-widest opacity-60">System Prompt</span></h2>
              </div>
            </div>

            <div className="flex-1 flex flex-col space-y-4 pt-4">
              <div className="flex items-start gap-4 p-4 bg-brand-50 rounded-2xl border border-brand-100">
                <Info className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <p className="text-xs text-brand-900/70 font-medium leading-relaxed font-sans">
                  Dê instruções detalhadas de como o robô deve falar, o que pode e o que não pode dizer. Use frases do tipo: <span className="font-bold text-brand-700">"Sempre peça o nome do cliente antes de dar preços"</span> ou <span className="font-bold text-brand-700">"Não mencione que é um robô"</span>.
                </p>
              </div>
              
              <div className="flex-1 relative">
                <textarea
                  name="systemPrompt"
                  defaultValue={activeTenant?.systemPrompt}
                  className="w-full h-full min-h-[350px] p-6 bg-surface-950/5 border border-surface-800 rounded-3xl text-surface-100 font-mono text-sm focus:ring-4 focus:ring-brand-500/10 transition-all outline-none resize-none leading-relaxed"
                  placeholder="Atue como a Maria, atendente oficial da Imobiliária Pulse..."
                />
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between gap-4 border-t border-surface-800">
              <div className="flex items-center gap-3">
                {success && (
                  <div className="flex items-center gap-2 text-green-600 font-black text-xs animate-[fade-in_0.2s_ease-out] uppercase tracking-widest">
                    <CheckCircle className="w-5 h-5" />
                    Perfil Atualizado com Sucesso
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="px-12 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-2xl transition-all duration-300 shadow-xl shadow-brand-600/20 disabled:opacity-70 flex items-center gap-3 uppercase tracking-widest text-xs"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Guardar Persona
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
