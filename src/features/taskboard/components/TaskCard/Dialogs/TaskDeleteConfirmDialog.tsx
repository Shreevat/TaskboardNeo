import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Id } from "@/features/taskboard/types";

interface TaskDeleteConfirmDialogProps {
  taskId: Id;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  deleteTask: (id: Id) => void;
}

export function TaskDeleteConfirmDialog({
  taskId,
  showDeleteConfirm,
  setShowDeleteConfirm,
  deleteTask,
}: TaskDeleteConfirmDialogProps) {
  return (
    <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <DialogTrigger>
        <div
          className="text-muted-foreground hover:text-destructive p-1.5 rounded-sm hover:bg-muted transition-colors cursor-pointer"
          aria-label="Delete card"
        >
          <Trash2 size={15} />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription className="py-2">
            Are you sure you want to delete this task? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              deleteTask(taskId);
              setShowDeleteConfirm(false);
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
