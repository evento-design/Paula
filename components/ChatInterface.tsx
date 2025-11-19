import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { sendMessageToGemini } from '../services/gemini';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import clsx from 'clsx';

interface ChatInterfaceProps {
  onAiAction: (actionType: string, data: any, summary: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onAiAction }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Olá! Sou seu assistente de processos. Posso criar workflows, checklists de assets ou scripts para Google Workspace. Como posso ajudar hoje?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.content}`);
      const response = await sendMessageToGemini(userMsg.content, history);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.summary || "Ação realizada com sucesso.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);

      // Dispatch action to main app
      let dataPayload = null;
      if (response.actionType === 'CREATE_WORKFLOW') dataPayload = response.workflowData;
      if (response.actionType === 'CREATE_CHECKLIST') dataPayload = response.checklistData;
      if (response.actionType === 'GENERATE_SCRIPT') dataPayload = response.scriptData;
      if (response.actionType === 'NAVIGATE') dataPayload = { view: response.summary.includes('workflow') ? 'workflow' : 'welcome' }; // Simplified logic for nav

      onAiAction(response.actionType, dataPayload, response.summary);

    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Desculpe, tive um problema ao conectar com o servidor.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-sm">
          <Sparkles size={16} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">Assistente AI</h3>
          <p className="text-xs text-slate-500">Online • Gemini 2.5 Flash</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              "flex gap-3 max-w-[90%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              msg.role === 'user' ? "bg-slate-200 text-slate-600" : "bg-blue-100 text-blue-600"
            )}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={clsx(
              "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
              msg.role === 'user' 
                ? "bg-slate-800 text-white rounded-tr-none" 
                : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 mr-auto max-w-[80%]">
             <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-400 flex items-center justify-center animate-pulse">
                <Bot size={14} />
             </div>
             <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none border border-slate-100 text-slate-400 text-sm flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                <span>Pensando...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ex: Crie um workflow para campanha de Social Media..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none h-12 min-h-[48px] max-h-32"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          O assistente pode gerar workflows, checklists e scripts.
        </p>
      </div>
    </div>
  );
};
