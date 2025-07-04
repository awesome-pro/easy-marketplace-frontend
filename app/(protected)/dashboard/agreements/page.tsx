import { Metadata } from 'next';
import { AgreementsList } from '@/components/agreements/agreements-list';

export const metadata: Metadata = {
  title: 'Agreements | Dashboard',
  description: 'Manage your agreements',
};

export default function AgreementsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Agreements</h1>

      <div className="border rounded-lg p-2">
        <AgreementsList />
      </div>
    </div>
  );
}
