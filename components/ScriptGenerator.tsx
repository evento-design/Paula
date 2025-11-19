import React from 'react';
import { ScriptOutput } from '../types';
import { Copy, Check, Terminal, Play } from 'lucide-react';

interface ScriptGeneratorProps {
  scriptData: ScriptOutput | null;
}

export const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({ scriptData }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (scriptData?.code) {
      navigator.clipboard.writeText(scriptData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!scriptData) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        <p>Nenhum script gerado. Peça ao assistente uma automação para Google Drive.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{scriptData.title}</h2>
        <p className="text-slate-600">{scriptData.description}</p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Instructions Column */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-y-auto">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Play size={18} className="text-green-600" />
            Como Executar
          </h3>
          <ol className="space-y-4">
            {scriptData.instructions.map((step, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </span>
                <span className="pt-0.5 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="text-blue-800 font-bold text-sm mb-1">Dica Pro</h4>
            <p className="text-xs text-blue-600 leading-relaxed">
              Você pode configurar "Triggers" no Apps Script para rodar esse código automaticamente quando um formulário for enviado.
            </p>
          </div>
        </div>

        {/* Code Column */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl overflow-hidden flex flex-col shadow-lg">
          <div className="bg-slate-950 p-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-3 text-xs text-slate-400 font-mono flex items-center gap-1">
                <Terminal size={12} /> Code.gs
              </span>
            </div>
            <button 
              onClick={handleCopy}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copiado!' : 'Copiar Código'}
            </button>
          </div>
          
          <pre className="flex-1 p-6 overflow-auto font-mono text-sm text-slate-300 leading-relaxed">
            <code>{scriptData.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
