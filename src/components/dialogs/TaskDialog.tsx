import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Tag, tagColors, generateId } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string, description: string, tags: Tag[]) => void;
  initialData?: {
    title: string;
    description: string;
    tags: Tag[];
  };
  mode: 'create' | 'edit';
}

export function TaskDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: TaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagLabel, setNewTagLabel] = useState('');
  const [selectedTagColor, setSelectedTagColor] = useState(tagColors[0].value);

  useEffect(() => {
    if (open && initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setTags(initialData.tags);
    } else if (!open) {
      setTitle('');
      setDescription('');
      setTags([]);
      setNewTagLabel('');
    }
  }, [open, initialData]);

  const handleAddTag = () => {
    if (newTagLabel.trim()) {
      setTags([...tags, { id: generateId(), label: newTagLabel.trim(), color: selectedTagColor }]);
      setNewTagLabel('');
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setTags(tags.filter((t) => t.id !== tagId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim(), description.trim(), tags);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add New Task' : 'Edit Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                placeholder="Add a description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              {tags.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className={cn('gap-1', tag.color, 'text-white')}
                    >
                      {tag.label}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag.id)}
                        className="hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="Tag name"
                  value={newTagLabel}
                  onChange={(e) => setNewTagLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1"
                />
                <div className="flex gap-1">
                  {tagColors.slice(0, 4).map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setSelectedTagColor(c.value)}
                      className={cn(
                        'w-8 h-8 rounded-lg transition-all',
                        c.value,
                        selectedTagColor === c.value && 'ring-2 ring-primary ring-offset-2'
                      )}
                    />
                  ))}
                </div>
                <Button type="button" variant="outline" size="icon" onClick={handleAddTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()} className="tasknest-gradient text-white">
              {mode === 'create' ? 'Add Task' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
