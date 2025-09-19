import { create } from 'zustand';

const LOCAL_STORAGE_KEY = 'work-log-templates';

// --- LocalStorage Interaction --- //
const loadTemplatesFromStorage = (): string[] => {
  try {
    const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (item) {
      const parsed = JSON.parse(item);
      // Ensure it's an array of 3 strings
      if (Array.isArray(parsed) && parsed.length === 3 && parsed.every(i => typeof i === 'string')) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load templates from localStorage', error);
  }
  return ['', '', '']; // Default to 3 empty strings
};

const saveTemplatesToStorage = (templates: string[]) => {
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Failed to save templates to localStorage', error);
  }
};

// --- Zustand Store --- //

interface TemplateState {
  templates: string[];
  loadTemplates: () => void;
  saveTemplate: (index: number, content: string) => void;
  deleteTemplate: (index: number) => void;
}

const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: ['', '', ''],

  loadTemplates: () => {
    set({ templates: loadTemplatesFromStorage() });
  },

  saveTemplate: (index, content) => {
    const { templates } = get();
    const updatedTemplates = [...templates];
    if (index >= 0 && index < 3) {
      updatedTemplates[index] = content;
      set({ templates: updatedTemplates });
      saveTemplatesToStorage(updatedTemplates);
    }
  },

  deleteTemplate: (index) => {
    const { templates } = get();
    const updatedTemplates = [...templates];
    if (index >= 0 && index < 3) {
      updatedTemplates[index] = ''; // Set to empty string
      set({ templates: updatedTemplates });
      saveTemplatesToStorage(updatedTemplates);
    }
  },
}));

export default useTemplateStore;
