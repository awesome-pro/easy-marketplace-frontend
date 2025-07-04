import { ColumnDef } from "@tanstack/react-table";
import { AgreementStatus } from "@/types";
import { AwsAgreement } from "@/types/aws-agreement";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  Eye, 
  Ban,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

// Helper function to get status badge variant
const getStatusBadge = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          ACTIVE
        </Badge>
      );
    case "EXPIRED":
      return <Badge variant="secondary">EXPIRED</Badge>;
    case "CANCELLED":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <Ban className="h-3 w-3" />
          CANCELLED
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export type AgreementsColumnProps = {
  // Removed onView, onEdit, onDelete, onCancel as we only need view now
};

export const getAgreementsColumns = (
  props?: AgreementsColumnProps
): ColumnDef<AwsAgreement>[] => [
  {
    accessorKey: "agreementId",
    header: "Agreement ID",
    cell: ({ row }) => {
      const agreement = row.original;
      return (
          <Link 
            href={`/dashboard/agreements/${agreement.agreementId}`}
            className="font-medium text-primary hover:text-primary/80 hover:underline"
          >
            {agreement.agreementId}
          </Link>
      );
    },
  },
  {
    accessorKey: "agreementType",
    header: "Agreement Type",
    cell: ({ row }) => {
      const agreement = row.original;
      return (
          <Badge className="font-medium">{agreement.agreementType}</Badge>
      );
    },
  },
  {
    accessorKey: "proposalSummary.resources.0.id",
    header: "Product ID",
    cell: ({ row }) => {
      const agreement = row.original;
      const resourceId = agreement.proposalSummary?.resources?.[0]?.id;
      const resourceType = agreement.proposalSummary?.resources?.[0]?.type;
      return (
        <div>
          <Link 
            href={`/dashboard/listing/${resourceId}`}
            className="font-medium text-primary hover:text-primary/80 hover:underline"
          >
            {resourceId || "Unknown product"}
          </Link>
          {resourceType && (
            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
              {resourceType}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "proposalSummary.offerId",
    header: "Offer ID",
    cell: ({ row }) => {
      const agreement = row.original;
      const offerId = agreement.proposalSummary?.offerId;
      return (
          <Link 
            href={`/dashboard/offers/${offerId}`}
            className="font-medium text-primary hover:text-primary/80 hover:underline"
          >
            {offerId || "Unknown offer"}
          </Link>
      );
    },
  },
  {
    accessorKey: "acceptor.accountId",
    header: "Acceptor",
    cell: ({ row }) => {
      const agreement = row.original;
      return (
        <Link 
          href={`/dashboard/buyers/${agreement.acceptor?.accountId}`}
          className="font-medium text-primary hover:text-primary/80 hover:underline"
        >
          {agreement.acceptor?.accountId || "Unknown buyer"}
        </Link>
      );
    },
  },
  {
    accessorKey: "acceptanceTime",
    header: "Acceptance Time",
    cell: ({ row }) => {
      const agreement = row.original;
      return (
       <span>{agreement.acceptanceTime ? format(new Date(agreement.acceptanceTime), 'MMM d, yyyy') : 'N/A'}</span>
      );
    },
  },
 
  {
    accessorKey: "startTime",
    header: "Start Date",
    cell: ({ row }) => {
      const agreement = row.original;
      return (
        <p>{agreement.startTime ? format(new Date(agreement.startTime), 'MMM d, yyyy') : 'N/A'}</p>
      );
    },
  },
  {
    accessorKey: "endTime",
    header: "End Date",
    cell: ({ row }) => {
      const agreement = row.original;
      return (  
        <p>{agreement.endTime ? format(new Date(agreement.endTime), 'MMM d, yyyy') : 'N/A'}</p>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const agreement = row.original;
      return getStatusBadge(agreement.status);
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const agreement = row.original;
      
      return (
        <Link href={`/dashboard/agreements/${agreement.agreementId}`}>
          <Button size="sm" className="h-8 px-3">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
        </Link>
      );
    },
  },
];