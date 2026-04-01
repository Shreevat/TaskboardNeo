import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Task, Column } from "@/features/taskboard/types";

interface PromotedTasksDialogProps {
  task: Task;
  promotedTasks: Task[];
  columns: Column[];
  showPromoted: boolean;
  setShowPromoted: (show: boolean) => void;
}

export function PromotedTasksDialog({
  task,
  promotedTasks,
  columns,
  showPromoted,
  setShowPromoted,
}: PromotedTasksDialogProps) {
  if (promotedTasks.length === 0) return null;

  return (
    <Dialog open={showPromoted} onOpenChange={setShowPromoted}>
      <DialogTrigger
        onClick={(e) => {
          e.stopPropagation();
          setShowPromoted(true);
        }}
        className="shrink-0 flex items-center gap-1 text-[10px] font-normal uppercase tracking-wider text-primary bg-primary/10 hover:bg-primary/20 px-1.5 py-0.5 rounded transition-all border border-primary/20 cursor-pointer"
        title="View tasks promoted from this card"
      >
        <ExternalLink size={10} />
        {promotedTasks.length} Split
      </DialogTrigger>
      <DialogContent className="sm:max-w-xs bg-background border shadow-2xl">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-xs font-normal uppercase tracking-widest text-primary flex items-center gap-2">
            <ExternalLink size={14} /> Split-off Tasks
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Tasks promoted from "{task.title}"
          </p>
        </DialogHeader>
        <ScrollArea className="max-h-[30vh] -mx-4 px-4 py-2">
          <div className="flex flex-col gap-2">
            {promotedTasks.map((pt) => (
              <div
                key={pt.id}
                className="bg-muted/30 p-2 rounded border border-border/50 flex flex-col gap-1"
              >
                <div className="text-sm font-semibold text-foreground leading-tight">
                  {pt.title || "Untitled Task"}
                </div>
                <div className="flex items-center justify-between text-[10px] uppercase font-normal tracking-tighter">
                  <span
                    className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/50"
                    style={{
                      borderLeftColor: pt.color as string,
                      borderLeftWidth: "2px",
                    }}
                  >
                    {columns.find((c) => c.id === pt.columnId)?.title ||
                      "Unknown Column"}
                  </span>
                  <span className="text-muted-foreground/60 tabular-nums">
                    #{pt.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
