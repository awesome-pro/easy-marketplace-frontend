export enum ConnectionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  AUTHORIZED = 'AUTHORIZED',
  REVOKED = 'REVOKED'
}

export interface Connection {
  id: string;
  user1Id: string;
  user1: {
    id: string;
    name: string;
    email: string;
    company: string;
  };
  user2Id: string;
  user2: {
    id: string;
    name: string;
    email: string;
    company: string;
  };
  status: ConnectionStatus;
  awsConnectionId?: string;
  awsSyncStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ConnectionRequest {
  user1Id: string;
  user2Id: string;
}

export interface ConnectionResponse {
  success: boolean;
  message: string;
  connection: Connection;
}

export interface ConnectionsResponse {
  connections: Connection[];
  total: number;
  page: number;
  limit: number;
}
