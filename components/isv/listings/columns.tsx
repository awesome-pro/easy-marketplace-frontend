import { Product, ProductStatus, ProductVisibility } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Edit, Trash2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface ProductColumnsProps {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
}

// Helper function to get badge variant based on product status
const getStatusVariant = (status: ProductStatus) => {
  switch (status) {
    case ProductStatus.PUBLISHED:
      return "success";
    case ProductStatus.DRAFT:
      return "secondary";
    case ProductStatus.PENDING_REVIEW:
      return "warning";
    case ProductStatus.REJECTED:
      return "destructive";
    case ProductStatus.ARCHIVED:
      return "outline";
    default:
      return "default";
  }
};

// Helper function to get badge variant based on product visibility
const getVisibilityVariant = (visibility: ProductVisibility) => {
  switch (visibility) {
    case ProductVisibility.PUBLIC:
      return "default";
    case ProductVisibility.PRIVATE:
      return "secondary";
    case ProductVisibility.UNLISTED:
      return "outline";
    default:
      return "default";
  }
};

export const getProductColumns = ({ onView, onEdit, onDelete, onPublish }: ProductColumnsProps): ColumnDef<Product>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Name" />
    ),
    cell: ({ row }) => (
      <Link href={`/dashboard/listings/${row.original.id}`} className="font-medium max-w-[200px] truncate text-primary">
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status as ProductStatus;
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
    accessorKey: "visibility",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Visibility" />
    ),
    cell: ({ row }) => {
      const visibility = row.original.visibility as ProductVisibility;
      const icon = visibility === ProductVisibility.PUBLIC ? 
        <Eye className="h-3 w-3 mr-1" /> : 
        <EyeOff className="h-3 w-3 mr-1" />;
      
      return (
        <Badge variant={getVisibilityVariant(visibility)} className="flex items-center">
          {icon}
          {visibility}
        </Badge>
      );
    },
  },
  {
    accessorKey: "awsEntityId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="AWS Entity ID" />
    ),
    cell: ({ row }) => row.original.awsEntityId ?? "Not Synced",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      if (!product.price) return <span className="text-muted-foreground">Not set</span>;
      
      return (
        <div className="flex items-center gap-2">
         <strong>{formatCurrency(product.price, product.currency)}</strong>
         <Badge variant="success">{product.billingPeriod}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => format(new Date(row.original.createdAt), "MMM d, yyyy"),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Updated" />
    ),
    cell: ({ row }) => format(new Date(row.original.updatedAt), "MMM d, yyyy"),
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      const isDraft = product.status === ProductStatus.DRAFT;
      
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
            <DropdownMenuItem onClick={() => onView(product.id)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(product.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            {isDraft && (
              <DropdownMenuItem onClick={() => onPublish(product.id)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Publish
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(product.id)}
              className="text-red-600 focus:text-red-600"
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
