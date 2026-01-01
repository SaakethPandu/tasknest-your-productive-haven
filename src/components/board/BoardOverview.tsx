import { motion } from 'framer-motion';
import { List, CheckCircle2, Clock, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Board } from '@/lib/storage';

interface BoardOverviewProps {
  board: Board;
  onGoToLists: () => void;
}

export function BoardOverview({ board, onGoToLists }: BoardOverviewProps) {
  const totalTasks = board.tasks.length;
  const totalColumns = board.columns.length;

  const tasksByColumn = board.columns.map((col) => ({
    ...col,
    count: board.tasks.filter((t) => t.columnId === col.id).length,
  }));

  const maxCount = Math.max(...tasksByColumn.map((c) => c.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 p-8"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{board.name}</h1>
        <p className="text-muted-foreground mb-8">Project Overview</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-6 card-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold">{totalTasks}</p>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-6 card-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-3">
              <List className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{totalColumns}</p>
            <p className="text-sm text-muted-foreground">Lists</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl p-6 card-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">
              {tasksByColumn[tasksByColumn.length - 1]?.count || 0}
            </p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-2xl p-6 card-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold">
              {new Date(board.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            <p className="text-sm text-muted-foreground">Created</p>
          </motion.div>
        </div>

        {/* Task Distribution */}
        {tasksByColumn.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-2xl p-6 card-shadow mb-8"
          >
            <h3 className="font-semibold mb-4">Task Distribution</h3>
            <div className="space-y-4">
              {tasksByColumn.map((col, index) => (
                <div key={col.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{col.name}</span>
                    <span className="text-muted-foreground">{col.count} tasks</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(col.count / maxCount) * 100}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className="h-full tasknest-gradient rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Button
            onClick={onGoToLists}
            className="tasknest-gradient text-white"
            size="lg"
          >
            <List className="w-5 h-5 mr-2" />
            View Lists
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
