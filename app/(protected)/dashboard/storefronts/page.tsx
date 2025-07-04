import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { StorefrontsList } from '@/components/storefronts/storefronts-list';

export const metadata: Metadata = {
  title: 'Storefronts | Dashboard',
  description: 'Manage your storefronts',
};

export default function StorefrontsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Storefronts</h1>
          <p className="text-muted-foreground">
            Create and manage storefronts for your products and services.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/storefronts/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Storefront
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg p-2">
        <StorefrontsList />
      </div>
    </div>
  );
}
