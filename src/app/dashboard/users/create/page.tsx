"use client";

import { useState } from "react";
import { createUser } from "../user-actions";
import { UserPlus, Mail, Lock, User, Shield, Smartphone, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createUser(formData);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/users");
      }, 2000);
    } else {
      setError(result.error || "Erro ao criar usuário");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 animate-[scale-in_0.3s_ease-out]">
        <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 shadow-xl shadow-brand-600/10">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-surface-100">Usuário Criado!</h2>
        <p className="text-surface-500 font-medium">Redirecionando para a lista...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-[fade-in_0.3s_ease-out]">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/dashboard/users"
          className="flex items-center gap-2 text-surface-500 hover:text-brand-600 font-bold text-sm transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Lista
        </Link>
        <div>
          <h1 className="text-3xl font-black text-surface-100 tracking-tight">
            Criar <span className="text-brand-600">Novo Usuário</span>
          </h1>
          <p className="text-surface-500 font-medium">
            Cadastre um novo membro para acessar o painel RoboPulse
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-surface-800 rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-accent-rose/5 border border-accent-rose/20 text-accent-rose text-sm font-bold flex items-center gap-3">
            <Shield className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Nome Completo */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">
                Nome Completo
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-brand-600 transition-colors" />
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Nome do utilizador"
                  className="w-full pl-12 pr-4 py-4 bg-surface-950/20 border border-surface-800 rounded-2xl text-surface-100 placeholder:text-surface-600 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all"
                />
              </div>
            </div>

            {/* Role/Papel */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">
                Papel / Permissão
              </label>
              <div className="relative group">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-brand-600 transition-colors z-10" />
                <select
                  name="role"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-surface-950/20 border border-surface-800 rounded-2xl text-surface-100 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all appearance-none relative"
                >
                  <option value="USER">Usuário Regular</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="AGENT">Agente</option>
                </select>
              </div>
            </div>

            {/* E-mail */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">
                E-mail
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-brand-600 transition-colors" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="exemplo@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-surface-950/20 border border-surface-800 rounded-2xl text-surface-100 placeholder:text-surface-600 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all"
                />
              </div>
            </div>

            {/* Senha Inicial */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">
                Senha Inicial
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-brand-600 transition-colors" />
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-12 pr-4 py-4 bg-surface-950/20 border border-surface-800 rounded-2xl text-surface-100 placeholder:text-surface-600 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all"
                />
              </div>
            </div>

            {/* WhatsApp (Opcional) */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">
                Número WhatsApp (Opcional)
              </label>
              <div className="relative group">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-brand-600 transition-colors" />
                <input
                  name="phoneNumber"
                  type="text"
                  placeholder="+351 9XX XXX XXX"
                  className="w-full pl-12 pr-4 py-4 bg-surface-950/20 border border-surface-800 rounded-2xl text-surface-100 placeholder:text-surface-600 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-2xl transition-all duration-300 shadow-lg shadow-brand-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Criando Usuário...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Concluir Cadastro
                </>
              )}
            </button>
            <Link
              href="/dashboard/users"
              className="px-8 py-4 bg-white border border-surface-800 text-surface-400 font-bold rounded-2xl hover:bg-surface-950/5 transition-all"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
