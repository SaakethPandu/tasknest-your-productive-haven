import { motion } from 'framer-motion';
import { Menu, ArrowLeft, LayoutGrid, List, Settings, Moon, Sun, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  boardName?: string;
  view: 'overview' | 'lists';
  onViewChange: (view: 'overview' | 'lists') => void;
  onBack: () => void;
  onToggleSidebar: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  showBoardControls: boolean;
}

export function Navbar({
  boardName,
  view,
  onViewChange,
  onBack,
  onToggleSidebar,
  theme,
  onToggleTheme,
  showBoardControls,
}: NavbarProps) {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 h-14 bg-card/80 backdrop-blur-sm border-b z-30 flex items-center px-4 gap-4"
      initial={{ y: -56 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
        <Menu className="w-5 h-5" />
      </Button>

      {showBoardControls && (
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
      )}

      <div className="flex items-center gap-3 flex-1">
        {!showBoardControls && (
          <>
            <div className="w-8 h-8 tasknest-gradient rounded-lg flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-sm">TaskNest</h1>
              <p className="text-xs text-muted-foreground">by BhimSaaStudios</p>
            </div>
          </>
        )}
        {showBoardControls && boardName && (
          <h2 className="font-semibold truncate">{boardName}</h2>
        )}
      </div>

      {showBoardControls && (
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          <Button
            variant={view === 'overview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('overview')}
            className="h-8"
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={view === 'lists' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('lists')}
            className="h-8"
          >
            <List className="w-4 h-4 mr-2" />
            Lists
          </Button>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onToggleTheme}>
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 mr-2" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 mr-2" />
                Dark Mode
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.header>
  );
}
