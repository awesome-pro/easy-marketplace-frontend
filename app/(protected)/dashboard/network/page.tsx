'use client';

import { getUsers, GetUsersParams } from '@/services/users.api';
import { UserList } from '@/components/users/user-list';
import { UserRole } from '@/types/user';

// Function to fetch resellers with filters
const fetchResellers = async (params: GetUsersParams) => {
  return getUsers({
    ...params,
    role: UserRole.ISV,
  });
};

export default function ISVsPage() {
  return (
    <div className="space-y-6 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">ISVs</h2>
        <p className="text-muted-foreground">
          Manage your ISVs and their accounts.
        </p>
      </div>
      <UserList 
        fetchUsers={fetchResellers} 
        role={UserRole.ISV} 
        title="ISV" 
        createPath="/dashboard/network/isvs/new" 
      />
    </div>
  );
}