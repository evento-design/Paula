import React from 'react';
import { ChecklistItem } from '../types';
import { CheckSquare, Square, AlertCircle, Plus } from 'lucide-react';
import clsx from 'clsx';

interface ChecklistManagerProps {
  items: ChecklistItem[];
  setItems: (items: ChecklistItem[]) => void;
}

export const ChecklistManager: React.FC<ChecklistManagerProps> = ({ items, setItems }) => {
  
  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  if (items.length === 0) {
    return (
       <div className="h-full flex items-center justify-center text-slate-400">
        <p>Nenhum checklist ativo. Peça ao assistente para gerar uma lista de assets.</p>
      </div>
    );
  }

  const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100);

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col">
      <header className="mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Checklist de Assets</h2>
            <p className="text-slate-500 text-sm mt-1">Verifique se todos os arquivos necessários foram recebidos.</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-blue-600">{progress}%</span>
            <span className="text-xs text-slate-400 block">Concluído</span>
          </div>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-8 pb-10">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
              {category}
            </h3>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
              {(categoryItems as ChecklistItem[]).map(item => (
                <div 
                  key={item.id} 
                  onClick={() => toggleItem(item.id)}
                  className="flex items-center p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className={clsx(
                    "mr-4 transition-colors",
                    item.checked ? "text-blue-600" : "text-slate-300 group-hover:text-slate-400"
                  )}>
                    {item.checked ? <CheckSquare size={24} /> : <Square size={24} />}
                  </div>
                  
                  <div className="flex-1">
                    <p className={clsx(
                      "font-medium transition-all",
                      item.checked ? "text-slate-400 line-through" : "text-slate-700"
                    )}>
                      {item.label}
                    </p>
                  </div>

                  {item.required && !item.checked && (
                    <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-medium">
                      <AlertCircle size={12} />
                      <span>Obrigatório</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};