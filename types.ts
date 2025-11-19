export type ViewMode = 'welcome' | 'workflow' | 'checklist' | 'script';

export interface ProjectWorkflow {
  title: string;
  type: 'campaign' | 'website' | 'branding' | 'social' | 'other';
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  assignee?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  category: string;
}

export interface ScriptOutput {
  title: string;
  description: string;
  code: string; // Google Apps Script code
  instructions: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AppState {
  currentView: ViewMode;
  workflow: ProjectWorkflow | null;
  checklist: ChecklistItem[];
  script: ScriptOutput | null;
}