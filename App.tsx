import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ChatInterface } from './components/ChatInterface';
import { WorkflowBoard } from './components/WorkflowBoard';
import { ChecklistManager } from './components/ChecklistManager';
import { ScriptGenerator } from './components/ScriptGenerator';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AppState, ViewMode, ProjectWorkflow, ChecklistItem, ScriptOutput } from './types';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('welcome');
  const [currentWorkflow, setCurrentWorkflow] = useState<ProjectWorkflow | null>(null);
  const [currentChecklist, setCurrentChecklist] = useState<ChecklistItem[]>([]);
  const [currentScript, setCurrentScript] = useState<ScriptOutput | null>(null);
  const [lastActionSummary, setLastActionSummary] = useState<string>("");

  // This function updates the app state based on the AI's structured response
  const handleAiAction = (actionType: string, data: any, summary: string) => {
    setLastActionSummary(summary);
    
    switch (actionType) {
      case 'CREATE_WORKFLOW':
        setCurrentWorkflow(data as ProjectWorkflow);
        setViewMode('workflow');
        break;
      case 'CREATE_CHECKLIST':
        setCurrentChecklist(data as ChecklistItem[]);
        setViewMode('checklist');
        break;
      case 'GENERATE_SCRIPT':
        setCurrentScript(data as ScriptOutput);
        setViewMode('script');
        break;
      case 'NAVIGATE':
        if (data.view === 'workflow') setViewMode('workflow');
        if (data.view === 'checklist') setViewMode('checklist');
        if (data.view === 'script') setViewMode('script');
        break;
      default:
        console.log('Unknown action:', actionType);
    }
  };

  const renderMainContent = () => {
    switch (viewMode) {
      case 'welcome':
        return <WelcomeScreen onStart={() => {}} />;
      case 'workflow':
        return <WorkflowBoard workflow={currentWorkflow} />;
      case 'checklist':
        return <ChecklistManager items={currentChecklist} setItems={setCurrentChecklist} />;
      case 'script':
        return <ScriptGenerator scriptData={currentScript} />;
      default:
        return <WelcomeScreen onStart={() => {}} />;
    }
  };

  return (
    <Layout 
      currentView={viewMode} 
      onNavigate={setViewMode}
      sidebarContent={
        <ChatInterface onAiAction={handleAiAction} />
      }
    >
      {renderMainContent()}
    </Layout>
  );
};

export default App;