"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Brain,
  Upload,
  FileText,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  File,
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
    color: "text-accent-amber bg-accent-amber/10",
  },
  PROCESSING: {
    icon: Loader2,
    label: "A processar",
    color: "text-accent-sky bg-accent-sky/10",
  },
  READY: {
    icon: CheckCircle2,
    label: "Pronto",
    color: "text-brand-400 bg-brand-600/10",
  },
  ERROR: {
    icon: AlertCircle,
    label: "Erro",
    color: "text-accent-rose bg-accent-rose/10",
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

  // Fetch tenants
  useEffect(() => {
    fetch("/api/tenants")
      .then((res) => res.json())
      .then((data) => {
        setTenants(data);
        if (data.length > 0) setSelectedTenant(data[0].id);
      })
      .catch(console.error);
  }, []);

  // Fetch documents
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

  // Upload handler
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
      setUploadSuccess(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-50">
            Base de Conhecimento
          </h1>
          <p className="text-surface-400 mt-1">
            Carregue documentos para treinar a IA do seu negócio.
          </p>
        </div>
      </div>

      {/* Tenant Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-surface-300">
          Perfil:
        </label>
        <select
          value={selectedTenant}
          onChange={(e) => setSelectedTenant(e.target.value)}
          className="px-4 py-2.5 bg-surface-800/60 border border-surface-700/30 rounded-xl text-sm text-surface-200 focus:outline-none focus:border-brand-600/50 transition-colors min-w-[250px]"
        >
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.name} ({tenant.segment})
            </option>
          ))}
        </select>
      </div>

      {/* Upload Success Message */}
      {uploadSuccess && (
        <div className="flex items-center gap-3 px-4 py-3 bg-brand-600/10 border border-brand-600/20 rounded-xl text-sm text-brand-300 animate-[fade-in_0.3s_ease-out]">
          <CheckCircle2 className="w-5 h-5 text-brand-400" />
          {uploadSuccess}
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleUpload(e.dataTransfer.files);
        }}
        className={`relative rounded-2xl border-2 border-dashed p-12 transition-all duration-300 cursor-pointer group ${
          dragOver
            ? "border-brand-500 bg-brand-600/10"
            : "border-surface-700/50 hover:border-brand-600/40 bg-surface-900/30"
        }`}
      >
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || !selectedTenant}
        />
        <div className="text-center">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${
              uploading
                ? "bg-accent-amber/10"
                : "bg-brand-600/10 group-hover:bg-brand-600/20"
            }`}
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 text-accent-amber animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-brand-400" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-surface-200 mb-2">
            {uploading
              ? "A carregar ficheiros..."
              : "Arraste ficheiros ou clique para carregar"}
          </h3>
          <p className="text-sm text-surface-500">
            Suporta PDF, DOCX e TXT. Máximo 10MB por ficheiro.
          </p>
        </div>
      </div>

      {/* Documents List */}
      <div className="rounded-2xl bg-surface-900/60 border border-surface-800/50 p-6">
        <h3 className="text-lg font-semibold text-surface-50 flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-surface-400" />
          Documentos Carregados
          {documents.length > 0 && (
            <span className="text-xs font-normal text-surface-500 bg-surface-800/60 px-2.5 py-1 rounded-full">
              {documents.length}
            </span>
          )}
        </h3>

        {documents.length === 0 ? (
          <div className="text-center py-8 text-surface-500 text-sm">
            <Brain className="w-10 h-10 mx-auto mb-3 text-surface-600" />
            <p>Nenhum documento carregado para este perfil.</p>
            <p className="text-xs text-surface-600 mt-1">
              Carregue PDFs com informações do seu negócio para treinar a IA.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => {
              const status = statusConfig[doc.status] || statusConfig.PENDING;
              const StatusIcon = status.icon;

              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-surface-800/30 border border-surface-800/30 hover:border-surface-700/50 transition-all duration-200"
                >
                  {/* File Icon */}
                  <div className="w-10 h-10 rounded-xl bg-surface-700/30 flex items-center justify-center flex-shrink-0">
                    <File className="w-5 h-5 text-surface-400" />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-200 truncate">
                      {doc.title}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-surface-500">
                        {doc.fileName}
                      </span>
                      <span className="text-xs text-surface-600">•</span>
                      <span className="text-xs text-surface-500">
                        {formatFileSize(doc.fileSize)}
                      </span>
                      <span className="text-xs text-surface-600">•</span>
                      <span className="text-xs text-surface-500 uppercase">
                        {doc.fileType}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}
                  >
                    <StatusIcon
                      className={`w-3.5 h-3.5 ${doc.status === "PROCESSING" ? "animate-spin" : ""}`}
                    />
                    {status.label}
                  </div>

                  {/* Tenant badge */}
                  <span className="text-xs text-surface-500 bg-surface-800/60 px-2 py-1 rounded-lg hidden lg:block">
                    {doc.tenant.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
