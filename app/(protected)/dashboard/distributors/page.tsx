'use client';

import { getUsers, GetUsersParams } from '@/services/users.api';
import { UserList } from '@/components/users/user-list';
import { UserRole } from '@/types/user';

// Function to fetch distributors with filters
const fetchDistributors = async (params: GetUsersParams) => {
  return getUsers({
    ...params,
    role: UserRole.DISTRIBUTOR,
  });
};

export default function DistributorsPage() {
  return (
    <div className="space-y-6 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Distributors</h2>
        <p className="text-muted-foreground">
          Manage your distributors and their accounts.
        </p>
      </div>
      <UserList 
        fetchUsers={fetchDistributors} 
        role={UserRole.DISTRIBUTOR} 
        title="Distributor" 
        createPath="/dashboard/isv/distributors/new" 
      />
    </div>
  );
}