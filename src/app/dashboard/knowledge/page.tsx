import { Brain, Upload, FileText } from "lucide-react";

export default function KnowledgePage() {
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

      {/* Upload Area */}
      <div className="rounded-2xl border-2 border-dashed border-surface-700/50 hover:border-brand-600/40 bg-surface-900/30 p-12 transition-all duration-300 cursor-pointer group">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-600/10 group-hover:bg-brand-600/20 flex items-center justify-center mx-auto mb-4 transition-colors">
            <Upload className="w-8 h-8 text-brand-400" />
          </div>
          <h3 className="text-lg font-semibold text-surface-200 mb-2">
            Arraste ficheiros ou clique para carregar
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
        </h3>
        <div className="text-center py-8 text-surface-500 text-sm">
          <Brain className="w-10 h-10 mx-auto mb-3 text-surface-600" />
          <p>Nenhum documento carregado ainda.</p>
          <p className="text-xs text-surface-600 mt-1">
            Carregue PDFs com informações do seu negócio para treinar a IA.
          </p>
        </div>
      </div>
    </div>
  );
}
