'use client';

import { Column } from '@tanstack/react-table';
import { ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
  description?: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  description,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div className={cn('text-sm font-medium text-muted-foreground', className)}>
        {title}
      </div>
    );
  }

  const sortDirection = column.getIsSorted();

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 data-[state=open]:bg-accent"
                >
                  <span className="text-sm font-medium">
                    {title}
                  </span>
                  {sortDirection === 'desc' ? (
                    <ChevronDown className="ml-2 h-4 w-4" />
                  ) : sortDirection === 'asc' ? (
                    <ChevronUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => column.toggleSorting(false)}
                  className="gap-2"
                >
                  <ChevronUp className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Asc
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => column.toggleSorting(true)}
                  className="gap-2"
                >
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Desc
                </DropdownMenuItem>
                {column.getCanHide() && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => column.toggleVisibility(false)}
                    >
                      Hide
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          {description && (
            <TooltipContent>
              <p className="text-sm">{description}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
