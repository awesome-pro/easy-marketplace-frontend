export interface ProfileSettings {
  id: string;
  email: string;
  name: string;
  company: string;
  role: string;
  awsId?: string;
  status: string;
  emailVerified: boolean;
  authProvider: string;
  isvProfile?: any;
  resellerProfile?: any;
  distributorProfile?: any;
  buyerProfile?: any;
  awsMarketplaceId?: string;
  jobTitle?: string;
}

export interface UpdateProfileSettingsDto {
  name?: string;
  email?: string;
  company?: string;
  jobTitle?: string;
  awsMarketplaceId?: string;
  autoPublishToAws?: boolean;
}

export interface SecuritySettingsDto {
  currentPassword?: string;
  newPassword?: string;
  enable2FA?: boolean;
}

export interface SecuritySettingsResponse {
  success: boolean;
  message: string;
}
