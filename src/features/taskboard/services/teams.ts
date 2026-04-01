import { apiClient } from "@/lib/api";

export interface CreateTeamPayload {
  name: string;
}

export interface TeamResponse {
  id: string;
  name: string;
  created_at: string;
}

export interface UpdateTeamPayload {
  name: string;
}

export const teamsService = {
  /** POST /api/v1/teams */
  create: (payload: CreateTeamPayload) =>
    apiClient.post<TeamResponse>("/api/v1/teams", payload),

  /** PUT /api/v1/teams/{id} */
  update: (id: string, payload: UpdateTeamPayload) =>
    apiClient.put<TeamResponse>(`/api/v1/teams/${id}`, payload),

  /** GET /api/v1/teams/ */
  getAll: () => apiClient.get<TeamResponse[]>("/api/v1/teams"),

  /** GET /api/v1/teams/{id} */
  getById: (id: string) =>
    apiClient.get<TeamResponse>(`/api/v1/teams/${id}`),

  /** DELETE /api/v1/teams/{id} */
  delete: (id: string) => apiClient.delete(`/api/v1/teams/${id}`),
};
