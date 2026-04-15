"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { LogIn, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!auth) {
        throw new Error("O Firebase não foi inicializado. Verifique as variáveis de ambiente no Vercel.");
      }

      console.log("Iniciando autenticação no Firebase...");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      console.log("Token obtido, gravando cookie...");
      
      // Define o cookie de sessão de forma robusta
      Cookies.set("session", token, { 
        expires: 7, 
        path: "/", 
        sameSite: "lax",
        secure: window.location.protocol === "https:"
      });
      
      console.log("Redirecionando para o dashboard...");
      // Usamos window.location.href para garantir que o Proxy/Middleware veja o cookie no próximo request
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Erro detalhado no Login:", err);
      let message = "Falha no login.";
      
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        message = "E-mail ou senha incorretos.";
      } else if (err.code === "auth/invalid-api-key") {
        message = "Configuração do Firebase inválida no servidor.";
      } else {
        message = err.message || "Ocorreu um erro inesperado.";
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md animate-[fade-in_0.5s_ease-out]">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-3xl bg-white shadow-2xl shadow-brand-600/10 mb-6 ring-1 ring-surface-800">
            <Image
              src="/logo.png"
              alt="RoboPulse"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <h1 className="text-3xl font-black text-surface-100 tracking-tight mb-2">
            Bem-vindo ao <span className="text-brand-600">RoboPulse</span>
          </h1>
          <p className="text-surface-500 font-medium">
            Entre na sua conta para gerenciar seus robôs
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white border border-surface-800 rounded-[2rem] p-8 shadow-xl shadow-brand-900/5 relative overflow-hidden">
          {/* Subtle decorative elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-50 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent-amber/5 rounded-full blur-3xl opacity-50" />

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {error && (
              <div className="p-4 rounded-2xl bg-accent-rose/5 border border-accent-rose/20 flex items-center gap-3 text-accent-rose text-sm font-bold animate-[shake_0.4s_ease-in-out]">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">
                E-mail Profissional
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-brand-600 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@empresa.com"
                  className="w-full pl-12 pr-4 py-4 bg-surface-950/50 border border-surface-800 rounded-2xl text-surface-100 placeholder:text-surface-600 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-surface-400">
                  Palavra-passe
                </label>
                <Link
                  href="#"
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  Esqueci-me
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-brand-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-surface-950/50 border border-surface-800 rounded-2xl text-surface-100 placeholder:text-surface-600 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-brand-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-2xl transition-all duration-300 shadow-lg shadow-brand-600/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100",
                loading && "bg-brand-600"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verificando credenciais...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar no Painel
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-surface-500 font-medium text-sm">
          Ainda não tem acesso?{" "}
          <Link
            href="#"
            className="text-brand-600 font-bold hover:text-brand-700 transition-colors"
          >
            Fale com o seu gestor
          </Link>
        </p>
      </div>
    </div>
  );
}
