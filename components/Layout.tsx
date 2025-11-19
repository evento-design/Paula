import React from 'react';
import { ViewMode } from '../types';
import { Layers, CheckSquare, Code, Home, Settings } from 'lucide-react';
import clsx from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, sidebarContent, currentView, onNavigate }) => {
  return (
    <div className="flex h-screen w-full bg-slate-50">
      {/* Left Navigation Rail */}
      <nav className="w-16 bg-slate-900 flex flex-col items-center py-6 gap-6 text-slate-400 z-20 flex-shrink-0">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold mb-4 shadow-lg shadow-blue-900/50">
          AF
        </div>
        
        <NavItem 
          icon={<Home size={20} />} 
          label="Início" 
          active={currentView === 'welcome'} 
          onClick={() => onNavigate('welcome')} 
        />
        <NavItem 
          icon={<Layers size={20} />} 
          label="Workflow" 
          active={currentView === 'workflow'} 
          onClick={() => onNavigate('workflow')} 
        />
        <NavItem 
          icon={<CheckSquare size={20} />} 
          label="Assets" 
          active={currentView === 'checklist'} 
          onClick={() => onNavigate('checklist')} 
        />
        <NavItem 
          icon={<Code size={20} />} 
          label="Scripts" 
          active={currentView === 'script'} 
          onClick={() => onNavigate('script')} 
        />
        
        <div className="mt-auto">
          <NavItem icon={<Settings size={20} />} label="Config" active={false} onClick={() => {}} />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-hidden flex relative">
        <div className="flex-1 h-full overflow-y-auto p-8 relative z-10">
          {children}
        </div>

        {/* Right Sidebar (Chat) */}
        <aside className="w-[400px] border-l border-slate-200 bg-white h-full flex flex-col shadow-xl z-20">
          {sidebarContent}
        </aside>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    title={label}
    className={clsx(
      "p-3 rounded-xl transition-all duration-200 group relative",
      active ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "hover:bg-slate-800 hover:text-white"
    )}
  >
    {icon}
    <span className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
      {label}
    </span>
  </button>
);
