import React from 'react';
import { MessageSquare, FileCheck, FolderTree, LayoutTemplate } from 'lucide-react';

export const WelcomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-8 shadow-sm">
        <LayoutTemplate size={40} />
      </div>
      
      <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
        Bem-vindo ao Agência Flow
      </h1>
      <p className="text-lg text-slate-500 mb-12 leading-relaxed">
        Seu hub central para padronização de processos. Use o chat à direita para começar a criar workflows, listas de assets ou automações para sua agência.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
        <FeatureCard 
          icon={<FolderTree className="text-indigo-500" />}
          title="Workflows"
          desc="Crie fluxos padronizados para campanhas, sites e branding."
        />
        <FeatureCard 
          icon={<FileCheck className="text-emerald-500" />}
          title="Checklists"
          desc="Listas de assets dinâmicas que se adaptam ao projeto."
        />
        <FeatureCard 
          icon={<MessageSquare className="text-amber-500" />}
          title="Automação"
          desc="Gere scripts para criar pastas e forms no Google Workspace."
        />
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-4 p-2 bg-slate-50 rounded-lg w-fit">{icon}</div>
    <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500">{desc}</p>
  </div>
);
