import { prisma } from "@/lib/db";
import { 
  ArrowLeft, 
  User, 
  Save, 
  Settings as SettingsIcon,
  Trash2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateUser } from "../user-actions";
import TenantConfigManager from "./tenant-config-manager";

export default async function UserConfigPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      tenants: {
        include: {
          tenant: true
        }
      }
    }
  });

  if (!user) {
    notFound();
  }

  // Verificar status de integração pra todos os tenants
  const integrationStatus = {
    hasGemini: user.tenants.some(t => !!t.tenant.geminiKey),
    hasWhatsApp: user.tenants.some(t => !!t.tenant.whatsappPhoneId && !!t.tenant.whatsappToken),
    hasCalendar: user.tenants.some(t => !!t.tenant.calendarId),
    totalTenants: user.tenants.length,
  };

  async function updateAction(formData: FormData) {
    "use server";
    const data = {
      name: formData.get("name"),
      role: formData.get("role"),
      phoneNumber: formData.get("phoneNumber"),
    };
    await updateUser(id, data);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-[fade-in_0.3s_ease-out]">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/dashboard/users"
          className="flex items-center gap-2 text-surface-500 hover:text-brand-600 font-bold text-sm transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Lista
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-surface-100 tracking-tight">
              Central de <span className="text-brand-600">{user.name || "Usuário"}</span>
            </h1>
            <p className="text-surface-500 font-medium font-sans">
              Configuração de APIs, integrações e monitoramento de perfis
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-accent-rose font-bold text-sm border border-accent-rose/20 rounded-xl hover:bg-accent-rose/5 transition-colors">
            <Trash2 className="w-4 h-4" />
            Remover Acesso
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Coluna Principal (3/4) */}
        <div className="lg:col-span-3 space-y-8">
          {/* Seção A — Dados do Usuário (Compacta) */}
          <form action={updateAction} className="bg-white border border-surface-800 rounded-[2rem] p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-surface-800">
              <User className="w-5 h-5 text-brand-600" />
              <h2 className="text-base font-black text-surface-100 uppercase tracking-tight">Dados do Cliente</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Nome</label>
                <input
                  name="name"
                  defaultValue={user.name || ""}
                  className="w-full px-3 py-2.5 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-medium text-sm focus:ring-2 focus:ring-brand-600/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">E-mail</label>
                <div className="px-3 py-2.5 bg-surface-950/10 border border-surface-800 rounded-xl text-surface-500 font-medium text-sm truncate">
                  {user.email}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Cargo</label>
                <select
                  name="role"
                  defaultValue={user.role}
                  className="w-full px-3 py-2.5 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-medium text-sm focus:ring-2 focus:ring-brand-600/20 transition-all"
                >
                  <option value="USER">Usuário</option>
                  <option value="ADMIN">Admin</option>
                  <option value="AGENT">Agente</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Telefone</label>
                <input
                  name="phoneNumber"
                  defaultValue={user.phoneNumber || ""}
                  placeholder="+55 11..."
                  className="w-full px-3 py-2.5 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-medium text-sm focus:ring-2 focus:ring-brand-600/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-surface-950 text-white font-black text-xs rounded-xl hover:bg-black transition-all shadow-lg active:scale-95 uppercase tracking-widest"
            >
              <Save className="w-3.5 h-3.5" />
              Guardar Dados
            </button>
          </form>

          {/* Seção B — Perfis de Atendente (Principal) */}
          <TenantConfigManager tenants={user.tenants} userId={user.id} />
        </div>

        {/* Sidebar de Monitoramento (1/4) */}
        <div className="space-y-6">
          {/* Avatar Card */}
          <div className="bg-white border border-surface-800 rounded-[2rem] p-6 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16" />
            <div className="relative flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-xl font-black shadow-xl shadow-brand-600/20">
                {(user.name || "U").substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-black text-surface-100 text-sm">{user.name || "Usuário"}</h3>
                <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{user.role}</span>
              </div>
              <div className="w-full pt-3 border-t border-surface-800 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-surface-500 font-bold">UID</span>
                  <span className="text-surface-300 font-mono font-bold truncate max-w-[80px]">{user.firebaseUid}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-surface-500 font-bold">Desde</span>
                  <span className="text-surface-300 font-bold">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-surface-500 font-bold">Perfis</span>
                  <span className="text-brand-600 font-black">{integrationStatus.totalTenants}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status de Integrações */}
          <div className="bg-white border border-surface-800 rounded-[2rem] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-surface-800/50">
              <SettingsIcon className="w-4 h-4 text-surface-400" />
              <span className="text-xs font-black uppercase tracking-widest text-surface-400">Status</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-surface-500">IA Gemini</span>
                {integrationStatus.hasGemini 
                  ? <CheckCircle2 className="w-4 h-4 text-green-500" /> 
                  : <AlertCircle className="w-4 h-4 text-red-400" />
                }
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-surface-500">WhatsApp</span>
                {integrationStatus.hasWhatsApp 
                  ? <CheckCircle2 className="w-4 h-4 text-green-500" /> 
                  : <AlertCircle className="w-4 h-4 text-red-400" />
                }
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-surface-500">Calendar</span>
                {integrationStatus.hasCalendar 
                  ? <CheckCircle2 className="w-4 h-4 text-green-500" /> 
                  : <AlertCircle className="w-4 h-4 text-red-400" />
                }
              </div>
            </div>
          </div>

          {/* Guia Rápido */}
          <div className="p-5 bg-brand-50/50 border border-brand-100 rounded-[2rem] space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-600">📋 Checklist do Admin</span>
            <ol className="text-[11px] text-surface-500 font-medium leading-relaxed space-y-1.5 list-decimal list-inside">
              <li>Criar o App no Meta for Developers</li>
              <li>Copiar Phone ID + Token permanente</li>
              <li>Colar a Webhook URL no painel Meta</li>
              <li>Inserir a Gemini API Key</li>
              <li>Configurar o System Prompt</li>
              <li>Preencher o Calendar ID</li>
              <li>Testar enviando "Olá" pro WhatsApp</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
