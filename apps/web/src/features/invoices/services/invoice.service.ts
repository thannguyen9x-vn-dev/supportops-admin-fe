import type { Invoice } from "@supportops/contracts";

import { ENDPOINTS, apiClient } from "@/lib/api";
import { env } from "@/lib/config/env";

export const invoiceService = {
  list: (params?: { page?: number; size?: number; search?: string }) =>
    apiClient.get<Invoice[]>(ENDPOINTS.INVOICES.LIST, {
      params: {
        page: params?.page ?? 1,
        size: params?.size ?? 10,
        search: params?.search
      }
    }),

  getById: (id: string) => apiClient.get<Invoice>(ENDPOINTS.INVOICES.DETAIL(id)),

  downloadPdf: async (id: string): Promise<Blob> => {
    const response = await fetch(`${env.API_BASE_URL}${ENDPOINTS.INVOICES.PDF(id)}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("supportops_access_token") || ""}`
      }
    });
    return response.blob();
  }
};
