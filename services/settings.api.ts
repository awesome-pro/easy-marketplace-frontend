import { api } from '@/lib/axios';
import {
  ProfileSettings,
  UpdateProfileSettingsDto,
  SecuritySettingsDto,
  SecuritySettingsResponse
} from '@/types';

export const settingsApi = {
  // Profile Settings
  getProfileSettings: async () => {
    return api.get<ProfileSettings>('/settings/profile');
  },

  updateProfileSettings: async (data: UpdateProfileSettingsDto) => {
    return api.patch<ProfileSettings>('/settings/profile', data);
  },

  // Security Settings
  updateSecuritySettings: async (data: SecuritySettingsDto) => {
    return api.patch<SecuritySettingsResponse>('/settings/security', data);
  }
};

export default settingsApi;
