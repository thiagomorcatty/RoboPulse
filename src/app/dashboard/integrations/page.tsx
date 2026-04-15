"use client";

import { useAuth } from "@/context/auth-context";
import { 
  MessageCircle, 
  Calendar, 
  Key, 
  Save, 
  Loader2, 
  CheckCircle,
  Smartphone,
  ShieldCheck,
  Zap,
  Link2
} from "lucide-react";
import { useState } from "react";
import { updateTenant } from "../persona/tenant-actions";

export default function IntegrationsPage() {
  const { activeTenant, setActiveTenant } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!activeTenant) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      geminiKey: formData.get("geminiKey"),
      whatsappPhoneId: formData.get("whatsappPhoneId"),
      whatsappToken: formData.get("whatsappToken"),
      calendarId: formData.get("calendarId"),
    };

    const result = await updateTenant(activeTenant.id, data);
    
    if (result.success) {
      setSuccess(true);
      setActiveTenant({ ...activeTenant, ...data });
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  }

  if (!activeTenant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-[fade-in_0.3s_ease-out]">
        <div className="w-24 h-24 rounded-3xl bg-surface-950/20 flex items-center justify-center text-surface-400">
          <Link2 className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-bold text-surface-400">Selecione um perfil para configurar as integrações</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-[fade-in_0.3s_ease-out]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-600">
            <Zap className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Conexões Técnicas</span>
          </div>
          <h1 className="text-4xl font-black text-surface-100 tracking-tight leading-none">
            Integrações do <span className="text-brand-600">Perfil</span>
          </h1>
          <p className="text-surface-500 font-medium font-sans">
            Conecte as APIs e serviços externos para ativar o funcionamento total deste atendente.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* WhatsApp Cloud API */}
        <div className="bg-white border border-surface-800 rounded-[2.5rem] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-surface-800">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-surface-100 uppercase tracking-tight leading-none">WhatsApp Cloud API</h2>
              <span className="text-[10px] text-surface-500 font-bold uppercase tracking-widest">Oficial da Meta</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Phone Number ID</label>
              <div className="relative group">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-brand-600 transition-colors" />
                <input
                  name="whatsappPhoneId"
                  defaultValue={activeTenant?.whatsappPhoneId || ""}
                  placeholder="Ex: 1098472938472"
                  className="w-full pl-11 pr-5 py-4 bg-surface-950/5 border border-surface-800 rounded-2xl text-surface-100 font-medium focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Permanent Access Token</label>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-brand-600 transition-colors" />
                <input
                  name="whatsappToken"
                  type="password"
                  defaultValue={activeTenant?.whatsappToken || ""}
                  placeholder="EAABw..."
                  className="w-full pl-11 pr-5 py-4 bg-surface-950/5 border border-surface-800 rounded-2xl text-surface-100 font-medium focus:ring-4 focus:ring-brand-500/10 transition-all outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gemini & IA Engine */}
        <div className="bg-white border border-surface-800 rounded-[2.5rem] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-surface-800">
            <div className="w-10 h-10 rounded-xl bg-accent-amber/10 flex items-center justify-center text-accent-amber">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-surface-100 uppercase tracking-tight leading-none">Motor de IA</h2>
              <span className="text-[10px] text-surface-500 font-bold uppercase tracking-widest">Google Gemini 1.5 Pro</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Chave de API (Gemini)</label>
              <input
                name="geminiKey"
                type="password"
                defaultValue={activeTenant?.geminiKey || ""}
                placeholder="Introduza sua Gemini Key..."
                className="w-full px-5 py-4 bg-surface-950/5 border border-surface-800 rounded-2xl text-surface-100 font-medium focus:ring-4 focus:ring-brand-500/10 transition-all outline-none font-mono"
              />
              <p className="text-[10px] text-surface-400 px-1 leading-relaxed">
                Esta chave garante o processamento independente deste atendente.
              </p>
            </div>

            <div className="p-4 bg-accent-amber/5 border border-accent-amber/10 rounded-2xl flex gap-3">
              <ShieldCheck className="w-5 h-5 text-accent-amber shrink-0" />
              <p className="text-[10px] text-surface-500 font-medium">As suas chaves são encriptadas no nosso banco de dados por segurança.</p>
            </div>
          </div>
        </div>

        {/* Google Calendar */}
        <div className="bg-white border border-surface-800 rounded-[2.5rem] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-surface-800">
            <div className="w-10 h-10 rounded-xl bg-accent-sky/10 flex items-center justify-center text-accent-sky">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-surface-100 uppercase tracking-tight leading-none">Google Calendar</h2>
              <span className="text-[10px] text-surface-500 font-bold uppercase tracking-widest">Agendamento Automático</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Calendar ID</label>
              <input
                name="calendarId"
                defaultValue={activeTenant?.calendarId || ""}
                placeholder="Ex: usuario@gmail.com"
                className="w-full px-5 py-4 bg-surface-950/5 border border-surface-800 rounded-2xl text-surface-100 font-medium focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
              />
            </div>

            <button type="button" className="w-full py-4 bg-surface-950 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2">
              <Link2 className="w-4 h-4" />
              Conectar com Google
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="lg:col-span-2 flex items-center justify-between p-6 bg-surface-950/5 border border-surface-800 rounded-[2.5rem]">
          <div className="flex items-center gap-3">
            {success && (
              <div className="flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-widest animate-[fade-in_0.2s_ease-out]">
                <CheckCircle className="w-5 h-5" />
                Configurações Salvas
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-12 py-5 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-[1.5rem] transition-all duration-300 shadow-xl shadow-brand-600/20 disabled:opacity-70 flex items-center gap-3 uppercase tracking-widest text-xs"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Guardar Integrações
          </button>
        </div>
      </form>
    </div>
  );
}
