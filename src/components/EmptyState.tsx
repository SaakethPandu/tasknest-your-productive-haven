import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateBoardDialog } from './dialogs/CreateBoardDialog';

interface EmptyStateProps {
  onCreateBoard: (name: string) => void;
}

export function EmptyState({ onCreateBoard }: EmptyStateProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex items-center justify-center p-8"
    >
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-6 rounded-3xl tasknest-gradient flex items-center justify-center tasknest-glow"
        >
          <Layout className="w-12 h-12 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-2">Welcome to TaskNest</h2>
          <p className="text-muted-foreground mb-2">
            Your productivity journey starts here
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Create your first board to start organizing tasks with drag-and-drop simplicity.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <Button
            onClick={() => setShowDialog(true)}
            className="tasknest-gradient text-white"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Board
          </Button>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>All data saved locally on your device</span>
          </div>
        </motion.div>
      </div>

      <CreateBoardDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onCreateBoard={(name) => {
          onCreateBoard(name);
          setShowDialog(false);
        }}
      />
    </motion.div>
  );
}
