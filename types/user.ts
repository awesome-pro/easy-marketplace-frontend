import { SubscriptionStatus } from "./agreement";

export enum UserRole {
    ISV = 'ISV',
    RESELLER = 'RESELLER',
    DISTRIBUTOR = 'DISTRIBUTOR',
    BUYER = 'BUYER',
    ADMIN = 'ADMIN'
}

export enum AuthProvider {
    LOCAL = 'LOCAL',
    AWS = 'AWS'
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
    DELETED = 'DELETED',
    TRIAL_ENDED = 'TRIAL_ENDED'
}

export enum ConnectionStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    AUTHORIZED = 'AUTHORIZED',
    REVOKED = 'REVOKED'
}

export enum DealStatus {
    NEGOTIATION = 'NEGOTIATION',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING', 
    DRAFT = 'DRAFT'   
}

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: UserRole;
    status: UserStatus;
    awsId?: string;
}

export interface CompleteUser extends User {
    s3BucketName: string;
    s3Prefix: string;
    snsTopicArn: string;
    awsRoleArn: string;
    password?: string;
    company: string;
    emailVerified: boolean;
    verificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    authProvider: AuthProvider;
    awsAccessToken?: string;
    awsRefreshToken?: string;
    awsTokenExpiry?: Date;
    createdAt: Date;
    updatedAt: Date;
    jobTitle?: string;
    coverImage: string;
    connectionStatus?: ConnectionStatus;
    connectionId?: string;
}

export enum Plan {
    STARTER = 'STARTER',
    PRO = 'PRO',
    ENTERPRISE = 'ENTERPRISE'
}

export interface Subscription {
    id: string;
    userId: string;
    price: number;
    plan: Plan;
    status: SubscriptionStatus;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}