import React from "react";
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

interface SubtaskDeleteConfirmDialogProps {
  taskId: Id;
  subtaskId: Id;
  deleteSubtask: (taskId: Id, subtaskId: Id) => void;
}

export function SubtaskDeleteConfirmDialog({
  taskId,
  subtaskId,
  deleteSubtask,
}: SubtaskDeleteConfirmDialogProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <div
          className="p-1 text-muted-foreground hover:text-destructive transition-colors rounded-sm hover:bg-muted/50 cursor-pointer"
          title="Delete subtask"
        >
          <Trash2 size={12} />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle className="text-sm">Delete Subtask</DialogTitle>
          <DialogDescription className="text-xs">
            Are you sure you want to delete this subtask?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteSubtask(taskId, subtaskId)}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
