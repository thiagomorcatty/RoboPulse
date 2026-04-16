import { prisma } from "@/lib/db";
import { Users, UserPlus, Search, Settings, Trash2, Mail, Shield, Smartphone } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 animate-[fade-in_0.3s_ease-out]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-surface-100 tracking-tight">
            Gestão de <span className="text-brand-600">Usuários</span>
          </h1>
          <p className="text-surface-500 font-medium">
            Visualize e gerencie todos os acessos ao sistema
          </p>
        </div>
        <Link
          href="/dashboard/users/create"
          className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-brand-600/20 active:scale-95 w-fit"
        >
          <UserPlus className="w-5 h-5" />
          Novo Usuário
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-surface-800 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-surface-400 uppercase tracking-wider">Total</span>
          </div>
          <div className="text-3xl font-black text-surface-200">{users.length}</div>
        </div>
        <div className="p-6 bg-white border border-surface-800 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 rounded-lg bg-accent-amber/10 text-accent-amber">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-surface-400 uppercase tracking-wider">Admins</span>
          </div>
          <div className="text-3xl font-black text-surface-200">
            {users.filter(u => u.role === "ADMIN" || u.role === "SUPER_ADMIN").length}
          </div>
        </div>
        <div className="p-6 bg-white border border-surface-800 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 rounded-lg bg-accent-indigo/10 text-accent-indigo">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-surface-400 uppercase tracking-wider">Com WhatsApp</span>
          </div>
          <div className="text-3xl font-black text-surface-200">
            {users.filter(u => u.phoneNumber).length}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-surface-800 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-surface-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-brand-600 transition-colors" />
            <input
              type="text"
              placeholder="Pesquisar usuários..."
              className="w-full pl-12 pr-4 py-2.5 bg-surface-950/20 border border-surface-800 rounded-xl text-surface-100 placeholder:text-surface-500 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-950/10">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-surface-400 border-b border-surface-800">Usuário</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-surface-400 border-b border-surface-800">Papel</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-surface-400 border-b border-surface-800">WhatsApp</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-surface-400 border-b border-surface-800">Criado em</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-surface-400 border-b border-surface-800 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-brand-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/users/${u.id}`} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-black text-sm uppercase">
                        {(u.name || "U").substring(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-surface-100">{u.name || "Usuário sem Nome"}</span>
                        <div className="flex items-center gap-1 text-[11px] text-surface-500 font-medium">
                          <Mail className="w-3 h-3" />
                          {u.email}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                      u.role === "ADMIN" || u.role === "SUPER_ADMIN" 
                        ? "bg-accent-amber/10 text-accent-amber" 
                        : "bg-surface-950/20 text-surface-400"
                    )}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-surface-300">
                      {u.phoneNumber || "Não configurado"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-surface-500">
                      {new Date(u.createdAt).toLocaleDateString("pt-PT")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/users/${u.id}`}
                        className="p-2 text-surface-400 hover:text-brand-600 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-surface-800"
                        title="Configurar & Monitorar"
                      >
                        <Settings className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-2 text-surface-400 hover:text-accent-rose hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-surface-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
