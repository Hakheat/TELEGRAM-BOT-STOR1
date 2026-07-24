import { apiClient } from "@/lib/api-client";

export interface SettingsData {
  bot_token: string;
}

export const settingsService = {
  async getSettings(): Promise<SettingsData> {
    const res = await apiClient.get<SettingsData>("/settings");
    return res.data;
  },

  async updateSettings(data: SettingsData): Promise<SettingsData> {
    const res = await apiClient.post<SettingsData>("/settings", data);
    return res.data;
  },
};
