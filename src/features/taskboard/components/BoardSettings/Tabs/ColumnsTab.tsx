import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTaskBoardStore } from "@/features/taskboard/store";

interface ColumnsTabProps {
  onAlert: (alert: { title: string; message: string } | null) => void;
}

export function ColumnsTab({ onAlert }: ColumnsTabProps) {
  const [newColTitle, setNewColTitle] = useState("");
  const [newColId, setNewColId] = useState("");

  const columns = useTaskBoardStore((s) => s.columns) || [];
  const addCustomColumn = useTaskBoardStore((s) => s.addCustomColumn);
  const deleteColumn = useTaskBoardStore((s) => s.deleteColumn);
  const updateColumnTitle = useTaskBoardStore((s) => s.updateColumnTitle);
  const updateColumnId = useTaskBoardStore((s) => s.updateColumnId);

  const handleCreateColumn = () => {
    if (!newColTitle.trim()) return;
    const idToUse = newColId.trim() || undefined;

    if (idToUse && columns.some((c) => c.id === idToUse)) {
      onAlert({
        title: "Unique ID Required",
        message: "This ID is already in use. IDs must be unique.",
      });
      return;
    }

    addCustomColumn(newColTitle.trim(), idToUse);
    setNewColTitle("");
    setNewColId("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Add New Column
        </h3>
        <div className="grid gap-2">
          <Input
            placeholder="Column Title (e.g., Testing)"
            value={newColTitle}
            onChange={(e) => setNewColTitle(e.target.value)}
          />
          <Input
            placeholder="Custom ID (optional)"
            value={newColId}
            onChange={(e) => setNewColId(e.target.value)}
          />
          <Button onClick={handleCreateColumn} className="gap-2">
            <Plus size={16} /> Add Column
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Configure Columns
        </h3>
        <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
          {columns.map((col, index) => (
            <div
              key={`col-item-${index}`}
              className="group p-2 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-all"
            >
              <div className="flex items-end gap-2">
                <div className="flex-[2] space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider pl-1">
                    Title
                  </label>
                  <Input
                    className="h-8 text-xs bg-background/50 border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/20"
                    value={col.title}
                    onChange={(e) => updateColumnTitle(col.id, e.target.value)}
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider pl-1 font-mono">
                    ID
                  </label>
                  {col.id === "prime" ? (
                    <div className="h-8 px-2 flex items-center text-[9px] font-mono bg-primary/10 text-primary rounded border border-primary/20">
                      prime
                    </div>
                  ) : (
                    <Input
                      className="h-8 text-[9px] font-mono bg-background/80"
                      defaultValue={col.id}
                      onBlur={(e) => {
                        const v = e.target.value.trim().replace(/\s+/g, "-");
                        if (v && v !== col.id) {
                          if (columns.some((c) => c.id === v)) {
                            onAlert({
                              title: "Duplicate ID",
                              message: "This ID already exists!",
                            });
                            e.target.value = col.id as string;
                            return;
                          }
                          updateColumnId(col.id, v);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          (e.target as HTMLInputElement).blur();
                      }}
                    />
                  )}
                </div>

                {col.id !== "prime" ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={() => deleteColumn(col.id)}
                  >
                    <Trash2 size={13} />
                  </Button>
                ) : (
                  <div className="w-8 h-8" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
