import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppData } from '@/hooks/useAppData';
import { IntroScreen } from '@/components/IntroScreen';
import { LandingPage } from '@/components/LandingPage';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { EmptyState } from '@/components/EmptyState';
import { KanbanBoard } from '@/components/board/KanbanBoard';
import { BoardOverview } from '@/components/board/BoardOverview';

const Index = () => {
  const {
    theme,
    toggleTheme,
    hasSeenIntro,
    setHasSeenIntro,
    boards,
    currentBoardId,
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
  } = useAppData();

  const [showIntro, setShowIntro] = useState(!hasSeenIntro);
  const [showLanding, setShowLanding] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [view, setView] = useState<'overview' | 'lists'>('lists');

  const currentBoard = getCurrentBoard();

  useEffect(() => {
    if (!hasSeenIntro && !showIntro) {
      setShowLanding(true);
    }
  }, [hasSeenIntro, showIntro]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setHasSeenIntro(true);
    if (boards.length === 0) {
      setShowLanding(true);
    }
  };

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  const handleBack = () => {
    if (currentBoardId) {
      selectBoard(null);
    } else {
      setShowLanding(true);
    }
  };

  // Show intro screen
  if (showIntro) {
    return <IntroScreen onComplete={handleIntroComplete} />;
  }

  // Show landing page
  if (showLanding) {
    return (
      <LandingPage
        onGetStarted={handleGetStarted}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        boards={boards}
        currentBoardId={currentBoardId}
        onSelectBoard={selectBoard}
        onCreateBoard={createBoard}
        onDeleteBoard={deleteBoard}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <motion.div
        className="flex-1 flex flex-col min-h-screen"
        animate={{ marginLeft: sidebarOpen ? 288 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Navbar
          boardName={currentBoard?.name}
          view={view}
          onViewChange={setView}
          onBack={handleBack}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          theme={theme}
          onToggleTheme={toggleTheme}
          showBoardControls={!!currentBoard}
        />

        <main className="flex-1 pt-14 flex flex-col">
          <AnimatePresence mode="wait">
            {!currentBoard ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex"
              >
                <EmptyState onCreateBoard={createBoard} />
              </motion.div>
            ) : view === 'overview' ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex"
              >
                <BoardOverview board={currentBoard} onGoToLists={() => setView('lists')} />
              </motion.div>
            ) : (
              <motion.div
                key="lists"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex"
              >
                <KanbanBoard
                  board={currentBoard}
                  onAddColumn={(name, color) => addColumn(currentBoard.id, name, color)}
                  onDeleteColumn={(columnId) => deleteColumn(currentBoard.id, columnId)}
                  onAddTask={(columnId, title, description, tags) =>
                    addTask(currentBoard.id, columnId, title, description, tags)
                  }
                  onUpdateTask={(taskId, updates) =>
                    updateTask(currentBoard.id, taskId, updates)
                  }
                  onDeleteTask={(taskId) => deleteTask(currentBoard.id, taskId)}
                  onMoveTask={(taskId, targetColumnId, targetIndex) =>
                    moveTask(currentBoard.id, taskId, targetColumnId, targetIndex)
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
};

export default Index;
