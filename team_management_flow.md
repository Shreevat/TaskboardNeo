# Team Management Flow

This document provides a comprehensive overview of the team management implementation in the Taskboard application, documenting each layer from the API to the UI.

---

## 1. API Client
The base `apiClient` manages low-level `fetch` requests, handling base URLs, default headers, and JSON serialization.

```typescript
// src/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://172.16.13.227:8000";

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`[API ${response.status}] ${path}: ${errorText}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>(path, { ...options, method: "PUT", body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "DELETE" }),
};
```

---

## 2. API Service Layer
The `teamsService` encapsulates all backend interactions for teams.

```typescript
// src/lib/services/teams.ts
import { apiClient } from "../api";

export interface CreateTeamPayload { name: string; }
export interface UpdateTeamPayload { name: string; }
export interface TeamResponse { id: string; name: string; created_at: string; }

export const teamsService = {
  create: (payload: CreateTeamPayload) => 
    apiClient.post<TeamResponse>("/api/v1/teams", payload),
    
  update: (id: string, payload: UpdateTeamPayload) => 
    apiClient.put<TeamResponse>(`/api/v1/teams/${id}`, payload),
    
  getAll: () => 
    apiClient.get<TeamResponse[]>("/api/v1/teams"),
    
  getById: (id: string) => 
    apiClient.get<TeamResponse>(`/api/v1/teams/${id}`),
    
  delete: (id: string) => 
    apiClient.delete(`/api/v1/teams/${id}`),
};
```

---

## 3. Data Model
Unified interface for teams across the application.

```typescript
// src/features/taskboard/types/index.ts
export interface Team {
  id: string;
  name: string;
}
```

---

## 4. Global State (Zustand)
Manages the local team list and performs cascading cleanup when a team is deleted (e.g., removing references from tasks and subtasks).

```typescript
// src/features/taskboard/store/team.ts
import { StateCreator } from "zustand";
import { TaskBoardState } from "./types";
import { Team } from "../types";

export interface TeamSlice {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  deleteTeam: (id: string) => void;
  updateTeam: (id: string, name: string) => void;
}

export const createTeamSlice: StateCreator<TaskBoardState, [], [], TeamSlice> = (set) => ({
  teams: [], // Reset to empty or initial state
  setTeams: (teams) => set({ teams }),
  deleteTeam: (id) =>
    set((state) => ({
      teams: state.teams.filter((t) => t.id !== id),
      tasks: state.tasks.map((task) => ({
        ...task,
        promotedTeam: task.promotedTeam === id ? undefined : task.promotedTeam,
        subtasks: (task.subtasks ?? []).map((s) => ({
          ...s,
          team: s.team === id ? undefined : s.team,
        })),
      })),
    })),
  updateTeam: (id, name) =>
    set((state) => ({
      teams: state.teams.map((t) => (t.id === id ? { ...t, name } : t)),
    })),
});
```

---

## 5. React Query Hooks
Facilitates asynchronous data fetching, mutation tracking, and automatic UI updates through query invalidation.

```typescript
// src/features/taskboard/hooks/use-team-mutations.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teamsService, CreateTeamPayload, UpdateTeamPayload } from "@/lib/services/teams";
import { useTaskBoardStore } from "../store";

export const TEAM_QUERY_KEY = ["teams"] as const;

export function useTeams() {
  const setStoreTeams = useTaskBoardStore((s) => s.setTeams);
  return useQuery({
    queryKey: TEAM_QUERY_KEY,
    queryFn: async () => {
      const resp = await teamsService.getAll();
      const data = Array.isArray(resp) ? resp : (resp as any)?.data || [];
      setStoreTeams(data); // Sync local store with API result
      return data;
    },
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTeamPayload) => teamsService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEY }),
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTeamPayload }) => 
      teamsService.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...TEAM_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => teamsService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEY }),
  });
}
```

---

## 6. UI Components

### Team Manager Component
The entry point for viewing and adding teams.

```tsx
// src/features/taskboard/components/ManageBoard/components/TeamManager.tsx
export function TeamManager() {
  const [newTeamName, setNewTeamName] = useState("");
  const { data: apiTeams, isLoading: isTeamsLoading } = useTeams();
  const createTeamMutation = useCreateTeam();
  const deleteTeamMutation = useDeleteTeam();

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return;
    createTeamMutation.mutate({ name: newTeamName.trim() }, {
      onSuccess: () => setNewTeamName(""),
    });
  };

  const teams = apiTeams || [];

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input 
          placeholder="New Team Name"
          value={newTeamName} 
          onChange={(e) => setNewTeamName(e.target.value)} 
        />
        <Button onClick={handleCreateTeam} disabled={createTeamMutation.isPending}>Add</Button>
      </div>
      <div className="flex flex-col gap-2">
        {teams.map((team) => (
          <TeamRow
            key={team.id}
            team={team}
            onDelete={() => deleteTeamMutation.mutate(team.id)}
            isDeleting={deleteTeamMutation.isPending && deleteTeamMutation.variables === team.id}
          />
        ))}
      </div>
    </div>
  );
}
```

### Team Row Component
Handles individual team state and inline updates.

```tsx
// src/features/taskboard/components/ManageBoard/components/TeamRow.tsx
export function TeamRow({ team, onDelete, isDeleting }: TeamRowProps) {
  const [name, setName] = useState(team.name);
  const updateTeamMutation = useUpdateTeam();

  const handleUpdate = () => {
    if (name.trim() === team.name) return;
    updateTeamMutation.mutate({ id: team.id, payload: { name: name.trim() } });
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
      <Input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        onKeyDown={(e) => { if (e.key === "Enter") handleUpdate(); }}
      />
      {name !== team.name && (
        <Button onClick={handleUpdate} disabled={updateTeamMutation.isPending}>Save</Button>
      )}
      <Button onClick={onDelete} disabled={isDeleting}>Delete</Button>
    </div>
  );
}
```
