"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Brain,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
    label: "Perfis",
    href: "/dashboard/tenants",
    icon: Users,
  },
  {
    label: "Base de Conhecimento",
    href: "/dashboard/knowledge",
    icon: Brain,
  },
  {
    label: "Definições",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-surface-900 border-r border-surface-800/50 flex flex-col z-40 transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-16 border-b border-surface-800/50 flex items-center px-5 gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-surface-50 tracking-tight whitespace-nowrap">
              RoboPulse
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-brand-600/15 text-brand-400 shadow-sm"
                    : "text-surface-400 hover:text-surface-200 hover:bg-surface-800/60"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive ? "text-brand-400" : "text-surface-500"
                  )}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-surface-800/50">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-surface-500 hover:text-surface-300 hover:bg-surface-800/60 transition-all duration-200 text-sm"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Recolher</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          collapsed ? "ml-[72px]" : "ml-64"
        )}
      >
        {/* Top Bar */}
        <header className="h-16 border-b border-surface-800/50 bg-surface-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center px-8">
          <h2 className="text-sm font-medium text-surface-400">
            {navItems.find(
              (item) =>
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href))
            )?.label || "Dashboard"}
          </h2>
        </header>

        {/* Page Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
