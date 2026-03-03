import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
  UserPreferences,
  UserProfile,
  UserSession
} from "@supportops/contracts";

import { ENDPOINTS, apiClient, graphqlQuery } from "@/lib/api";
import { ApiError } from "@/lib/api/apiClient";
import { MeSettingsDocument, type MeSettingsQuery } from "@/graphql/generated";

export const settingsService = {
  getProfile: () => apiClient.get<UserProfile>(ENDPOINTS.USERS.ME),

  updateProfile: (data: UpdateProfileRequest) => apiClient.put<UserProfile>(ENDPOINTS.USERS.ME, data),

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      return await apiClient.upload<{ url: string }>(ENDPOINTS.USERS.AVATAR, formData);
    } catch (error) {
      const shouldFallbackToWebRoute =
        error instanceof ApiError && (error.status === 404 || error.status === 405 || error.status === 501);

      if (!shouldFallbackToWebRoute) {
        throw error;
      }

      const fallbackResponse = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData
      });

      if (!fallbackResponse.ok) {
        let code = "UNKNOWN_ERROR";
        let message = "Unable to upload avatar. Please try again.";

        try {
          const body = (await fallbackResponse.json()) as { code?: string; message?: string };
          code = body.code ?? code;
          message = body.message ?? message;
        } catch {
          // noop
        }

        throw new ApiError(fallbackResponse.status, { code, message });
      }

      const body = (await fallbackResponse.json()) as { url: string };
      return { data: { url: body.url } };
    }
  },

  changePassword: (data: ChangePasswordRequest) => apiClient.put<void>(ENDPOINTS.USERS.PASSWORD, data),

  getPreferences: () => apiClient.get<UserPreferences>(ENDPOINTS.USERS.PREFERENCES),

  getPreferencesGraphql: async () => {
    const data = await graphqlQuery<MeSettingsQuery>(MeSettingsDocument);
    return { data: data.meSettings };
  },

  updatePreferences: (data: Partial<UserPreferences>) =>
    apiClient.put<UserPreferences>(ENDPOINTS.USERS.PREFERENCES, data),

  getSessions: () => apiClient.get<UserSession[]>(ENDPOINTS.USERS.SESSIONS),

  revokeSession: (sessionId: string) => apiClient.delete<void>(ENDPOINTS.USERS.SESSION(sessionId))
};
