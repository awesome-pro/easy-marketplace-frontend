import { ResaleAuthorization, ResaleAuthorizationStatus } from "@/types/resale-authorization";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Edit, Trash2, Eye, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import Link from "next/link";

interface ResaleAuthorizationColumnsProps {
  onView: (id: string) => void;
  onActivate: (id: string) => void;
  onCancel: (id: string) => void;
}

// Helper function to get badge variant based on authorization status
const getStatusVariant = (status: ResaleAuthorizationStatus) => {
  switch (status) {
    case ResaleAuthorizationStatus.Active:
      return "success";
    case ResaleAuthorizationStatus.Draft:
      return "secondary";
    case ResaleAuthorizationStatus.Pending:
      return "warning";
    case ResaleAuthorizationStatus.Rejected:
      return "destructive";
    case ResaleAuthorizationStatus.Cancelled:
      return "outline";
    case ResaleAuthorizationStatus.Expired:
      return "outline";
    case ResaleAuthorizationStatus.Restricted:
      return "warning";
    default:
      return "default";
  }
};

export const getResaleAuthorizationColumns = ({ onView, onActivate, onCancel }: ResaleAuthorizationColumnsProps): ColumnDef<any>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Authorization Name" />
    ),
    cell: ({ row }) => (
      <Link href={`/dashboard/resale-authorizations/${row.original.EntityId}`} className="font-medium max-w-[200px] truncate text-primary">
        {row.original.Name || `Authorization for ${row.original.Name}`}
      </Link>
    ),
  },
  {
    accessorKey: "ResaleAuthorizationSummary.ProductId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product ID" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate">
        {row.original.ResaleAuthorizationSummary.ProductId}
      </span>
    ),
  },
  {
    accessorKey: "ResaleAuthorizationSummary.ProductName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Name" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate">
        {row.original.ResaleAuthorizationSummary.ProductName}
      </span>
    ),
  },
  {
    accessorKey: "ResaleAuthorizationSummary.ResellerLegalName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reseller Name" />
    ),
    cell: ({ row }) => (
      <Link href={`/dashboard/resellers/${row.original.ResaleAuthorizationSummary.ResellerAccountID}`} className="max-w-[200px] truncate">
        {row.original.ResaleAuthorizationSummary.ResellerLegalName}
      </Link>
    ),
  },
  {
    accessorKey: "ResaleAuthorizationSummary.ResellerAccountID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reseller Account ID" />
    ),
    cell: ({ row }) => (
      <Link href={`/dashboard/resellers/${row.original.ResaleAuthorizationSummary.ResellerAccountID}`} className="max-w-[200px] truncate">
        {row.original.ResaleAuthorizationSummary.ResellerAccountID}
      </Link>
    ),
  },
  {
    accessorKey: "ResaleAuthorizationSummary.Status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.ResaleAuthorizationSummary.Status as ResaleAuthorizationStatus;
      return (
        <Badge variant={getStatusVariant(status)}>
          {status}  
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "ResaleAuthorizationSummary.CreatedDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => row.original.ResaleAuthorizationSummary.CreatedDate ? format(new Date(row.original.ResaleAuthorizationSummary.CreatedDate), "MMM d, yyyy") : "N/A",
  },
  {
    accessorKey: "ResaleAuthorizationSummary.AvailabilityEndDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expires" />
    ),
    cell: ({ row }) => row.original.ResaleAuthorizationSummary.AvailabilityEndDate ? format(new Date(row.original.ResaleAuthorizationSummary.AvailabilityEndDate), "MMM d, yyyy") : "No expiration",
  },
  {
    accessorKey: "LastModifiedDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Modified" />
    ),
    cell: ({ row }) => row.original.LastModifiedDate ? format(new Date(row.original.LastModifiedDate), "MMM d, yyyy") : "N/A",
  },
  {
    accessorKey: "ResaleAuthorizationSummary.OfferExtendedStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Offer Extended Status" />
    ),
    cell: ({ row }) => row.original.ResaleAuthorizationSummary.OfferExtendedStatus,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      const authorization = row.original;
      return (
        <Button onClick={() => onView(authorization.EntityId)}>
          View
        </Button>
      );
    },
  },
];
