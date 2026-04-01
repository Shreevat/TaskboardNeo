import { apiClient } from "@/lib/api";

export interface CreateBrandPayload {
  name: string;
}

export interface BrandResponse {
  id: string;
  name: string;
  created_at: string;
}

export interface UpdateBrandPayload {
  name: string;
}

export const brandsService = {
  /** POST /api/v1/brands */
  create: (payload: CreateBrandPayload) =>
    apiClient.post<BrandResponse>("/api/v1/brands", payload),

  /** PUT /api/v1/brands/{id} */
  update: (id: string, payload: UpdateBrandPayload) =>
    apiClient.put<BrandResponse>(`/api/v1/brands/${id}`, payload),

  /** GET /api/v1/brands/ */
  getAll: () => apiClient.get<BrandResponse[]>("/api/v1/brands"),

  /** GET /api/v1/brands/{id} */
  getById: (id: string) =>
    apiClient.get<BrandResponse>(`/api/v1/brands/${id}`),

  /** DELETE /api/v1/brands/{id} */
  delete: (id: string) => apiClient.delete(`/api/v1/brands/${id}`),
};
