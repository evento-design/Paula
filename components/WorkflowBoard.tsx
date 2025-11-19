import React from 'react';
import { ProjectWorkflow, WorkflowStep } from '../types';
import { Circle, CheckCircle2, Clock, Plus } from 'lucide-react';
import clsx from 'clsx';

interface WorkflowBoardProps {
  workflow: ProjectWorkflow | null;
}

export const WorkflowBoard: React.FC<WorkflowBoardProps> = ({ workflow }) => {
  if (!workflow) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        <p>Nenhum workflow ativo. Peça ao assistente para criar um.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium uppercase tracking-wide">
            {workflow.type}
          </span>
          <span className="text-xs text-slate-400">Gerado por AI</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900">{workflow.title}</h2>
      </header>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-w-max">
          <Column title="A Fazer" status="todo" steps={workflow.steps} />
          <Column title="Em Progresso" status="in_progress" steps={workflow.steps} />
          <Column title="Concluído" status="done" steps={workflow.steps} />
        </div>
      </div>
    </div>
  );
};

const Column: React.FC<{ title: string; status: string; steps: WorkflowStep[] }> = ({ title, status, steps }) => {
  const columnSteps = steps.filter(s => s.status === status);
  
  return (
    <div className="w-80 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-semibold text-slate-700">{title}</h3>
        <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
          {columnSteps.length}
        </span>
      </div>
      
      <div className="bg-slate-100/50 rounded-2xl p-3 flex-1 border border-slate-200/60 overflow-y-auto space-y-3">
        {columnSteps.map(step => (
          <div key={step.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">#{step.id}</span>
              {status === 'done' ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
              ) : status === 'in_progress' ? (
                <Clock size={16} className="text-amber-500" />
              ) : (
                <Circle size={16} className="text-slate-300" />
              )}
            </div>
            <h4 className="font-medium text-slate-800 mb-1 leading-snug">{step.title}</h4>
            <p className="text-xs text-slate-500 line-clamp-3">{step.description}</p>
            
            {step.assignee && (
               <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                    {step.assignee.charAt(0)}
                  </div>
                  <span className="text-xs text-slate-500">{step.assignee}</span>
               </div>
            )}
          </div>
        ))}
        
        {columnSteps.length === 0 && (
          <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
            Vazio
          </div>
        )}
      </div>
    </div>
  );
};
