"use client";

import { useState } from "react";
import { 
  User, Webhook, Calendar, Smartphone, Shield, Save, Plus, 
  Brain, MessageSquare, CheckCircle2, AlertCircle, Thermometer,
  Globe, Copy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updateTenant } from "../../persona/tenant-actions";
import { createTenant } from "../../persona/tenant-actions";

type TenantData = {
  tenant: {
    id: string;
    name: string;
    systemPrompt: string;
    temperature: number;
    geminiKey: string | null;
    whatsappPhoneId: string | null;
    whatsappToken: string | null;
    calendarId: string | null;
  }
};

function StatusBadge({ configured, label }: { configured: boolean; label: string }) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
      configured ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-500 border border-red-200"
    )}>
      {configured ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
      {label}
    </div>
  );
}

// URL do webhook gerada automaticamente baseada no domínio de produção
const WEBHOOK_BASE_URL = typeof window !== "undefined" 
  ? `${window.location.origin}/api/webhooks/whatsapp`
  : "https://seu-dominio.vercel.app/api/webhooks/whatsapp";

export default function TenantConfigManager({ tenants, userId }: { tenants: TenantData[]; userId: string }) {
  const [activeTab, setActiveTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!tenants || tenants.length === 0) {
    return (
      <div className="bg-white border border-surface-800 rounded-[2rem] p-8 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 flex items-center justify-center">
          <User className="w-8 h-8 text-brand-600" />
        </div>
        <p className="text-surface-500 font-bold">Este usuário não possui perfis de atendentes.</p>
        <button
          onClick={async () => {
            setIsCreating(true);
            await createTenant(userId, { name: "Novo Atendente", segment: "Geral" });
            setIsCreating(false);
            window.location.reload();
          }}
          disabled={isCreating}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-black rounded-xl hover:bg-brand-700 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          {isCreating ? "Criando..." : "Criar Primeiro Perfil"}
        </button>
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
        systemPrompt: formData.get("systemPrompt") as string,
        temperature: parseFloat(formData.get("temperature") as string),
        geminiKey: formData.get("geminiKey") as string,
        whatsappPhoneId: formData.get("whatsappPhoneId") as string,
        whatsappToken: formData.get("whatsappToken") as string,
        calendarId: formData.get("calendarId") as string,
      };
      
      await updateTenant(tenantId, data);
      alert("✅ Configurações salvas com sucesso!");
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao salvar as configurações.");
    } finally {
      setIsSaving(false);
    }
  }

  function copyWebhookUrl() {
    navigator.clipboard.writeText(WEBHOOK_BASE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Abas de Perfis + Botão Criar */}
      <div className="bg-white border border-surface-800 rounded-[2rem] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-surface-100 uppercase tracking-tight">Perfis de Atendente</h2>
          <button
            onClick={async () => {
              setIsCreating(true);
              await createTenant(userId, { name: `Atendente ${tenants.length + 1}`, segment: "Geral" });
              setIsCreating(false);
              window.location.reload();
            }}
            disabled={isCreating}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl hover:bg-brand-700 transition-all active:scale-95 disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            {isCreating ? "Criando..." : "Novo Perfil"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tenants.map((t, idx) => (
            <button
              key={t.tenant.id}
              onClick={() => setActiveTab(idx)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
                activeTab === idx 
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/20 scale-[1.03]" 
                  : "bg-surface-950/30 text-surface-500 border border-surface-800 hover:bg-brand-50 hover:text-brand-600"
              )}
            >
              {t.tenant.name || "Perfil sem nome"}
            </button>
          ))}
        </div>

        {/* Status Resumido */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-surface-800/50">
          <StatusBadge configured={!!activeTenant.geminiKey} label="IA Gemini" />
          <StatusBadge configured={!!activeTenant.whatsappPhoneId && !!activeTenant.whatsappToken} label="WhatsApp" />
          <StatusBadge configured={!!activeTenant.calendarId} label="Calendar" />
        </div>
      </div>

      {/* Formulário do Perfil Selecionado */}
      <form action={handleUpdate} key={activeTenant.id} className="space-y-6">
        <input type="hidden" name="tenantId" value={activeTenant.id} />

        {/* Nome do Atendente */}
        <div className="bg-white border border-surface-800 rounded-[2rem] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-surface-800/50">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
              <User className="w-4 h-4" />
            </div>
            <h3 className="font-black text-surface-100 uppercase tracking-tight">Identificação</h3>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Nome do Atendente</label>
            <input
              name="tenantName"
              defaultValue={activeTenant.name || ""}
              className="w-full px-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-medium focus:ring-2 focus:ring-brand-600/20 transition-all"
            />
          </div>
        </div>

        {/* BLOCO 1: Inteligência Artificial */}
        <div className="bg-white border border-surface-800 rounded-[2rem] p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-surface-800/50">
            <div className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center text-accent-indigo">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-surface-100 uppercase tracking-tight">Inteligência Artificial</h3>
              <p className="text-[10px] text-surface-500 font-bold">Motor de respostas automáticas do Gemini</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
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

            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">
                <MessageSquare className="w-3 h-3 text-accent-indigo" />
                System Prompt (Persona do Bot)
              </label>
              <textarea
                name="systemPrompt"
                defaultValue={activeTenant.systemPrompt || ""}
                rows={5}
                placeholder="Você é um atendente da clínica X, especializado em..."
                className="w-full px-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-medium text-sm focus:ring-2 focus:ring-brand-600/20 transition-all resize-none"
              />
              <p className="text-[9px] text-surface-500 ml-1">Descreva o comportamento, tom de voz e regras que o robô deve seguir ao responder o cliente.</p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">
                <Thermometer className="w-3 h-3 text-accent-indigo" />
                Temperatura (Criatividade)
              </label>
              <input
                name="temperature"
                type="number"
                step="0.1"
                min="0"
                max="2"
                defaultValue={activeTenant.temperature ?? 0.7}
                className="w-full px-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-mono text-sm focus:ring-2 focus:ring-brand-600/20 transition-all"
              />
              <p className="text-[9px] text-surface-500 ml-1">0.0 = Respostas precisas e diretas | 2.0 = Respostas criativas e variadas</p>
            </div>
          </div>
        </div>

        {/* BLOCO 2: WhatsApp Cloud API */}
        <div className="bg-white border border-surface-800 rounded-[2rem] p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-surface-800/50">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-surface-100 uppercase tracking-tight">WhatsApp Cloud API</h3>
              <p className="text-[10px] text-surface-500 font-bold">Configuração via Meta for Developers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">
                <Smartphone className="w-3 h-3 text-green-600" />
                Phone Number ID
              </label>
              <input
                name="whatsappPhoneId"
                defaultValue={activeTenant.whatsappPhoneId || ""}
                placeholder="1234567890..."
                className="w-full px-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-mono text-sm focus:ring-2 focus:ring-brand-600/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">
                <Shield className="w-3 h-3 text-green-600" />
                Permanent Access Token
              </label>
              <input
                name="whatsappToken"
                type="password"
                defaultValue={activeTenant.whatsappToken || ""}
                placeholder="EAA..."
                className="w-full px-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-mono text-sm focus:ring-2 focus:ring-brand-600/20 transition-all"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">
                <Globe className="w-3 h-3 text-green-600" />
                Webhook URL (Copiar para o Meta)
              </label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={WEBHOOK_BASE_URL}
                  className="flex-1 px-4 py-3 bg-green-50/50 border border-green-200 rounded-xl text-green-700 font-mono text-sm cursor-default"
                />
                <button
                  type="button"
                  onClick={copyWebhookUrl}
                  className={cn(
                    "p-3 rounded-xl transition-all font-bold text-xs",
                    copied 
                      ? "bg-green-600 text-white" 
                      : "bg-surface-950/20 text-surface-400 hover:bg-brand-50 hover:text-brand-600 border border-surface-800"
                  )}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[9px] text-surface-500 ml-1">📋 Cole esta URL no painel Meta for Developers → WhatsApp → Configuração → Webhook URL</p>
            </div>
          </div>
        </div>

        {/* BLOCO 3: Google Calendar */}
        <div className="bg-white border border-surface-800 rounded-[2rem] p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-surface-800/50">
            <div className="w-8 h-8 rounded-lg bg-accent-amber/10 flex items-center justify-center text-accent-amber">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-surface-100 uppercase tracking-tight">Google Calendar</h3>
              <p className="text-[10px] text-surface-500 font-bold">Agendamento automático de reuniões</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">
              <Calendar className="w-3 h-3 text-accent-amber" />
              Calendar ID
            </label>
            <input
              name="calendarId"
              defaultValue={activeTenant.calendarId || ""}
              placeholder="email@group.calendar.google.com"
              className="w-full px-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-medium text-sm focus:ring-2 focus:ring-brand-600/20 transition-all font-sans"
            />
            <p className="text-[9px] text-surface-500 ml-1">O cliente informa o link do Calendar. O Admin extrai o Calendar ID e insere aqui.</p>
          </div>
        </div>

        {/* Botão Salvar Global */}
        <div className="flex items-center justify-between p-6 bg-surface-950/5 border border-surface-800 rounded-[2rem]">
          <p className="text-[10px] text-surface-500 font-bold max-w-[300px]">
            ⚠️ Dados sensíveis. Confira os tokens antes de salvar. Alterações são aplicadas imediatamente.
          </p>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3.5 bg-brand-600 text-white font-black rounded-xl hover:bg-brand-700 transition-all shadow-lg active:scale-95 text-sm uppercase tracking-widest disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Salvando..." : "Salvar Configurações"}
          </button>
        </div>
      </form>
    </div>
  );
}
