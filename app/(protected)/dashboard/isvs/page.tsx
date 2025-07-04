'use client';

import { getUsers, GetUsersParams } from '@/services/users.api';
import { UserList } from '@/components/users/user-list';
import { useAuthContext } from '@/providers/auth-provider';
import { UserRole } from '@/types/user';

// Function to fetch distributors with filters
const fetchISVs = async (params: GetUsersParams) => {
  return getUsers({
    ...params,
    role: UserRole.ISV,
  });
};

export default function ISVsPage() {
  const { user } = useAuthContext();
  return (
    <div className="space-y-6 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">ISVs</h2>
        <p className="text-muted-foreground">
          Manage your ISVs and their accounts.
        </p>
      </div>
      {user?.role === UserRole.ADMIN ? (
        <UserList 
        fetchUsers={fetchISVs} 
        role={UserRole.ISV} 
        title="ISV" 
        createPath="/dashboard/isvs/new"
      />
      ) : (
        <UserList 
        fetchUsers={fetchISVs} 
        role={UserRole.ISV} 
        title="ISV" 
      />
      )}
    </div>
  );
}