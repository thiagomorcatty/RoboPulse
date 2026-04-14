import { Users, Plus } from "lucide-react";

export default function TenantsPage() {
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

      {/* Empty State */}
      <div className="rounded-2xl bg-surface-900/60 border border-surface-800/50 p-12">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-800/40 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-surface-600" />
          </div>
          <h3 className="text-lg font-semibold text-surface-200 mb-2">
            Nenhum perfil configurado
          </h3>
          <p className="text-sm text-surface-500 max-w-md mx-auto">
            Crie o seu primeiro perfil para começar a treinar a IA. Cada perfil
            pode ter um segmento diferente (contabilidade, seguros,
            imobiliária).
          </p>
        </div>
      </div>
    </div>
  );
}
