import { prisma } from "@/lib/db";
import { 
  ArrowLeft, 
  User, 
  Smartphone, 
  Shield, 
  Mail, 
  Save, 
  Key, 
  Calendar, 
  Webhook, 
  Settings as SettingsIcon,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateUser } from "../user-actions";
import { updateTenant } from "../../persona/tenant-actions";
import { cn } from "@/lib/utils";

export default async function UserEditPage({ params }: { params: Promise<{ id: string }> }) {
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

  async function updateAction(formData: FormData) {
    "use server";
    const data = {
      name: formData.get("name"),
      role: formData.get("role"),
      phoneNumber: formData.get("phoneNumber"),
    };
    await updateUser(id, data);
  }

  async function updateTenantAction(formData: FormData) {
    "use server";
    const tenantId = formData.get("tenantId") as string;
    const data = {
      name: formData.get("tenantName"),
      geminiKey: formData.get("geminiKey"),
      whatsappPhoneId: formData.get("whatsappPhoneId"),
      whatsappToken: formData.get("whatsappToken"),
      calendarId: formData.get("calendarId"),
    };
    await updateTenant(tenantId, data);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-[fade-in_0.3s_ease-out]">
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
              Configurações de <span className="text-brand-600">{user.name || "Usuário"}</span>
            </h1>
            <p className="text-surface-500 font-medium font-sans">
              Gerencie permissões, WhatsApp e conexões de API
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-accent-rose font-bold text-sm border border-accent-rose/20 rounded-xl hover:bg-accent-rose/5 transition-colors">
            <Trash2 className="w-4 h-4" />
            Remover Acesso
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings Form */}
        <div className="lg:col-span-2 space-y-8">
          <form action={updateAction} className="bg-white border border-surface-800 rounded-[2rem] p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-3 pb-2 border-b border-surface-800">
              <User className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-black text-surface-100 uppercase tracking-tight">Dados do Perfil</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Nome</label>
                <input
                  name="name"
                  defaultValue={user.name || ""}
                  className="w-full px-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-medium focus:ring-2 focus:ring-brand-600/20 transition-all font-sans"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">E-mail</label>
                <div className="px-4 py-3 bg-surface-950/10 border border-surface-800 rounded-xl text-surface-500 font-medium">
                  {user.email}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Cargo</label>
                <select
                  name="role"
                  defaultValue={user.role}
                  className="w-full px-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-medium focus:ring-2 focus:ring-brand-600/20 transition-all"
                >
                  <option value="USER">Usuário Regular</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="AGENT">Agente</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">WhatsApp</label>
                <input
                  name="phoneNumber"
                  defaultValue={user.phoneNumber || ""}
                  placeholder="+351 9..."
                  className="w-full px-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-medium focus:ring-2 focus:ring-brand-600/20 transition-all font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3 bg-surface-950 text-white font-black rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
            >
              <Save className="w-4 h-4" />
              Guardar Alterações
            </button>
          </form>

          {/* Profiles & Integrations Sections */}
          {user.tenants.map(({ tenant }) => (
            <div key={tenant.id} className="bg-white border border-surface-800 rounded-[2rem] p-8 shadow-sm space-y-8 animate-[slide-up_0.3s_ease-out]">
              <div className="flex items-center justify-between pb-2 border-b border-surface-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                    <User className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-black text-surface-100 uppercase tracking-tight">Atendente: <span className="text-brand-600">{tenant.name}</span></h2>
                </div>
                <div className="px-3 py-1 bg-surface-950/20 rounded-full text-[10px] font-black text-surface-500 uppercase tracking-widest">
                  ID: {tenant.id}
                </div>
              </div>

              <form action={updateTenantAction} className="space-y-6">
                <input type="hidden" name="tenantId" value={tenant.id} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Nome do Atendente (Exibição)</label>
                    <input
                      name="tenantName"
                      defaultValue={tenant.name || ""}
                      className="w-full px-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-medium focus:ring-2 focus:ring-brand-600/20 transition-all"
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
                      defaultValue={tenant.geminiKey || ""}
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
                      defaultValue={tenant.calendarId || ""}
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
                      defaultValue={tenant.whatsappPhoneId || ""}
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
                      defaultValue={tenant.whatsappToken || ""}
                      placeholder="EAA..."
                      className="w-full px-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 font-mono text-sm focus:ring-2 focus:ring-brand-600/20 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-surface-800">
                  <p className="text-[10px] text-surface-500 font-medium max-w-[200px]">Estes dados são sensíveis. Garanta que o token da Meta é permanente.</p>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white font-black rounded-xl hover:bg-brand-700 transition-all shadow-lg active:scale-95 text-xs uppercase tracking-widest"
                  >
                    <Save className="w-3 h-3" />
                    Sincronizar Atendente
                  </button>
                </div>
              </form>
            </div>
          ))}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white border border-surface-800 rounded-[2rem] p-6 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16" />
            <div className="relative flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-[2rem] bg-brand-600 text-white flex items-center justify-center text-2xl font-black shadow-xl shadow-brand-600/20">
                {(user.name || "U").substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-black text-surface-100">{user.name || "Usuário"}</h3>
                <span className="text-xs font-black text-brand-600 uppercase tracking-widest">{user.role}</span>
              </div>
              <div className="w-full pt-4 border-t border-surface-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-surface-500 font-bold">UID Firebase</span>
                  <span className="text-surface-100 font-mono font-bold truncate max-w-[100px]">{user.firebaseUid}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-surface-500 font-bold">Membro desde</span>
                  <span className="text-surface-100 font-bold">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-accent-amber/5 border border-accent-amber/20 rounded-[2rem] space-y-3">
            <div className="flex items-center gap-2 text-accent-amber">
              <SettingsIcon className="w-4 h-4 animate-spin-slow" />
              <span className="text-xs font-black uppercase tracking-widest">Aviso de Segurança</span>
            </div>
            <p className="text-xs text-surface-500 font-medium leading-relaxed font-sans">
              Alterar o cargo (Role) do usuário afetará imediatamente o que ele pode ver e fazer no RoboPulse.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
