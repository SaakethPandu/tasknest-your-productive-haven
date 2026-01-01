import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import { GripVertical, MoreVertical, Pencil, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task, Column } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  index: number;
  columns: Column[];
  onEdit: () => void;
  onDelete: () => void;
  onMove: (targetColumnId: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number, columnId: string) => void;
}

interface DragItem {
  id: string;
  index: number;
  columnId: string;
  type: string;
}

export function TaskCard({
  task,
  index,
  columns,
  onEdit,
  onDelete,
  onMove,
  onReorder,
}: TaskCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'TASK',
    item: (): DragItem => ({ id: task.id, index, columnId: task.columnId, type: 'TASK' }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    hover: (item: DragItem, monitor) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      const sourceColumnId = item.columnId;
      const targetColumnId = task.columnId;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex && sourceColumnId === targetColumnId) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      onReorder(dragIndex, hoverIndex, targetColumnId);
      item.index = hoverIndex;
      item.columnId = targetColumnId;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const otherColumns = columns.filter((c) => c.id !== task.columnId);

  return (
    <motion.div
      ref={preview}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'bg-card rounded-xl p-4 card-shadow hover:card-shadow-hover transition-all group',
        isOver && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          ref={ref}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors pt-0.5"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {otherColumns.length > 0 && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Move to...
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {otherColumns.map((col) => (
                        <DropdownMenuItem key={col.id} onClick={() => onMove(col.id)}>
                          {col.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {task.description}
            </p>
          )}

          {task.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {task.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className={cn('text-[10px] px-1.5 py-0', tag.color, 'text-white')}
                >
                  {tag.label}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
