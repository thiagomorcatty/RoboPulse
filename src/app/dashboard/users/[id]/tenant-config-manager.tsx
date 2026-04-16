"use client";

import { useState } from "react";
import { User, Webhook, Calendar, Smartphone, Shield, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateTenant } from "../../persona/tenant-actions";

type TenantData = {
  tenant: {
    id: string;
    name: string;
    geminiKey: string | null;
    whatsappPhoneId: string | null;
    whatsappToken: string | null;
    calendarId: string | null;
  }
};

export default function TenantConfigManager({ tenants }: { tenants: TenantData[] }) {
  const [activeTab, setActiveTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  if (!tenants || tenants.length === 0) {
    return (
      <div className="bg-white border border-surface-800 rounded-[2rem] p-8 shadow-sm">
        <p className="text-surface-500 font-bold">Este usuário não possui perfis de atendentes vinculados.</p>
      </div>
    );
  }

  const activeTenant = tenants[activeTab].tenant;

  async function handleUpdate(formData: FormData) {
    setIsSaving(true);
    try {
      const tenantId = formData.get("tenantId") as string;
      const data = {
        name: formData.get("tenantName") as string,
        geminiKey: formData.get("geminiKey") as string,
        whatsappPhoneId: formData.get("whatsappPhoneId") as string,
        whatsappToken: formData.get("whatsappToken") as string,
        calendarId: formData.get("calendarId") as string,
      };
      
      await updateTenant(tenantId, data);
      alert("Configurações do perfil salvas com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar as configurações.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="bg-white border border-surface-800 rounded-[2rem] p-8 shadow-sm space-y-8 animate-[slide-up_0.3s_ease-out]">
      {/* Seletor de Perfis */}
      <div className="flex flex-col gap-4 pb-6 border-b border-surface-800">
        <h2 className="text-lg font-black text-surface-100 uppercase tracking-tight">Perfis do Usuário (Atendentes)</h2>
        <p className="text-sm text-surface-500 -mt-2">Selecione o perfil que deseja configurar abaixo:</p>
        <div className="flex flex-wrap gap-2">
          {tenants.map((t, idx) => (
            <button
              key={t.tenant.id}
              onClick={(e) => { e.preventDefault(); setActiveTab(idx); }}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
                activeTab === idx 
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/20 scale-105" 
                  : "bg-surface-950/50 text-surface-500 border border-surface-800 hover:bg-brand-50 hover:text-brand-600"
              )}
            >
              {t.tenant.name || "Perfil sem nome"}
            </button>
          ))}
        </div>
      </div>

      {/* Formulário do Perfil Selecionado */}
      <div className="pt-2 animate-[fade-in_0.3s_ease-out]" key={activeTenant.id}>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-surface-400 font-bold uppercase tracking-widest block">Configurando</span>
              <h3 className="font-black text-surface-100 uppercase text-lg">{activeTenant.name}</h3>
            </div>
          </div>
          <div className="px-3 py-1 bg-surface-950/50 border border-surface-800 rounded-lg text-[10px] font-black text-surface-400 uppercase tracking-widest hidden sm:block">
            ID: {activeTenant.id}
          </div>
        </div>

        <form action={handleUpdate} className="space-y-6">
          <input type="hidden" name="tenantId" value={activeTenant.id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 lg:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Nome do Atendente (Exibição)</label>
              <input
                name="tenantName"
                defaultValue={activeTenant.name || ""}
                className="w-full px-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-medium focus:ring-2 focus:ring-brand-600/20 transition-all font-sans"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">
                <Webhook className="w-3 h-3 text-accent-indigo" />
                Gemini API Key
              </label>
              <input
                name="geminiKey"
                type="password"
                defaultValue={activeTenant.geminiKey || ""}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-mono text-sm focus:ring-2 focus:ring-brand-600/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">
                <Calendar className="w-3 h-4 text-accent-amber" />
                Google Calendar ID
              </label>
              <input
                name="calendarId"
                defaultValue={activeTenant.calendarId || ""}
                placeholder="email@group.calendar.google.com"
                className="w-full px-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-medium text-sm focus:ring-2 focus:ring-brand-600/20 transition-all font-sans"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">
                <Smartphone className="w-3 h-4 text-green-600" />
                WhatsApp Phone ID
              </label>
              <input
                name="whatsappPhoneId"
                defaultValue={activeTenant.whatsappPhoneId || ""}
                placeholder="1234567890..."
                className="w-full px-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-medium text-sm focus:ring-2 focus:ring-brand-600/20 transition-all font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">
                <Shield className="w-3 h-4 text-green-600" />
                WhatsApp Permanent Token
              </label>
              <input
                name="whatsappToken"
                type="password"
                defaultValue={activeTenant.whatsappToken || ""}
                placeholder="EAA..."
                className="w-full px-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-mono text-sm focus:ring-2 focus:ring-brand-600/20 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-surface-800 gap-4">
            <p className="text-[10px] text-surface-500 font-bold max-w-[250px] text-center sm:text-left">
              Estes dados são sensíveis. O Administrador garante os direitos do perfil do utilizador.
            </p>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white font-black rounded-xl hover:bg-brand-700 transition-all shadow-lg active:scale-95 text-xs uppercase tracking-widest disabled:opacity-50 disabled:pointer-events-none"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Salvando..." : "Sincronizar Atendente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
