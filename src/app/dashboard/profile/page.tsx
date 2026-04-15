"use client";

import { useAuth } from "@/context/auth-context";
import { 
  User, 
  MessageCircle, 
  Calendar, 
  Key, 
  Save, 
  Loader2, 
  CheckCircle,
  Shield,
  Smartphone
} from "lucide-react";
import { useState } from "react";
import { updateUser } from "../users/user-actions";

export default function ProfilePage() {
  const { dbUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      whatsapp: formData.get("whatsapp"),
      // Mock para campos que serão expandidos no banco depois
      geminiKey: formData.get("geminiKey"),
    };

    const result = await updateUser(dbUser?.id, data);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-[fade-in_0.3s_ease-out]">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-surface-100 tracking-tight">
          Meu Perfil <span className="text-brand-600">& IA</span>
        </h1>
        <p className="text-surface-500 font-medium">
          Configure suas chaves de API e integração com WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          {/* WhatsApp & Identity */}
          <div className="bg-white border border-surface-800 rounded-[2rem] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-surface-800">
              <MessageCircle className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-black text-surface-100 uppercase tracking-tight">WhatsApp & Identidade</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Nome de Exibição</label>
                <input
                  name="name"
                  defaultValue={dbUser?.name}
                  className="w-full px-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-medium focus:ring-2 focus:ring-brand-600/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">E-mail</label>
                <div className="px-4 py-3 bg-surface-950/10 border border-surface-800 rounded-xl text-surface-500 font-medium cursor-not-allowed">
                  {dbUser?.email}
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">WhatsApp ID / Número</label>
                <div className="relative group">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-brand-600" />
                  <input
                    name="whatsapp"
                    defaultValue={dbUser?.whatsapp || ""}
                    placeholder="+351 9..."
                    className="w-full pl-12 pr-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-medium focus:ring-2 focus:ring-brand-600/20 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div className="bg-white border border-surface-800 rounded-[2rem] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-surface-800">
              <Key className="w-5 h-5 text-accent-amber" />
              <h2 className="text-lg font-black text-surface-100 uppercase tracking-tight">Configurações de IA</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Google Gemini API Key</label>
                <input
                  name="geminiKey"
                  type="password"
                  placeholder="Coloque sua chave de API do Gemini..."
                  className="w-full px-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-medium focus:ring-2 focus:ring-brand-600/20 transition-all font-mono"
                />
                <p className="text-[10px] text-surface-500 font-medium px-1">
                  Esta chave será usada para processar as conversas deste perfil.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-2xl transition-all duration-300 shadow-lg shadow-brand-600/20 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Guardar Configurações
            </button>
            {success && (
              <div className="flex items-center gap-2 text-brand-600 font-bold animate-[fade-in_0.2s_ease-out]">
                <CheckCircle className="w-5 h-5" />
                Guardado!
              </div>
            )}
          </div>
        </form>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white border border-surface-800 rounded-[2rem] p-6 shadow-sm">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-sm font-black text-surface-100">Google Calendar</h3>
                <p className="text-xs text-surface-500 font-medium">Sincronize sua agenda</p>
              </div>
              <button className="w-full py-2.5 bg-surface-950 text-white font-bold text-xs rounded-xl hover:bg-black transition-all">
                Conectar Conta
              </button>
            </div>
          </div>

          <div className="p-6 bg-accent-amber/5 border border-accent-amber/20 rounded-[2rem] space-y-3">
            <div className="flex items-center gap-2 text-accent-amber">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest text-surface-400">Dica de Segurança</span>
            </div>
            <p className="text-xs text-surface-500 font-medium leading-relaxed">
              Nunca compartilhe suas chaves de API. O RoboPulse encripta estes dados para sua segurança.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
