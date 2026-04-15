"use client";

import { useAuth } from "@/context/auth-context";
import { 
  MessageSquare, 
  Search, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  User,
  Clock,
  Check,
  CheckCheck,
  Loader2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getConversations, getMessages, sendMessage } from "./inbox-actions";
import { cn } from "@/lib/utils";

export default function InboxPage() {
  const { dbUser, activeTenant } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carregar conversas quando o perfil ativo mudar
  useEffect(() => {
    async function loadConversations() {
      if (!activeTenant) return;
      setLoading(true);
      const data = await getConversations(activeTenant.id);
      setConversations(data);
      setLoading(false);
    }
    loadConversations();
  }, [activeTenant]);

  // Carregar mensagens quando uma conversa for selecionada
  useEffect(() => {
    async function loadMessages() {
      if (!selectedConv) return;
      const data = await getMessages(selectedConv.id);
      setMessages(data);
    }
    loadMessages();
  }, [selectedConv]);

  // Scroll para o fim das mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv || !dbUser) return;

    setSending(true);
    const content = newMessage;
    setNewMessage("");

    // Otimista: adicionar mensagem localmente
    const tempMsg = {
      id: "temp-" + Date.now(),
      content,
      direction: "OUTBOUND",
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, tempMsg]);

    const result = await sendMessage(selectedConv.id, content, dbUser.id);
    if (!result.success) {
      // Remover a mensagem temporária se falhar
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
    }
    setSending(false);
  };

  if (!activeTenant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <MessageSquare className="w-16 h-16 text-surface-800" />
        <h2 className="text-xl font-bold text-surface-400">Selecione um Atendente para ver as conversas</h2>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white border border-surface-800 rounded-[2.5rem] overflow-hidden shadow-sm animate-[fade-in_0.3s_ease-out]">
      {/* Column 1: Conversations List */}
      <div className="w-[380px] border-r border-surface-800 flex flex-col bg-surface-950/10">
        <div className="p-6 border-b border-surface-800 bg-white">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input 
              type="text" 
              placeholder="Pesquisar conversas..."
              className="w-full pl-10 pr-4 py-3 bg-surface-950/20 border border-surface-800 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-600/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-surface-800/50">
          {loading ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
              <span className="text-xs font-bold text-surface-500 uppercase tracking-widest">Carregando...</span>
            </div>
          ) : conversations.length > 0 ? (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={cn(
                  "w-full p-5 flex items-start gap-4 transition-all duration-200 hover:bg-white text-left",
                  selectedConv?.id === conv.id ? "bg-white border-l-4 border-l-brand-600" : ""
                )}
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 font-black text-sm relative shrink-0">
                  {conv.contact.name?.substring(0, 2).toUpperCase() || "C"}
                  {conv.status === "ACTIVE" && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-surface-100 truncate">{conv.contact.name || conv.contact.waId}</span>
                    <span className="text-[10px] text-surface-500 font-bold uppercase truncate pl-2">
                      {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-surface-500 line-clamp-1 font-medium italic">
                    {conv.messages[0]?.content || "Iniciou conversa..."}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-surface-950/20 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6 text-surface-500" />
              </div>
              <p className="text-xs font-bold text-surface-500 uppercase tracking-widest leading-relaxed">Nenhuma conversa encontrada neste perfil.</p>
            </div>
          )}
        </div>
      </div>

      {/* Column 2: Chat Window */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="h-20 px-8 border-b border-surface-800 flex items-center justify-between bg-white z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-950/20 flex items-center justify-center text-surface-500 font-bold">
                  {selectedConv.contact.name?.substring(0, 2).toUpperCase() || "C"}
                </div>
                <div>
                  <h3 className="text-sm font-black text-surface-100">{selectedConv.contact.name || selectedConv.contact.waId}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-black uppercase text-surface-500 tracking-widest">Via {activeTenant.name}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 text-surface-500 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-all">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2.5 text-surface-500 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-all">
                  <Video className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-surface-800 mx-2" />
                <button className="p-2.5 text-surface-500 hover:bg-surface-950/20 rounded-xl transition-all">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-10 space-y-6 bg-surface-950/[0.02] custom-scrollbar">
              <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                {messages.map((msg, i) => (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "flex flex-col max-w-[70%] space-y-1",
                      msg.direction === "OUTBOUND" ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div 
                      className={cn(
                        "px-6 py-4 rounded-[2rem] text-sm leading-relaxed shadow-sm font-medium",
                        msg.direction === "OUTBOUND" 
                          ? "bg-brand-600 text-white rounded-tr-none" 
                          : "bg-white border border-surface-800 text-surface-100 rounded-tl-none font-sans"
                      )}
                    >
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-2 px-2">
                      <span className="text-[9px] font-bold text-surface-500 uppercase tracking-widest">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.direction === "OUTBOUND" && (
                        <CheckCheck className="w-3 h-3 text-brand-400" />
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="p-8 border-t border-surface-800 bg-white min-h-[100px] shrink-0">
              <form 
                onSubmit={handleSend}
                className="max-w-4xl mx-auto flex items-end gap-4"
              >
                <div className="flex-1 relative group">
                  <textarea 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escreva sua mensagem aqui..."
                    className="w-full px-6 py-4 bg-surface-950/20 border border-surface-800 rounded-3xl text-sm text-surface-100 font-medium focus:ring-4 focus:ring-brand-500/10 outline-none transition-all resize-none max-h-32"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="p-4 bg-brand-600 text-white rounded-2xl hover:bg-brand-700 disabled:opacity-50 transition-all shadow-xl shadow-brand-600/20 shrink-0"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-6">
            <div className="w-24 h-24 rounded-[2.5rem] bg-brand-50 flex items-center justify-center text-brand-600 shadow-sm border border-brand-100">
              <MessageSquare className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-black text-surface-100 uppercase tracking-tight">Suas Conversas</h3>
              <p className="text-sm text-surface-500 font-medium max-w-xs mx-auto mt-2">
                Selecione um contato na lista ao lado para visualizar o histórico e responder mensagens.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
