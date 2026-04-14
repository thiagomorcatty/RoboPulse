"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Brain,
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  File,
  Search,
} from "lucide-react";

type Tenant = {
  id: string;
  name: string;
  slug: string;
  segment: string;
};

type Document = {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: string;
  createdAt: string;
  tenant: { name: string; slug: string };
};

const statusConfig: Record<
  string,
  { icon: typeof CheckCircle2; label: string; color: string }
> = {
  PENDING: {
    icon: Clock,
    label: "Pendente",
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  PROCESSING: {
    icon: Loader2,
    label: "A processar",
    color: "text-brand-600 bg-brand-50 border-brand-100",
  },
  READY: {
    icon: CheckCircle2,
    label: "Pronto",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  ERROR: {
    icon: AlertCircle,
    label: "Erro",
    color: "text-rose-600 bg-rose-50 border-rose-100",
  },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function KnowledgePage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tenants")
      .then((res) => res.json())
      .then((data) => {
        setTenants(data);
        if (data.length > 0) setSelectedTenant(data[0].id);
      })
      .catch(console.error);
  }, []);

  const fetchDocuments = useCallback(() => {
    const params = selectedTenant ? `?tenantId=${selectedTenant}` : "";
    fetch(`/api/documents${params}`)
      .then((res) => res.json())
      .then(setDocuments)
      .catch(console.error);
  }, [selectedTenant]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedTenant) return;

    setUploading(true);
    setUploadSuccess(null);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("tenantId", selectedTenant);
        formData.append("title", file.name.replace(/\.[^/.]+$/, ""));

        const res = await fetch("/api/documents", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Upload failed");
        }
      }

      setUploadSuccess(
        `${files.length} ficheiro(s) carregado(s) com sucesso!`
      );
      fetchDocuments();
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-10 animate-[fade-in_0.3s_ease-out]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-surface-100 tracking-tight">Base de Conhecimento</h1>
          <p className="text-surface-500 font-medium mt-1">
            Alimente a inteligência do seu robô com documentos e ficheiros.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Left Column: Upload & Selection */}
        <div className="xl:col-span-1 space-y-6">
          <div className="rounded-3xl bg-white border border-surface-800 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-surface-100 mb-6 flex items-center gap-2">
              <PlusIcon className="w-5 h-5 text-brand-600" /> Carregar Documentos
            </h3>
            
            <div className="space-y-4">
              <label className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                Selecionar Perfil de Destino
              </label>
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="w-full px-5 py-3.5 bg-surface-950 border border-surface-800 rounded-2xl text-sm font-bold text-surface-200 focus:outline-none focus:ring-4 focus:ring-brand-600/10 focus:border-brand-600 transition-all cursor-pointer"
              >
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
                className={`relative rounded-2xl border-2 border-dashed p-8 transition-all duration-300 cursor-pointer flex flex-col items-center text-center gap-4 group ${
                  dragOver
                    ? "border-brand-500 bg-brand-50"
                    : "border-surface-800 hover:border-brand-400 bg-white"
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  multiple
                  onChange={(e) => handleUpload(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  uploading ? "bg-amber-50" : "bg-brand-50 group-hover:scale-110"
                }`}>
                  {uploading ? (
                    <Loader2 className="w-7 h-7 text-amber-600 animate-spin" />
                  ) : (
                    <Upload className="w-7 h-7 text-brand-600" />
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-surface-100 mb-1">
                    {uploading ? "A carregar..." : "Clique ou arraste ficheiros"}
                  </h4>
                  <p className="text-[10px] text-surface-500 font-bold uppercase tracking-tight">
                    PDF, DOCX ou TXT até 10MB
                  </p>
                </div>
              </div>

              {uploadSuccess && (
                <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-700 animate-[fade-in_0.3s_ease-out]">
                  <CheckCircle2 className="w-4 h-4" />
                  {uploadSuccess}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="xl:col-span-2">
          <div className="rounded-3xl bg-white border border-surface-800 p-8 shadow-sm min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-surface-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" /> Documentos na Nuvem
                <span className="text-xs font-black px-2.5 py-1 bg-surface-950 text-surface-500 rounded-full border border-surface-800">
                  {documents.length}
                </span>
              </h3>
              
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 group-focus-within:text-brand-600" />
                <input 
                  type="text" 
                  placeholder="Pesquisar documentos..." 
                  className="pl-10 pr-4 py-2 bg-surface-950 border border-surface-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-600 transition-all w-64"
                />
              </div>
            </div>

            {documents.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                <Brain className="w-16 h-16 text-surface-600 mb-4" />
                <p className="text-surface-500 font-bold uppercase tracking-widest text-xs">Aguardando informações</p>
                <p className="text-xs text-surface-600 mt-2 font-medium">Os documentos vinculados a este perfil aparecerão aqui.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => {
                  const status = statusConfig[doc.status] || statusConfig.PENDING;
                  const StatusIcon = status.icon;

                  return (
                    <div
                      key={doc.id}
                      className="group flex items-center gap-5 px-6 py-5 rounded-2xl bg-surface-950/50 border border-surface-800 hover:border-brand-600/30 hover:bg-white transition-all duration-300 shadow-none hover:shadow-xl hover:shadow-brand-600/5"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white border border-surface-800 flex items-center justify-center shadow-sm">
                        <File className="w-6 h-6 text-brand-500" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-black text-surface-100 truncate group-hover:text-brand-600 transition-colors">
                            {doc.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-surface-500 uppercase tracking-tighter">
                          <span>{doc.fileName}</span>
                          <span className="text-surface-800">|</span>
                          <span>{formatFileSize(doc.fileSize)}</span>
                          <span className="text-surface-800">|</span>
                          <span>{doc.fileType}</span>
                        </div>
                      </div>

                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                        <StatusIcon className={`w-3.5 h-3.5 ${doc.status === "PROCESSING" ? "animate-spin" : ""}`} />
                        {status.label}
                      </div>

                      <div className="flex items-center gap-2">
                         <div className="p-2 rounded-lg text-surface-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer">
                            <TrashIcon className="w-4 h-4" />
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlusIcon(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function TrashIcon(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
