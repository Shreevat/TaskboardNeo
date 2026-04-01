import { History as HistoryIcon, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Task, Category, Brand } from "@/features/taskboard/types";
import { cn } from "@/lib/utils";

interface TaskHistoryDialogProps {
  task: Task;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  historySearch: string;
  setHistorySearch: (search: string) => void;
  selectedCategory?: Category;
  selectedBrand?: Brand;
}

export function TaskHistoryDialog({
  task,
  showHistory,
  setShowHistory,
  historySearch,
  setHistorySearch,
  selectedCategory,
  selectedBrand,
}: TaskHistoryDialogProps) {
  return (
    <Dialog open={showHistory} onOpenChange={setShowHistory}>
      <DialogTrigger
        className={cn(
          "shrink-0 transition-colors p-1.5 rounded-sm hover:bg-muted text-muted-foreground hover:text-primary cursor-pointer",
          showHistory && "text-primary bg-primary/10",
        )}
        title="View full task history"
      >
        <HistoryIcon size={15} />
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl bg-background border shadow-xl">
        <DialogHeader className="flex flex-col gap-3 pb-3 border-b">
          <div className="flex flex-row items-center gap-2">
            <HistoryIcon className="text-primary" size={18} />
            <div className="flex flex-col text-left">
              <DialogTitle className="text-lg font-bold uppercase tracking-tight">
                Task History
              </DialogTitle>
              <div className="text-sm text-muted-foreground font-medium flex gap-1">
                {selectedCategory?.name || "Category"}
                <span className="opacity-30">/</span>
                {selectedBrand?.name || "Brand"}
                <span className="opacity-30">·</span>#{task.id}
              </div>
            </div>
          </div>

          <div className="relative">
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={12}
            />
            <input
              placeholder="Search history..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="w-full bg-muted/40 border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] -mx-4 px-4 overflow-y-auto pr-4">
          <div className="flex flex-col gap-1 py-2">
            {!task.history || task.history.length === 0 ? (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                No events recorded yet.
              </p>
            ) : (
              [...task.history]
                .reverse()
                .filter(
                  (entry) =>
                    !historySearch ||
                    entry.description
                      .toLowerCase()
                      .includes(historySearch.toLowerCase()),
                )
                .map((entry, idx, arr) => (
                  <div key={entry.id} className="relative pl-5 pb-1 last:pb-0">
                    {idx !== arr.length - 1 && (
                      <div className="absolute left-[5px] top-3 bottom-0 w-[1px] bg-border/40" />
                    )}

                    <div
                      className={cn(
                        "absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border border-background ring-1 ring-border/50",
                        idx === 0 && !historySearch
                          ? "bg-primary"
                          : "bg-muted-foreground/20",
                      )}
                    />

                    <div className="flex flex-col">
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-md font-medium text-foreground leading-snug">
                          {entry.description}
                        </span>
                        <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                          {new Date(entry.timestamp).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}{" "}
                          {new Date(entry.timestamp).toLocaleTimeString(
                            undefined,
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
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
