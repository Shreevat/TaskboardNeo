import { useState, useEffect } from "react";
import { Plus, Loader2, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTaskBoardStore } from "@/features/taskboard/store";
import { teamsService } from "@/features/taskboard/services/teams";
import { Team } from "@/features/taskboard/types";

// ─── TeamRow (only used here, so no separate file needed) ────────────────────
function TeamRow({ team }: { team: Team }) {
  const [name, setName] = useState(team.name);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteTeam = useTaskBoardStore((s) => s.deleteTeam);
  const updateTeam = useTaskBoardStore((s) => s.updateTeam);

  useEffect(() => {
    setName(team.name);
  }, [team.name]);

  const hasChanged = name.trim() !== team.name;

  const handleUpdate = async () => {
    if (!hasChanged || !name.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await teamsService.update(team.id, { name: name.trim() });
    } catch {
      // API unavailable - update locally anyway
    } finally {
      updateTeam(team.id, name.trim());
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await teamsService.delete(team.id);
    } catch {
      // API unavailable - delete locally anyway
    } finally {
      deleteTeam(team.id);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30 border border-border/50">
      <Input
        className="h-8 text-xs bg-transparent border-none focus-visible:ring-0"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
      />
      {hasChanged && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={handleUpdate}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Check size={14} strokeWidth={3} />
          )}
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-destructive"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Trash2 size={12} />
        )}
      </Button>
    </div>
  );
}

// ─── TeamsTab ────────────────────────────────────────────────────────────────
export function TeamsTab() {
  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const teams = Array.isArray(useTaskBoardStore((s) => s.teams))
    ? useTaskBoardStore((s) => s.teams)
    : [];
  const setTeams = useTaskBoardStore((s) => s.setTeams);

  const handleCreate = async () => {
    if (!newName.trim() || isCreating) return;
    setIsCreating(true);
    try {
      await teamsService.create({ name: newName.trim() });
      const updated = await teamsService.getAll();
      const data = Array.isArray(updated)
        ? updated
        : (updated as any)?.data || (updated as any)?.teams || [];
      setTeams(data);
    } catch {
      // API unavailable - add locally
      setTeams([...teams, { id: `local-${Date.now()}`, name: newName.trim() }]);
    } finally {
      setNewName("");
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Add New Team
        </h3>
        <div className="flex gap-2">
          <Input
            placeholder="Team Name (e.g. Frontend)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <Button onClick={handleCreate} className="gap-2" disabled={isCreating}>
            <Plus size={16} />
            {isCreating ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Existing Teams
        </h3>
        <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
          {teams.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No teams yet.</p>
          )}
          {teams.map((team) => (
            <TeamRow key={team.id} team={team} />
          ))}
        </div>
      </div>
    </div>
  );
}
