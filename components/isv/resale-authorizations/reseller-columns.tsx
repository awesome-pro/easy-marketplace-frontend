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

export const getResellerAuthorizationColumns = ({ onView, onActivate, onCancel }: ResaleAuthorizationColumnsProps): ColumnDef<ResaleAuthorization>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Authorization Name" />
    ),
    cell: ({ row }) => (
      <Link href={`/dashboard/resale-authorizations/${row.original.id}`} className="font-medium max-w-[200px] truncate text-primary">
        {row.original.name || `Authorization for ${row.original.product.name}`}
      </Link>
    ),
  },
  {
    accessorKey: "product.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate">
        {row.original.product.name}
      </span>
    ),
  },
  {
    accessorKey: "isv.company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ISV" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.isv.company}</span>
        <span className="text-xs text-muted-foreground">{row.original.isv.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status as ResaleAuthorizationStatus;
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
    accessorKey: "createdDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => row.original.createdDate ? format(new Date(row.original.createdDate), "MMM d, yyyy") : "N/A",
  },
  {
    accessorKey: "availabilityEndDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expires" />
    ),
    cell: ({ row }) => row.original.availabilityEndDate ? format(new Date(row.original.availabilityEndDate), "MMM d, yyyy") : "No expiration",
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      const authorization = row.original;
      const isDraft = authorization.status === ResaleAuthorizationStatus.Draft || authorization.status === ResaleAuthorizationStatus.Pending;
      const isActive = authorization.status === ResaleAuthorizationStatus.Active;
      
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
            <DropdownMenuItem onClick={() => onView(authorization.id)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            {isDraft && (
              <DropdownMenuItem onClick={() => onActivate(authorization.id)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Activate
              </DropdownMenuItem>
            )}
            {(isDraft || isActive) && (
              <DropdownMenuItem onClick={() => onCancel(authorization.id)}>
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
