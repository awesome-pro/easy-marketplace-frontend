'use client';

import { getUsersWithConnectionStatus, GetUsersParams } from '@/services/users.api';
import { UserList } from '@/components/users/user-list';
import { UserRole } from '@/types/user';
import { requestConnection, acceptConnection, rejectConnection } from '@/services/connections.api';
import { toast } from 'sonner';

// Function to fetch resellers with connection status
const fetchResellers = async (params: GetUsersParams) => {
  return getUsersWithConnectionStatus({
    ...params,
    role: UserRole.RESELLER,
  });
};

export default function ResellersPage() {
  // Handle connection request
  const handleConnectionRequest = async (resellerId: string) => {
    try {
      await requestConnection(resellerId);
      toast.success('Connection request sent successfully');
      return true;
    } catch (error: any) {
      toast.error(`Failed to send connection request: ${error.message}`);
      return false;
    }
  };

  // Handle accept connection
  const handleAcceptConnection = async (connectionId: string) => {
    try {
      await acceptConnection(connectionId);
      toast.success('Connection accepted successfully');
      return true;
    } catch (error: any) {
      toast.error(`Failed to accept connection: ${error.message}`);
      return false;
    }
  };

  // Handle reject connection
  const handleRejectConnection = async (connectionId: string) => {
    try {
      await rejectConnection(connectionId);
      toast.success('Connection rejected successfully');
      return true;
    } catch (error: any) {
      toast.error(`Failed to reject connection: ${error.message}`);
      return false;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Resellers</h2>
        <p className="text-muted-foreground">
          Manage your resellers and their connections.
        </p>
      </div>
      <UserList 
        fetchUsers={fetchResellers} 
        role={UserRole.RESELLER} 
        title="Reseller" 
        // createPath="/dashboard/isv/resellers/new"
        onConnectionRequest={handleConnectionRequest}
        onAcceptConnection={handleAcceptConnection}
        onRejectConnection={handleRejectConnection}
        showConnectionStatus={true}
      />
    </div>
  );
}