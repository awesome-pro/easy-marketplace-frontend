import { ColumnDef } from "@tanstack/react-table";
import { Offer, OfferStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, isPast } from "date-fns";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Cloud,
  CloudOff,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { AwsOffer } from "@/services/offers-aws.api";

// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

// Helper function to get status badge variant
const getStatusBadge = (status: OfferStatus, expirationDate?: Date) => {
  // Check if offer is expired
  const isExpired = expirationDate && isPast(new Date(expirationDate)) && 
    (status === OfferStatus.PENDING || status === OfferStatus.RELEASED);
  
  if (isExpired) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Expired
      </Badge>
    );
  }
  
  switch (status) {
    case OfferStatus.DRAFT:
      return <Badge variant="secondary">Draft</Badge>;
    case OfferStatus.PENDING:
      return <Badge variant="warning">Pending</Badge>;
    case OfferStatus.ACTIVE:
      return <Badge variant="default">Active</Badge>;
    case OfferStatus.RELEASED:
      return <Badge variant="default">Released</Badge>;
    case OfferStatus.ACCEPTED:
      return <Badge variant="success">Accepted</Badge>;
    case OfferStatus.DECLINED:
      return <Badge variant="destructive">Declined</Badge>;
    case OfferStatus.EXPIRED:
      return <Badge variant="outline">Expired</Badge>;
    case OfferStatus.CANCELLED:
      return <Badge variant="outline">Cancelled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
        case "Private":
            return <Badge variant="secondary">Private</Badge>;
        case "Public":
            return <Badge variant="default">Public</Badge>;
        default:
            return <Badge>{visibility}</Badge>;
    }
}
  

// Helper function to get AWS sync status badge
const getAwsSyncBadge = (offer: Offer) => {
  // If no explicit sync status but has AWS URL, consider it synced
  if (!offer.awsEntityId) {
    return offer.awsOfferUrl ? (
      <Badge variant="outline" className="flex items-center gap-1 text-green-600 bg-green-50">
        <Cloud className="h-3 w-3" />
        Synced
      </Badge>
    ) : (
      <Badge variant="outline" className="flex items-center gap-1 text-gray-600 bg-gray-50">
        <CloudOff className="h-3 w-3" />
        Not Synced
      </Badge>
    );
  }
  
  switch (offer.awsEntityId) {
    case 'SYNCED':
      return (
        <Badge variant="outline" className="flex items-center gap-1 text-green-600 bg-green-50">
          <Cloud className="h-3 w-3" />
          Synced
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge variant="outline" className="flex items-center gap-1 text-yellow-600 bg-yellow-50">
          <RefreshCw className="h-3 w-3 animate-spin" />
          Syncing
        </Badge>
      );
    case 'FAILED':
      return (
        <Badge variant="outline" className="flex items-center gap-1 text-red-600 bg-red-50">
          <AlertTriangle className="h-3 w-3" />
          Sync Failed
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Cloud className="h-3 w-3" />
          {offer.awsEntityId}
        </Badge>
      );
  }
};

export type OffersColumnProps = {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
};

export const getOffersColumns = ({
  onView,
  onEdit,
  onDelete,
  onAccept,
  onDecline,
}: OffersColumnProps): ColumnDef<AwsOffer>[] => [
  {
  accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const offer = row.original;
      return (
        <h2>{offer.Name}</h2>
      );
    },
  },
  {
    accessorKey: "OfferSummary.ProductId",
    header: "Listing",
    cell: ({ row }) => {
      const offer = row.original;
      return (
        <Link href={`/products/${offer.OfferSummary.ProductId}`}>
          {offer.OfferSummary.ProductId}
        </Link>
      );
    },
  },
  {
    accessorKey: "OfferSummary.BuyerAccounts",
    header: "BuyerAccounts",
    cell: ({ row }) => {
      const offer = row.original;
      return (
        <div>
          {offer.OfferSummary.BuyerAccounts ? (
            <ul className="list-disc text-primary mx-2">
              {offer.OfferSummary.BuyerAccounts.map((account) => (
                <li key={account}>{account}</li>
              ))}
            </ul>
          ) : (
            <div className="text-muted-foreground">Public offer</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "OfferSummary.AvailabilityEndDate",
    header: "Expires",
    cell: ({ row }) => {
      const offer = row.original;
      if (!offer.OfferSummary.AvailabilityEndDate) return <div className="text-muted-foreground">No expiration</div>;
      
      const expirationDate = new Date(offer.OfferSummary.AvailabilityEndDate);
      const isExpired = isPast(expirationDate);
      const timeDistance = formatDistanceToNow(expirationDate, { addSuffix: true });
      
      return (
        <p className={isExpired ? "text-destructive" : ""}>
          {timeDistance}
        </p>
      );
    },
  },
  {
    accessorKey: "OfferSummary.State",
    header: "Status",
    cell: ({ row }) => {
      const offer = row.original;
      return (
        <Badge>{offer.OfferSummary.State}</Badge>
      )
    },
  },
  {
    accessorKey: "LastModifiedDate",
    header: "Last Modified",
    cell: ({ row }) => {
      const offer = row.original;
      return (
        <p>{formatDistanceToNow(new Date(offer.LastModifiedDate))} ago</p>
      )
    },
  },
  {
    accessorKey: "OfferSummary.ReleaseDate",
    header: "Release Date",
    cell: ({ row }) => {
      const offer = row.original;
      return offer.OfferSummary.ReleaseDate;
    },
  },
  {
    accessorKey: "OfferSummary.Visibility",
    header: "Visibility",
    cell: ({ row }) => {
      const offer = row.original;
      return getVisibilityBadge(offer.Visibility);
    },
  },
  {
    accessorKey: "OfferSummary.ResaleAuthorizationId",
    header: "Resale Authorization ID",
    cell: ({ row }) => {
      const offer = row.original;
      return (
        <Link href={`/resale-authorizations/${offer.OfferSummary.ResaleAuthorizationId}`}>
          {offer.OfferSummary.ResaleAuthorizationId}
        </Link>
      )
    },
  },
  
  {
    id: "actions",
    cell: ({ row }) => {
      const offer = row.original;
      const isPending = offer.OfferSummary.State === "Pending";
      const isExpired = offer.OfferSummary.AvailabilityEndDate && isPast(new Date(offer.OfferSummary.AvailabilityEndDate)) && isPending;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onView(offer.EntityId)}>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(offer.EntityId)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isPending && !isExpired && (
              <>
                <DropdownMenuItem onClick={() => onAccept(offer.EntityId)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Accept
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDecline(offer.EntityId)}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Decline
                </DropdownMenuItem>
              </>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(offer.EntityId)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
