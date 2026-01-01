import { useState } from 'react';
import { useDrop } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCard } from './TaskCard';
import { TaskDialog } from '../dialogs/TaskDialog';
import { Column, Task, Tag } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  columns: Column[];
  canDelete: boolean;
  onAddTask: (title: string, description: string, tags: Tag[]) => void;
  onUpdateTask: (taskId: string, title: string, description: string, tags: Tag[]) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, targetColumnId: string, targetIndex: number) => void;
  onDeleteColumn: () => void;
}

interface DragItem {
  id: string;
  index: number;
  columnId: string;
}

export function KanbanColumn({
  column,
  tasks,
  columns,
  canDelete,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  onDeleteColumn,
}: KanbanColumnProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item: DragItem) => {
      if (item.columnId !== column.id) {
        onMoveTask(item.id, column.id, tasks.length);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver() && monitor.getItem<DragItem>()?.columnId !== column.id,
    }),
  });

  const handleReorder = (dragIndex: number, hoverIndex: number, targetColumnId: string) => {
    const draggedTask = sortedTasks[dragIndex];
    if (!draggedTask) return;

    if (targetColumnId === column.id) {
      // Reorder within same column
      onMoveTask(draggedTask.id, column.id, hoverIndex);
    }
  };

  const columnBg = cn(
    'rounded-2xl p-4 min-w-[300px] w-[300px] flex flex-col h-full',
    column.color === 'default' && 'bg-column-default',
    column.color === 'blue' && 'bg-column-blue',
    column.color === 'green' && 'bg-column-green',
    column.color === 'yellow' && 'bg-column-yellow',
    column.color === 'red' && 'bg-column-red',
    column.color === 'purple' && 'bg-column-purple',
    isOver && 'ring-2 ring-primary ring-offset-2'
  );

  return (
    <motion.div
      ref={drop}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={columnBg}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 -mx-4 -mt-4 px-4 py-3 rounded-t-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h3 className="font-semibold text-sm text-foreground">{column.name}</h3>
          <span className="bg-primary/20 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
        {canDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={onDeleteColumn}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto space-y-3 min-h-[100px]">
        <AnimatePresence mode="popLayout">
          {sortedTasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              columns={columns}
              onEdit={() => setEditingTask(task)}
              onDelete={() => onDeleteTask(task.id)}
              onMove={(targetColumnId) => onMoveTask(task.id, targetColumnId, 0)}
              onReorder={handleReorder}
            />
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="h-24 flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-muted rounded-xl">
            No tasks yet
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <Button
        variant="ghost"
        className="w-full mt-4 justify-start text-muted-foreground hover:text-foreground"
        onClick={() => setShowAddDialog(true)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Task
      </Button>

      {/* Add Task Dialog */}
      <TaskDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={(title, description, tags) => {
          onAddTask(title, description, tags);
          setShowAddDialog(false);
        }}
        mode="create"
      />

      {/* Edit Task Dialog */}
      <TaskDialog
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        onSubmit={(title, description, tags) => {
          if (editingTask) {
            onUpdateTask(editingTask.id, title, description, tags);
            setEditingTask(null);
          }
        }}
        initialData={editingTask || undefined}
        mode="edit"
      />
    </motion.div>
  );
}
