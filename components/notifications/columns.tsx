import { Notification, NotificationType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVerticalIcon, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DataTableColumnHeader } from "../data-table-column-header";

interface NotificationColumnsProps {
  onDelete: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}

// Helper function to get badge variant based on notification type
const getNotificationTypeVariant = (type: NotificationType) => {
  switch (type) {
    case NotificationType.ORDER:
      return "default";
    case NotificationType.OFFER:
      return "success";
    case NotificationType.DEAL:
      return "warning";
    case NotificationType.SERVICE:
      return "secondary";
    case NotificationType.SYSTEM:
      return "destructive";
    default:
      return "outline";
  }
};

export const getNotificationColumns = ({ onDelete, onMarkAsRead }: NotificationColumnsProps): ColumnDef<Notification>[] => [
  {
    id: "read",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        {!row.original.read ? (
          <div className="h-2 w-2 rounded-full bg-blue-500" title="Unread"></div>
        ) : null}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as NotificationType;
      return (
        <Badge variant={getNotificationTypeVariant(type)}>
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <div className={`max-w-[300px] truncate font-medium ${!row.original.read ? 'font-semibold' : ''}`}>
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "message",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Message" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate text-muted-foreground">
        {row.getValue("message")}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Received" />
    ),
    cell: ({ row }) => format(new Date(row.getValue("createdAt")), "MMM d, yyyy h:mm a"),
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {!row.original.read && (
            <DropdownMenuItem
              onClick={() => onMarkAsRead(row.original.id)}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as read
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(row.original.id)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
