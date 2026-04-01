import { History as HistoryIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Subtask, Id } from "@/features/taskboard/types";
import { cn } from "@/lib/utils";

interface SubtaskHistoryDialogProps {
  subtask: Subtask;
  activeSubtaskHistory: Id | null;
  setActiveSubtaskHistory: (id: Id | null) => void;
}

export function SubtaskHistoryDialog({
  subtask,
  activeSubtaskHistory,
  setActiveSubtaskHistory,
}: SubtaskHistoryDialogProps) {
  return (
    <Dialog
      open={activeSubtaskHistory === subtask.id}
      onOpenChange={(open) => setActiveSubtaskHistory(open ? subtask.id : null)}
    >
      <DialogTrigger
        className={cn(
          "p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer",
          activeSubtaskHistory === subtask.id
            ? "text-primary bg-primary/20"
            : "text-muted-foreground/70 hover:text-primary",
        )}
        title="View subtask timeline"
      >
        <HistoryIcon size={13} />
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-background border shadow-xl">
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="text-lg font-normal uppercase tracking-wider text-primary">
            Subtask History
          </DialogTitle>
          <div className="text-lg text-muted-foreground font-medium italic mt-1 truncate">
            "{subtask.title}"
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[30vh] -mx-4 px-4 py-2">
          <div className="flex flex-col gap-3">
            {!subtask.history || subtask.history.length === 0 ? (
              <p className="text-md text-muted-foreground italic text-center py-4">
                No data recorded.
              </p>
            ) : (
              [...subtask.history].reverse().map((entry) => (
                <div
                  key={entry.id}
                  className="relative pl-5 group/item pb-1 border-b border-border/20 last:border-0 last:pb-0"
                >
                  <div className="absolute left-[5px] top-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/item:bg-primary transition-colors" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-md-plus text-foreground font-medium leading-normal">
                      {entry.description}
                    </span>
                    <span className="text-md text-muted-foreground tabular-nums">
                      {new Date(entry.timestamp).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      {new Date(entry.timestamp).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
