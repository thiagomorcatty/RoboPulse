"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Brain,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserPlus,
  UserCircle,
  BookOpen,
  Link as LinkIcon,
  Contact2,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// v1.1 - Atualização do menu de gestão de usuários
const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Conversas",
    href: "/dashboard/inbox",
    icon: MessageSquare,
  },
  {
    label: "Contatos",
    href: "/dashboard/contacts",
    icon: Contact2,
  },
  {
    label: "Perfil do Atendente",
    href: "/dashboard/persona",
    icon: UserCircle,
  },
  {
    label: "Base de Conhecimento",
    href: "/dashboard/knowledge",
    icon: BookOpen,
  },
  {
    label: "Integrações",
    href: "/dashboard/integrations",
    icon: LinkIcon,
  },
  {
    label: "Lista de Usuários",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    label: "Cadastro de Usuários",
    href: "/dashboard/users/create",
    icon: UserPlus,
  },
  {
    label: "Definições", // Sistema para Admin, Pessoal para User
    href: "/dashboard/settings", 
    icon: Settings,
  },
  {
    label: "Minha Conta",
    href: "/dashboard/account",
    icon: UserCircle,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, dbUser } = useAuth();
  const router = useRouter();

  // Filtragem dinâmica do menu baseada no papel do usuário
  const isAdmin = dbUser?.role === "ADMIN" || dbUser?.role === "SUPER_ADMIN";
  
  const filteredNavItems = navItems.filter((item) => {
    // Itens exclusivos do Admin (Gestão de Sistema e Outros Usuários)
    if (["Lista de Usuários", "Cadastro de Usuários"].includes(item.label)) {
      return isAdmin;
    }

    // Itens exclusivos do Usuário (Operação e Configuração Pessoal)
    if (["Conversas", "Contatos", "Perfil do Atendente", "Base de Conhecimento", "Integrações", "Minha Conta"].includes(item.label)) {
      return !isAdmin;
    }

    // Dashboard e Definições aparecem para todos (embora o conteúdo de Definições mude internamente)
    return true;
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Cookies.remove("session");
      // Forçar recarregamento completo para o Proxy limpar a sessão
      window.location.href = "/login";
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex font-sans">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-white border-r border-surface-800 flex flex-col z-40 transition-all duration-300 shadow-xl shadow-brand-900/5",
          collapsed ? "w-[76px]" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-20 border-b border-surface-800 flex items-center px-4 gap-3 bg-white">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm ring-1 ring-surface-800">
            <Image
              src="/logo.png"
              alt="RoboPulse"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col animate-[fade-in_0.2s_ease-out]">
              <span className="text-base font-bold tracking-tight whitespace-nowrap text-surface-200">
                Robo<span className="text-brand-600">Pulse</span>
              </span>
              <span className="text-[10px] text-surface-500 font-bold uppercase tracking-wider -mt-0.5">
                Automação WhatsApp
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          {filteredNavItems.map((item) => {
            // Lógica para evitar que /dashboard/users/create ative também /dashboard/users
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all duration-200 group relative",
                  isActive
                    ? "bg-brand-50 text-brand-600 shadow-sm shadow-brand-600/5"
                    : "text-surface-500 hover:text-brand-600 hover:bg-brand-50/50"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
                    isActive ? "text-brand-600" : "text-surface-600 group-hover:text-brand-500"
                  )}
                />
                {!collapsed && <span>{item.label}</span>}
                {isActive && !collapsed && (
                  <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-brand-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Collapse */}
        <div className="p-4 border-t border-surface-800 bg-surface-950/20">
          {!collapsed && (
            <div className="mb-4 px-2 py-3 rounded-xl bg-white border border-surface-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                {user?.email?.substring(0, 2) || "RP"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-surface-100 truncate">
                  {user?.displayName || user?.email?.split("@")[0] || "Utilizador"}
                </span>
                <span className="text-[10px] text-surface-500 truncate">Online</span>
              </div>
              <button 
                onClick={handleLogout}
                className="ml-auto text-surface-400 hover:text-accent-rose transition-colors"
                title="Sair do sistema"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-surface-500 hover:text-brand-600 hover:bg-white transition-all duration-200 text-sm font-bold"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Recolher Menu</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300 min-h-screen",
          collapsed ? "ml-[76px]" : "ml-64"
        )}
      >
        {/* Top Bar */}
        <header className="h-20 border-b border-surface-800 bg-white/70 backdrop-blur-xl sticky top-0 z-30 flex items-center px-10 justify-between">
          <div className="flex items-center gap-6">
            <h2 className="text-base font-bold text-surface-100">
              {navItems.find(
                (item) =>
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href))
              )?.label || "Dashboard"}
            </h2>

            {/* Profile Switcher (Apenas para Usuários) */}
            {!isAdmin && dbUser?.tenants && dbUser.tenants.length > 0 && (
              <div className="flex items-center gap-2 pl-6 border-l border-surface-800">
                <span className="text-[10px] font-black uppercase tracking-widest text-surface-400">Atendente:</span>
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 border border-brand-200 rounded-lg text-xs font-bold text-brand-600 hover:bg-brand-100 transition-all">
                    {activeTenant?.name || "Selecionar Perfil"}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-surface-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1.5">
                    {dbUser.tenants.map((tu: any) => (
                      <button
                        key={tu.tenant.id}
                        onClick={() => {
                          const { setActiveTenant } = require("@/context/auth-context").useAuth();
                          setActiveTenant(tu.tenant);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                          activeTenant?.id === tu.tenant.id 
                            ? "bg-brand-50 text-brand-600" 
                            : "text-surface-600 hover:bg-surface-950/20"
                        )}
                      >
                        {tu.tenant.name}
                      </button>
                    ))}
                    <div className="h-px bg-surface-800 my-1" />
                    <Link
                      href="/dashboard/persona"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    >
                      + Criar Novo Perfil
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 rounded-lg bg-accent-amber/10 border border-accent-amber/20 text-[10px] font-bold text-accent-amber uppercase tracking-wider">
              {isAdmin ? "Painel Admin" : "Plano Premium"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-10 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
