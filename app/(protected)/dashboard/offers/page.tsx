import { Metadata } from 'next';
import { OffersList } from '@/components/offers/offers-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { OffersAwsList } from '@/components/offers/offers-aws-list';

export const metadata: Metadata = {
  title: 'Offers | Dashboard',
  description: 'Manage your offers',
};

export default function OffersPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offers</h1>
          <p className="text-muted-foreground">
            Create and manage offers for your products and services.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/offers/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Offer
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg p-2">
        <OffersAwsList />
      </div>
    </div>
  );
}
