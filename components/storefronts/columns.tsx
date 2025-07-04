import { ColumnDef } from "@tanstack/react-table";
import { StorefrontProduct } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  EyeOff,
  ShoppingCart,
  Tag
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

export type StorefrontsColumnProps = {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, isVisible: boolean) => void;
};

export const getStorefrontsColumns = ({
  onView,
  onEdit,
  onDelete,
  onToggleVisibility,
}: StorefrontsColumnProps): ColumnDef<StorefrontProduct>[] => [
  {
    accessorKey: "product.name",
    header: "Product",
    cell: ({ row }) => {
      const storefrontProduct = row.original;
      return (
        <div>
          <div className="font-medium">{storefrontProduct.product?.name || "Unknown product"}</div>
          {storefrontProduct.product?.description && (
            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
              {storefrontProduct.product.description}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "product.price",
    header: "Original Price",
    cell: ({ row }) => {
      const storefrontProduct = row.original;
      return (
        <div className="font-medium">
          {formatCurrency(storefrontProduct.product?.price || 0)}
        </div>
      );
    },
  },
  {
    accessorKey: "customPrice",
    header: "Custom Price",
    cell: ({ row }) => {
      const storefrontProduct = row.original;
      return (
        <div className="font-medium">
          {storefrontProduct.customPrice 
            ? formatCurrency(storefrontProduct.customPrice)
            : <span className="text-muted-foreground">Default</span>
          }
        </div>
      );
    },
  },
  {
    accessorKey: "product.categories",
    header: "Categories",
    cell: ({ row }) => {
      const storefrontProduct = row.original;
      const categories = storefrontProduct.product?.categories || [];
      
      if (categories.length === 0) {
        return <span className="text-muted-foreground">No categories</span>;
      }
      
      return (
        <div className="flex flex-wrap gap-1">
          {categories.slice(0, 2).map((category) => (
            <Badge key={category} variant="outline" className="flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              {category}
            </Badge>
          ))}
          {categories.length > 2 && (
            <Badge variant="outline">+{categories.length - 2} more</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "isVisible",
    header: "Visibility",
    cell: ({ row }) => {
      const storefrontProduct = row.original;
      return (
        <Badge variant={storefrontProduct.isVisible ? "success" : "secondary"}>
          {storefrontProduct.isVisible ? "Visible" : "Hidden"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Added On",
    cell: ({ row }) => {
      const storefrontProduct = row.original;
      return (
        <div>
          {format(new Date(storefrontProduct.createdAt), 'MMM d, yyyy')}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const storefrontProduct = row.original;
      
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
            <DropdownMenuItem onClick={() => onView(storefrontProduct.id)}>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(storefrontProduct.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={() => onToggleVisibility(storefrontProduct.id, !storefrontProduct.isVisible)}
            >
              {storefrontProduct.isVisible ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Hide from storefront
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Show in storefront
                </>
              )}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(storefrontProduct.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove from storefront
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
