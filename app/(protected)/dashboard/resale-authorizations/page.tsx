'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ResaleAuthorizationList } from '@/components/isv/resale-authorizations/resale-authorization-list';

export default function ResellerAuthorisationsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <span className='flex items-center justify-between'>
        <h1 className="text-3xl font-bold tracking-tight">Resale Authorizations</h1>
        <Button asChild>
          <Link href="/dashboard/resale-authorizations/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Resale Authorization
          </Link>
        </Button>
      </span>
      <ResaleAuthorizationList />
    </div>
  );
}
