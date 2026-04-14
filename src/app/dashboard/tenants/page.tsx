import { prisma } from "@/lib/db";
import {
  Users,
  Plus,
  MessageSquare,
  FileText,
  Building2,
  Shield,
  Calculator,
} from "lucide-react";

const segmentIcons: Record<string, typeof Building2> = {
  imobiliária: Building2,
  seguros: Shield,
  contabilidade: Calculator,
};

const segmentColors: Record<string, string> = {
  imobiliária: "text-accent-sky bg-accent-sky/10",
  seguros: "text-accent-amber bg-accent-amber/10",
  contabilidade: "text-brand-400 bg-brand-600/10",
};

export default async function TenantsPage() {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    include: {
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
    <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-50">Perfis</h1>
          <p className="text-surface-400 mt-1">
            Gerir os perfis de negócio e as personas da IA.
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-brand-600/25">
          <Plus className="w-4 h-4" />
          Novo Perfil
        </button>
      </div>

      {tenants.length === 0 ? (
        <div className="rounded-2xl bg-surface-900/60 border border-surface-800/50 p-12">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-800/40 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-surface-600" />
            </div>
            <h3 className="text-lg font-semibold text-surface-200 mb-2">
              Nenhum perfil configurado
            </h3>
            <p className="text-sm text-surface-500 max-w-md mx-auto">
              Crie o seu primeiro perfil para começar a treinar a IA.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {tenants.map((tenant) => {
            const IconComponent =
              segmentIcons[tenant.segment] || Building2;
            const colorClasses =
              segmentColors[tenant.segment] ||
              "text-surface-400 bg-surface-700/30";

            return (
              <div
                key={tenant.id}
                className="group rounded-2xl bg-surface-900/60 border border-surface-800/50 hover:border-brand-600/30 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-brand-600/5"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorClasses}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-surface-50 group-hover:text-brand-300 transition-colors">
                        {tenant.name}
                      </h3>
                      <span className="text-xs font-medium text-surface-500 capitalize">
                        {tenant.segment}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      tenant.isActive
                        ? "bg-brand-600/10 text-brand-400"
                        : "bg-accent-rose/10 text-accent-rose"
                    }`}
                  >
                    {tenant.isActive ? "Ativo" : "Inativo"}
                  </span>
                </div>

                {/* Description */}
                {tenant.description && (
                  <p className="text-sm text-surface-400 mb-5 line-clamp-2">
                    {tenant.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 pt-4 border-t border-surface-800/50">
                  <div className="flex items-center gap-1.5 text-xs text-surface-500">
                    <Users className="w-3.5 h-3.5" />
                    <span>{tenant._count.contacts} contactos</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-surface-500">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{tenant._count.conversations} conversas</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-surface-500">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{tenant._count.documents} docs</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
