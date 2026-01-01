export interface Tag {
  id: string;
  label: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  tags: Tag[];
  columnId: string;
  order: number;
  createdAt: string;
}

export interface Column {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
  tasks: Task[];
  createdAt: string;
}

export interface AppData {
  boards: Board[];
  currentBoardId: string | null;
  theme: 'light' | 'dark';
  hasSeenIntro: boolean;
}

const STORAGE_KEY = 'tasknest-data';

const defaultData: AppData = {
  boards: [],
  currentBoardId: null,
  theme: 'light',
  hasSeenIntro: false,
};

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function loadData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultData;
    
    const data = JSON.parse(stored) as AppData;
    
    // Backward compatibility
    if (!data.boards) data.boards = [];
    if (data.theme === undefined) data.theme = 'light';
    if (data.hasSeenIntro === undefined) data.hasSeenIntro = false;
    
    return data;
  } catch {
    return defaultData;
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
}

export function getTheme(): 'light' | 'dark' {
  const data = loadData();
  return data.theme;
}

export function setTheme(theme: 'light' | 'dark'): void {
  const data = loadData();
  data.theme = theme;
  saveData(data);
}

export const tagColors = [
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Yellow', value: 'bg-yellow-500' },
  { name: 'Red', value: 'bg-red-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Pink', value: 'bg-pink-500' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Teal', value: 'bg-teal-500' },
];

export const columnColors = [
  { name: 'Default', value: 'default' },
  { name: 'Blue', value: 'blue' },
  { name: 'Green', value: 'green' },
  { name: 'Yellow', value: 'yellow' },
  { name: 'Red', value: 'red' },
  { name: 'Purple', value: 'purple' },
];
