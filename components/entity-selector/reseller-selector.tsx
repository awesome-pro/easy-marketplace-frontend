'use client';

import { useState } from 'react';
import { EntitySelector, EntitySelectorColumn } from './entity-selector';
import { User, UserRole } from '@/types';
import { getUsers } from '@/services';
import { Badge } from '@/components/ui/badge';

interface ResellerSelectorProps {
  value?: string;
  onChange: (value: string, reseller: User | null) => void;
  placeholder?: string;
  triggerClassName?: string;
  disabled?: boolean;
  selectedReseller?: User | null;
}

export function ResellerSelector({
  value,
  onChange,
  placeholder = 'Select a reseller...',
  triggerClassName,
  disabled = false,
  selectedReseller = null
}: ResellerSelectorProps) {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  // Define columns for the reseller selector
  const columns: EntitySelectorColumn<User>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      className: 'w-[200px]',
      renderCell: (reseller) => (
        <div className="font-medium">{reseller.name}</div>
      )
    },
    {
      header: 'Email',
      accessorKey: 'email',
      className: 'w-[220px]',
      renderCell: (reseller) => (
        <div className="text-muted-foreground truncate">{reseller.email}</div>
      )
    },
    {
      header: 'Role',
      accessorKey: 'role',
      className: 'w-[100px]',
      renderCell: (reseller) => (
        <Badge variant="secondary">{reseller.role}</Badge>
      )
    },
    {
      header: 'AWS ID',
      accessorKey: 'awsId',
      className: 'w-[140px] hidden md:table-cell',
      renderCell: (reseller) => (
        <div className="font-mono text-xs truncate">
          {reseller.awsId || 'Not set'}
        </div>
      )
    },
  ];

  // Function to fetch resellers with server-side pagination and search
  const fetchResellers = async (page: number, limit: number, search: string) => {
    try {
      const response = await getUsers({
        page,
        limit,
        role: UserRole.RESELLER,
        search: search || undefined
      });
      
      // Ensure we have the correct AWS ID field for each reseller
      const resellers = response.data.map(reseller => ({
        ...reseller,
        // Make sure the AWS ID is properly set
        awsId: reseller.awsId || ''
      }));
      
      return {
        data: resellers,
        meta: {
          total: response.meta.total,
          pageSize: response.meta.pageSize || limit,
          currentPage: response.meta.currentPage || page,
          totalPages: response.meta.totalPages || Math.ceil(response.meta.total / limit),
          hasNextPage: response.meta.hasNextPage || page * limit < response.meta.total,
          hasPreviousPage: response.meta.hasPreviousPage || page > 1
        }
      };
    } catch (error) {
      console.error('Error fetching resellers:', error);
      return { 
        data: [], 
        meta: { 
          total: 0, 
          pageSize: limit,
          currentPage: page,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false
        } 
      };
    }
  };

  return (
    <EntitySelector<User>
      title="Select a Reseller"
      columns={columns}
      fetchEntities={fetchResellers}
      getEntityId={(reseller) => reseller.id}
      getEntityName={(reseller) => reseller.name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      triggerClassName={triggerClassName}
      disabled={disabled}
      selectedEntity={selectedReseller}
    />
  );
}
