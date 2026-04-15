import { prisma } from "@/lib/db";
import {
  Users,
  Plus,
  MessageSquare,
  FileText,
  Building2,
  Shield,
  Calculator,
  ChevronRight,
} from "lucide-react";

const segmentIcons: Record<string, typeof Building2> = {
  imobiliária: Building2,
  seguros: Shield,
  contabilidade: Calculator,
};

const segmentColors: Record<string, string> = {
  imobiliária: "text-brand-600 bg-brand-50 border-brand-100",
  seguros: "text-accent-amber bg-amber-50 border-amber-100",
  contabilidade: "text-accent-sky bg-sky-50 border-sky-100",
};

export default async function TenantsPage() {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      segment: true,
      description: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          contacts: true,
          conversations: true,
          documents: true,
        },
      },
    },
  });

  return (
    <div className="space-y-10 animate-[fade-in_0.3s_ease-out]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-surface-100 tracking-tight">Perfis de Negócio</h1>
          <p className="text-surface-500 font-medium mt-1">
            Gerencie as personas da IA e configurações de cada cliente.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-brand-600/25 hover:-translate-y-1">
          <Plus className="w-5 h-5 stroke-[3]" />
          Criar Novo Perfil
        </button>
      </div>

      {tenants.length === 0 ? (
        <div className="rounded-[2.5rem] bg-white border border-surface-800 p-20 shadow-sm">
          <div className="text-center">
            <div className="w-24 h-24 rounded-3xl bg-surface-950 flex items-center justify-center mx-auto mb-6 border border-surface-800">
              <Users className="w-10 h-10 text-surface-600" />
            </div>
            <h3 className="text-2xl font-bold text-surface-100 mb-2">
              Nenhum perfil encontrado
            </h3>
            <p className="text-surface-500 font-medium max-w-md mx-auto">
              Comece criando o primeiro perfil de atendimento para o seu negócio.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tenants.map((tenant) => {
            const IconComponent =
              segmentIcons[tenant.segment] || Building2;
            const colorClasses =
              segmentColors[tenant.segment] ||
              "text-surface-600 bg-surface-950 border-surface-800";

            return (
              <div
                key={tenant.id}
                className="group rounded-[2rem] bg-white border border-surface-800 hover:border-brand-300 p-8 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-brand-600/10 flex flex-col relative overflow-hidden"
              >
                {/* Segment Floating Label */}
                <div className="absolute top-8 right-8">
                  <span
                    className={`text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1.5 rounded-full border ${
                      tenant.isActive
                        ? "bg-brand-50 text-brand-600 border-brand-100"
                        : "bg-accent-rose/10 text-accent-rose border-accent-rose/20"
                    }`}
                  >
                    {tenant.isActive ? "Ativo" : "Inativo"}
                  </span>
                </div>

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm ${colorClasses}`}
                  >
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0 pr-16">
                    <h3 className="text-lg font-bold text-surface-100 group-hover:text-brand-600 transition-colors truncate">
                      {tenant.name}
                    </h3>
                    <div className="text-xs font-bold text-surface-500 capitalize tracking-wide">
                      Setor: {tenant.segment}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {tenant.description && (
                  <p className="text-sm text-surface-500 mb-8 line-clamp-3 font-medium flex-1">
                    {tenant.description}
                  </p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 py-4 border-t border-surface-800 mt-auto">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-black text-surface-100">{tenant._count.contacts}</span>
                    <span className="text-[10px] font-bold text-surface-600 uppercase">Clientes</span>
                  </div>
                  <div className="flex flex-col items-center border-x border-surface-800">
                    <span className="text-lg font-black text-surface-100">{tenant._count.conversations}</span>
                    <span className="text-[10px] font-bold text-surface-600 uppercase">Mensagens</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-black text-surface-100">{tenant._count.documents}</span>
                    <span className="text-[10px] font-bold text-surface-600 uppercase">Docs</span>
                  </div>
                </div>

                {/* Action Link */}
                <div className="mt-4 pt-4 border-t border-surface-800 flex items-center justify-center text-xs font-black text-brand-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span className="flex items-center gap-1 cursor-pointer">
                    VER CONFIGURAÇÕES COMPLETAS <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
