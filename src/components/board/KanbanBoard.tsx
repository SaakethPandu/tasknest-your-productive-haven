import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KanbanColumn } from './KanbanColumn';
import { AddColumnDialog } from '../dialogs/AddColumnDialog';
import { Board, Tag } from '@/lib/storage';

interface KanbanBoardProps {
  board: Board;
  onAddColumn: (name: string, color: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onAddTask: (columnId: string, title: string, description: string, tags: Tag[]) => void;
  onUpdateTask: (taskId: string, updates: { title: string; description: string; tags: Tag[] }) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, targetColumnId: string, targetIndex: number) => void;
}

export function KanbanBoard({
  board,
  onAddColumn,
  onDeleteColumn,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
}: KanbanBoardProps) {
  const [showAddColumnDialog, setShowAddColumnDialog] = useState(false);

  const sortedColumns = [...board.columns].sort((a, b) => a.order - b.order);

  if (board.columns.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Plus className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No lists yet</h2>
          <p className="text-muted-foreground mb-6">
            Get started by creating your first list. You can add columns like "To Do", "In Progress", and "Done".
          </p>
          <Button
            onClick={() => setShowAddColumnDialog(true)}
            className="tasknest-gradient text-white"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First List
          </Button>

          <AddColumnDialog
            open={showAddColumnDialog}
            onOpenChange={setShowAddColumnDialog}
            onAddColumn={(name, color) => {
              onAddColumn(name, color);
              setShowAddColumnDialog(false);
            }}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-6 h-full min-h-[calc(100vh-8rem)]">
          {sortedColumns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={board.tasks.filter((t) => t.columnId === column.id)}
              columns={board.columns}
              canDelete={board.columns.length > 1}
              onAddTask={(title, description, tags) => onAddTask(column.id, title, description, tags)}
              onUpdateTask={(taskId, title, description, tags) =>
                onUpdateTask(taskId, { title, description, tags })
              }
              onDeleteTask={onDeleteTask}
              onMoveTask={onMoveTask}
              onDeleteColumn={() => onDeleteColumn(column.id)}
            />
          ))}

          {/* Add Column Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-w-[300px] w-[300px]"
          >
            <Button
              variant="outline"
              className="w-full h-full min-h-[200px] border-2 border-dashed rounded-2xl text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
              onClick={() => setShowAddColumnDialog(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New List
            </Button>
          </motion.div>
        </div>
      </div>

      <AddColumnDialog
        open={showAddColumnDialog}
        onOpenChange={setShowAddColumnDialog}
        onAddColumn={(name, color) => {
          onAddColumn(name, color);
          setShowAddColumnDialog(false);
        }}
      />
    </DndProvider>
  );
}
