import { Task, Column } from "@/features/taskboard/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MoveConfirmDialogProps {
  task: Task | null;
  targetColumn: Column | null;
  onConfirm: () => void;
  onCancel: () => void;
  onOpenChange: (open: boolean) => void;
}

export function MoveConfirmDialog({
  task,
  targetColumn,
  onConfirm,
  onCancel,
  onOpenChange,
}: MoveConfirmDialogProps) {
  return (
    <Dialog open={!!task} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Task Move</DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to move{" "}
            <span className="font-semibold text-foreground">
              "{task?.title}"
            </span>{" "}
            to{" "}
            <span className="font-semibold text-foreground">
              "{targetColumn?.title || "a new list"}"
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex-row justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={onConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
