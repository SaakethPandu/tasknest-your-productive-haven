import { useState, useEffect, useCallback } from 'react';
import { 
  AppData, 
  Board, 
  Column, 
  Task, 
  Tag,
  loadData, 
  saveData, 
  generateId 
} from '@/lib/storage';

export function useAppData() {
  const [data, setData] = useState<AppData>(() => loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', data.theme === 'dark');
  }, [data.theme]);

  const toggleTheme = useCallback(() => {
    setData(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  }, []);

  const setHasSeenIntro = useCallback((value: boolean) => {
    setData(prev => ({ ...prev, hasSeenIntro: value }));
  }, []);

  const createBoard = useCallback((name: string) => {
    const newBoard: Board = {
      id: generateId(),
      name,
      columns: [],
      tasks: [],
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      boards: [...prev.boards, newBoard],
      currentBoardId: newBoard.id,
    }));
    return newBoard.id;
  }, []);

  const selectBoard = useCallback((boardId: string | null) => {
    setData(prev => ({ ...prev, currentBoardId: boardId }));
  }, []);

  const deleteBoard = useCallback((boardId: string) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.filter(b => b.id !== boardId),
      currentBoardId: prev.currentBoardId === boardId ? null : prev.currentBoardId,
    }));
  }, []);

  const getCurrentBoard = useCallback((): Board | null => {
    return data.boards.find(b => b.id === data.currentBoardId) || null;
  }, [data.boards, data.currentBoardId]);

  const addColumn = useCallback((boardId: string, name: string, color: string) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.map(board => {
        if (board.id !== boardId) return board;
        const newColumn: Column = {
          id: generateId(),
          name,
          color,
          order: board.columns.length,
        };
        return { ...board, columns: [...board.columns, newColumn] };
      }),
    }));
  }, []);

  const deleteColumn = useCallback((boardId: string, columnId: string) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.map(board => {
        if (board.id !== boardId) return board;
        if (board.columns.length <= 1) return board;
        return {
          ...board,
          columns: board.columns.filter(c => c.id !== columnId),
          tasks: board.tasks.filter(t => t.columnId !== columnId),
        };
      }),
    }));
  }, []);

  const addTask = useCallback((
    boardId: string, 
    columnId: string, 
    title: string, 
    description: string, 
    tags: Tag[]
  ) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.map(board => {
        if (board.id !== boardId) return board;
        const columnTasks = board.tasks.filter(t => t.columnId === columnId);
        const newTask: Task = {
          id: generateId(),
          title,
          description,
          tags,
          columnId,
          order: columnTasks.length,
          createdAt: new Date().toISOString(),
        };
        return { ...board, tasks: [...board.tasks, newTask] };
      }),
    }));
  }, []);

  const updateTask = useCallback((
    boardId: string, 
    taskId: string, 
    updates: Partial<Omit<Task, 'id' | 'createdAt'>>
  ) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.map(board => {
        if (board.id !== boardId) return board;
        return {
          ...board,
          tasks: board.tasks.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          ),
        };
      }),
    }));
  }, []);

  const deleteTask = useCallback((boardId: string, taskId: string) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.map(board => {
        if (board.id !== boardId) return board;
        return {
          ...board,
          tasks: board.tasks.filter(t => t.id !== taskId),
        };
      }),
    }));
  }, []);

  const moveTask = useCallback((
    boardId: string, 
    taskId: string, 
    targetColumnId: string,
    targetIndex: number
  ) => {
    setData(prev => ({
      ...prev,
      boards: prev.boards.map(board => {
        if (board.id !== boardId) return board;
        
        const taskToMove = board.tasks.find(t => t.id === taskId);
        if (!taskToMove) return board;

        const sourceColumnId = taskToMove.columnId;
        
        // Get tasks in target column (excluding the moved task)
        let targetColumnTasks = board.tasks
          .filter(t => t.columnId === targetColumnId && t.id !== taskId)
          .sort((a, b) => a.order - b.order);

        // Insert task at target index
        const updatedTask = { ...taskToMove, columnId: targetColumnId, order: targetIndex };
        targetColumnTasks.splice(targetIndex, 0, updatedTask);

        // Reorder tasks in target column
        targetColumnTasks = targetColumnTasks.map((t, idx) => ({ ...t, order: idx }));

        // Update source column tasks if different
        let sourceColumnTasks: Task[] = [];
        if (sourceColumnId !== targetColumnId) {
          sourceColumnTasks = board.tasks
            .filter(t => t.columnId === sourceColumnId && t.id !== taskId)
            .sort((a, b) => a.order - b.order)
            .map((t, idx) => ({ ...t, order: idx }));
        }

        // Combine all tasks
        const otherTasks = board.tasks.filter(
          t => t.columnId !== targetColumnId && t.columnId !== sourceColumnId
        );

        return {
          ...board,
          tasks: [...otherTasks, ...targetColumnTasks, ...sourceColumnTasks],
        };
      }),
    }));
  }, []);

  return {
    data,
    theme: data.theme,
    toggleTheme,
    hasSeenIntro: data.hasSeenIntro,
    setHasSeenIntro,
    boards: data.boards,
    currentBoardId: data.currentBoardId,
    getCurrentBoard,
    createBoard,
    selectBoard,
    deleteBoard,
    addColumn,
    deleteColumn,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  };
}
