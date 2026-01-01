import { useState } from 'react';
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
import { columnColors } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface AddColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddColumn: (name: string, color: string) => void;
}

export function AddColumnDialog({
  open,
  onOpenChange,
  onAddColumn,
}: AddColumnDialogProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('default');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddColumn(name.trim(), color);
      setName('');
      setColor('default');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New List</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="column-name">List Name</Label>
              <Input
                id="column-name"
                placeholder="e.g., To Do, In Progress, Done"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2 flex-wrap">
                {columnColors.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={cn(
                      'w-8 h-8 rounded-lg transition-all',
                      c.value === 'default' && 'bg-column-default',
                      c.value === 'blue' && 'bg-column-blue',
                      c.value === 'green' && 'bg-column-green',
                      c.value === 'yellow' && 'bg-column-yellow',
                      c.value === 'red' && 'bg-column-red',
                      c.value === 'purple' && 'bg-column-purple',
                      color === c.value && 'ring-2 ring-primary ring-offset-2'
                    )}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()} className="tasknest-gradient text-white">
              Add List
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
