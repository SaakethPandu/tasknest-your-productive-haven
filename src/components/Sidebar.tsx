import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Layout, 
  Home,
  CheckSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Board } from '@/lib/storage';
import { CreateBoardDialog } from './dialogs/CreateBoardDialog';

interface SidebarProps {
  boards: Board[];
  currentBoardId: string | null;
  onSelectBoard: (boardId: string | null) => void;
  onCreateBoard: (name: string) => void;
  onDeleteBoard: (boardId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  boards,
  currentBoardId,
  onSelectBoard,
  onCreateBoard,
  onDeleteBoard,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-sidebar border-r z-40 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 tasknest-gradient rounded-xl flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-sm">TaskNest</h1>
                  <p className="text-xs text-muted-foreground">BhimSaaStudios</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onToggle}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-3">
              <div className="mb-6">
                <Button
                  variant={currentBoardId === null ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => onSelectBoard(null)}
                >
                  <Home className="w-4 h-4 mr-3" />
                  Home
                </Button>
              </div>

              <div className="mb-3 flex items-center justify-between px-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Boards
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-1">
                {boards.map((board) => (
                  <motion.div
                    key={board.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="group"
                  >
                    <Button
                      variant={currentBoardId === board.id ? 'secondary' : 'ghost'}
                      className="w-full justify-between pr-2"
                      onClick={() => onSelectBoard(board.id)}
                    >
                      <span className="flex items-center truncate">
                        <Layout className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span className="truncate">{board.name}</span>
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteBoard(board.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </Button>
                  </motion.div>
                ))}

                {boards.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8 px-4">
                    No boards yet. Create one to get started!
                  </p>
                )}
              </div>
            </nav>

            {/* Create Board Button */}
            <div className="p-3 border-t">
              <Button
                className="w-full tasknest-gradient text-white"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Board
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <CreateBoardDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateBoard={(name) => {
          onCreateBoard(name);
          setShowCreateDialog(false);
        }}
      />
    </>
  );
}
