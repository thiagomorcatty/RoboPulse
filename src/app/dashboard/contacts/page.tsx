"use client";

import { useAuth } from "@/context/auth-context";
import { 
  Users, 
  UserPlus, 
  Upload, 
  Search, 
  MoreVertical, 
  MessageCircle, 
  Trash2, 
  Pencil,
  FileText,
  X,
  CheckCircle,
  Loader2,
  AlertCircle,
  ChevronDown,
  PlusCircle
} from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { createContact, deleteContact, importContacts } from "./contact-actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const { user, dbUser, activeTenant, setActiveTenant } = useAuth();

  // Filtro de contatos (Mock enquanto não buscamos do banco em tempo real via hooks)
  const contacts = dbUser?.contacts || [];
  const filteredContacts = contacts.filter((c: any) => 
    (c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.waId?.includes(searchTerm))
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n");
      const preview = lines.slice(1).map(line => {
        const [name, waId, email] = line.split(/[,;]/);
        if (!waId) return null;
        return { name: name?.trim(), waId: waId?.trim(), email: email?.trim() };
      }).filter(Boolean);
      
      setCsvPreview(preview);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!dbUser?.id || csvPreview.length === 0) return;
    setImporting(true);
    const result = await importContacts(dbUser.id, csvPreview);
    if (result.success) {
      window.location.reload();
    }
    setImporting(false);
  };

  const handleCreateContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!dbUser?.id || !activeTenant?.id) return;

    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      waId: formData.get("waId"),
      email: formData.get("email"),
      tenantId: activeTenant.id
    };

    const result = await createContact(dbUser.id, data);
    if (result.success) {
      setShowCreateModal(false);
      window.location.reload();
    } else {
      alert("Erro ao criar contato: " + result.error);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-8 animate-[fade-in_0.3s_ease-out]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-600">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Base de Clientes</span>
          </div>
          <h1 className="text-4xl font-black text-surface-100 tracking-tight leading-none">
            Meus <span className="text-brand-600">Contatos</span>
          </h1>
          <p className="text-surface-500 font-medium font-sans">
            Gerencie sua lista de leads e contatos para disparos e atendimento.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Profile Switcher Local */}
          {!loading && dbUser?.tenants && dbUser.tenants.length > 0 && (
            <div className="relative group mr-2">
              <button className="flex items-center gap-2 px-4 py-3 bg-white border border-surface-800 rounded-2xl text-xs font-bold text-surface-500 hover:border-brand-600 transition-all shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
                  Atendente: <span className="text-brand-600">{activeTenant?.name || "Selecionar"}</span>
                </div>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-surface-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1.5 border-t-4 border-t-brand-600">
                {dbUser.tenants.map((tu: any) => (
                  <button
                    key={tu.tenant.id}
                    onClick={() => setActiveTenant(tu.tenant)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors mb-1",
                      activeTenant?.id === tu.tenant.id 
                        ? "bg-brand-50 text-brand-600" 
                        : "text-surface-600 hover:bg-surface-950/10"
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
                  + Novo Atendente
                </Link>
              </div>
            </div>
          )}

          <button 
            onClick={() => setShowImport(true)}
            className="px-6 py-3 bg-white border border-surface-800 text-surface-100 font-bold rounded-2xl hover:bg-surface-950/20 transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Importar CSV
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-brand-600 text-white font-black rounded-2xl hover:bg-brand-700 shadow-lg shadow-brand-600/20 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Novo Contato
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500 group-focus-within:text-brand-600 transition-colors" />
        <input
          type="text"
          placeholder="Pesquisar por nome ou número..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-14 pr-6 py-5 bg-white border border-surface-800 rounded-[2rem] text-surface-100 font-medium shadow-sm transition-all focus:ring-4 focus:ring-brand-500/5 outline-none"
        />
      </div>

      {/* Contacts List */}
      <div className="bg-white border border-surface-800 rounded-[2.5rem] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-950/20 border-b border-surface-800">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-surface-400">Contato</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-surface-400">WhatsApp / ID</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-surface-400">Status</th>
              <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-surface-400">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact: any) => (
                <tr key={contact.id} className="hover:bg-brand-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 font-black text-xs">
                        {contact.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-black text-surface-100">{contact.name}</div>
                        <div className="text-xs text-surface-500 font-medium">{contact.email || "Sem e-mail"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-mono font-bold text-surface-100">{contact.waId}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-[10px] font-black uppercase text-surface-500">Ativo</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => router.push(`/dashboard/inbox?to=${contact.waId}`)}
                        className="p-2.5 text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                        title="Enviar Mensagem"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 text-surface-400 hover:bg-surface-950/20 rounded-xl transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={async () => {
                          if (confirm("Deseja eliminar este contato?")) {
                            await deleteContact(contact.id);
                            window.location.reload();
                          }
                        }}
                        className="p-2.5 text-accent-rose hover:bg-accent-rose/10 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 text-surface-400">
                    <Users className="w-12 h-12 opacity-20" />
                    <p className="font-bold">Nenhum contato encontrado.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals Section */}
      {showImport && (
        // ... (existing import modal code)
        <div className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-[fade-in_0.2s_ease-out]">
          <div className="bg-white border border-surface-800 rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-8 border-b border-surface-800 flex items-center justify-between bg-surface-950/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-surface-100 uppercase tracking-tight">Importar Lista (CSV)</h3>
                  <p className="text-[10px] text-surface-500 font-bold uppercase tracking-widest">Siga o padrão: Nome, WhatsApp, Email</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowImport(false); setCsvPreview([]); }}
                className="p-2 hover:bg-surface-950/20 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-surface-500" />
              </button>
            </div>

            <div className="p-8 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
              {csvPreview.length === 0 ? (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-surface-800 rounded-3xl p-12 hover:border-brand-600/50 hover:bg-brand-50/30 transition-all cursor-pointer group">
                  <FileText className="w-12 h-12 text-surface-400 group-hover:text-brand-600 transition-colors mb-4" />
                  <p className="text-sm font-black text-surface-100">Arraste seu arquivo CSV ou clique para selecionar</p>
                  <p className="text-xs text-surface-500 mt-1">UTF-8 .csv (máximo 10MB)</p>
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-black uppercase text-surface-400 px-2">
                    <span>Pré-visualização ({csvPreview.length} contatos)</span>
                    <button onClick={() => setCsvPreview([])} className="text-accent-rose hover:underline">Trocar arquivo</button>
                  </div>
                  <div className="border border-surface-800 rounded-2xl overflow-hidden bg-surface-950/20">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-surface-800 bg-surface-950/30">
                          <th className="px-4 py-3 font-black text-surface-500 uppercase">Nome</th>
                          <th className="px-4 py-3 font-black text-surface-500 uppercase">Número</th>
                          <th className="px-4 py-3 font-black text-surface-500 uppercase">Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvPreview.slice(0, 5).map((row, i) => (
                          <tr key={i} className="border-b border-surface-800/50">
                            <td className="px-4 py-3 font-bold text-surface-100">{row.name}</td>
                            <td className="px-4 py-3 font-mono text-surface-500">{row.waId}</td>
                            <td className="px-4 py-3 text-surface-500">{row.email || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {csvPreview.length > 5 && (
                      <div className="px-4 py-3 text-[10px] text-surface-500 font-bold bg-white text-center">
                        ... e mais {csvPreview.length - 5} contatos
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="bg-accent-amber/5 border border-accent-amber/10 rounded-2xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-accent-amber shrink-0" />
                <p className="text-[10px] text-surface-500 font-medium leading-relaxed">
                  Certifique-se de que os números de telefone incluam o código do país (ex: 55 para Brasil, 351 para Portugal).
                </p>
              </div>
            </div>

            <div className="p-8 border-t border-surface-800 bg-surface-950/5 flex items-center justify-end gap-4">
              <button 
                onClick={() => { setShowImport(false); setCsvPreview([]); }}
                className="px-6 py-3 text-xs font-black uppercase text-surface-500 hover:text-surface-100 transition-colors"
              >
                Cancelar
              </button>
              <button 
                disabled={csvPreview.length === 0 || importing}
                onClick={handleImport}
                className="px-10 py-4 bg-brand-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-brand-700 shadow-xl shadow-brand-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Confirmar Importação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-[fade-in_0.2s_ease-out]">
          <div className="bg-white border border-surface-800 rounded-[2.5rem] w-full max-w-[500px] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-surface-800 flex items-center justify-between bg-surface-950/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-surface-100 uppercase tracking-tight">Novo Contato</h3>
                  <p className="text-[10px] text-surface-500 font-bold uppercase tracking-widest">Cadastro manual de lead</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-surface-950/20 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-surface-500" />
              </button>
            </div>

            <form onSubmit={handleCreateContact}>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">Nome Completo</label>
                    <input
                      name="name"
                      required
                      placeholder="Ex: João Silva"
                      className="w-full px-4 py-4 bg-surface-950/20 border border-surface-800 rounded-2xl text-surface-100 font-medium focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">WhatsApp (com DDD)</label>
                    <input
                      name="waId"
                      required
                      placeholder="Ex: 5511999999999"
                      className="w-full px-4 py-4 bg-surface-950/20 border border-surface-800 rounded-2xl text-surface-100 font-mono font-bold focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-surface-400 ml-1">E-mail (Opcional)</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="joao@email.com"
                      className="w-full px-4 py-4 bg-surface-950/20 border border-surface-800 rounded-2xl text-surface-100 font-medium focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 bg-brand-50 border border-brand-100 rounded-2xl flex gap-3 italic">
                  <div className="text-[10px] text-brand-600 font-medium">
                    O contato será vinculado ao atendente <strong>{activeTenant?.name}</strong>.
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-surface-800 bg-surface-950/5 flex items-center justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 text-xs font-black uppercase text-surface-500 hover:text-surface-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="px-10 py-4 bg-brand-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-brand-700 shadow-xl shadow-brand-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Salvar Contato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
