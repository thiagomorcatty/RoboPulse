"use client";

import { useAuth } from "@/context/auth-context";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Sun, 
  Moon, 
  Save, 
  Loader2, 
  CheckCircle,
  Security
} from "lucide-react";
import { useState } from "react";
import { updateAccount } from "./account-actions";

export default function AccountPage() {
  const { dbUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(dbUser?.darkMode || false);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!dbUser) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      phoneNumber: formData.get("phoneNumber"),
      darkMode: isDarkMode,
    };

    const result = await updateAccount(dbUser.id, data);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-[fade-in_0.3s_ease-out]">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-brand-600">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Gestão Pessoal</span>
        </div>
        <h1 className="text-4xl font-black text-surface-100 tracking-tight leading-none">
          Minha <span className="text-brand-600">Conta</span>
        </h1>
        <p className="text-surface-500 font-medium">
          Mantenha seus dados atualizados e gerencie suas preferências de segurança.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Basic Info */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-white border border-surface-800 rounded-[2.5rem] p-10 shadow-sm space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-surface-800">
              <User className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-black text-surface-100 uppercase tracking-tight">Dados Cadastrais</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Nome Completo</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-brand-600 transition-colors" />
                  <input
                    name="name"
                    defaultValue={dbUser?.name}
                    className="w-full pl-11 pr-5 py-4 bg-surface-950/5 border border-surface-800 rounded-2xl text-surface-100 font-bold focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">E-mail (Login)</label>
                <div className="relative group opacity-60">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <input
                    disabled
                    value={dbUser?.email}
                    className="w-full pl-11 pr-5 py-4 bg-surface-950/20 border border-surface-800 rounded-2xl text-surface-100 font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Telefone WhatsApp</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-brand-600 transition-colors" />
                  <input
                    name="phoneNumber"
                    defaultValue={dbUser?.phoneNumber || ""}
                    placeholder="Ex: 5511999999999"
                    className="w-full pl-11 pr-5 py-4 bg-surface-950/5 border border-surface-800 rounded-2xl text-surface-100 font-bold focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-surface-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {success && (
                  <div className="flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-widest animate-[fade-in_0.2s_ease-out]">
                    <CheckCircle className="w-5 h-5" />
                    Conta Atualizada
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-2xl transition-all duration-300 shadow-xl shadow-brand-600/20 disabled:opacity-70 flex items-center gap-3 uppercase tracking-widest text-xs"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Guardar Alterações
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Preferences & Appearance */}
        <div className="md:col-span-4 space-y-6">
          {/* Appearance Switch */}
          <div className="bg-white border border-surface-800 rounded-[2.5rem] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-surface-800">
              <Sun className="w-5 h-5 text-brand-600" />
              <h2 className="text-sm font-black text-surface-100 uppercase tracking-tight">Aparência</h2>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-surface-950/10 border border-surface-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setIsDarkMode(false)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-black text-[10px] uppercase",
                  !isDarkMode ? "bg-white text-surface-100 shadow-sm" : "text-surface-500 hover:bg-white/50"
                )}
              >
                <Sun className="w-4 h-4" />
                Light
              </button>
              <button
                type="button"
                onClick={() => setIsDarkMode(true)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-black text-[10px] uppercase",
                  isDarkMode ? "bg-surface-950 text-white shadow-sm" : "text-surface-500 hover:bg-white/50"
                )}
              >
                <Moon className="w-4 h-4" />
                Dark
              </button>
            </div>
            <p className="text-[10px] text-surface-500 font-medium px-1 text-center">
              Selecione o tema que mais lhe agrada para trabalhar.
            </p>
          </div>

          {/* Password Change placeholder */}
          <div className="bg-white border border-surface-800 rounded-[2.5rem] p-8 shadow-sm space-y-6 opacity-60">
            <div className="flex items-center gap-3 pb-4 border-b border-surface-800">
              <Lock className="w-5 h-5 text-surface-400" />
              <h2 className="text-sm font-black text-surface-100 uppercase tracking-tight">Segurança</h2>
            </div>
            <button
              type="button"
              disabled
              className="w-full py-4 border-2 border-dashed border-surface-800 text-surface-400 font-bold rounded-2xl text-[10px] uppercase tracking-widest cursor-not-allowed"
            >
              Alterar Senha
            </button>
            <p className="text-[10px] text-surface-400 text-center italic">
              A alteração de senha estará disponível em breve.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
