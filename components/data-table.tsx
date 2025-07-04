'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ArrowUpDown, Plus, RefreshCw } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import EstateLoading from './loading';

interface DataTableToolbarProps {
  searchPlaceholder?: string;
  createLink?: string;
  createButtonLabel?: string;
  additionalButtons?: React.ReactNode;
}

interface ServerPaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  // Optional properties for token-based pagination
  nextToken?: string;
  tokenStack?: string[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  error?: Error | null;
  searchKey?: string;
  onRowClick?: (row: TData) => void;
  rowSelection?: boolean;
  defaultPageSize?: number;
  toolbar?: DataTableToolbarProps;
  onRowSelectionChange?: (value: any) => void;
  rowSelectionState?: any;
  additionalToolbarContent?: React.ReactNode;
  serverPagination?: ServerPaginationProps;
  // Server-side search props
  serverSideSearch?: boolean;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  searchLoading?: boolean;
  // Refresh functionality
  onRefresh?: () => void;
  refreshLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  error,
  searchKey,
  onRowClick,
  rowSelection = false,
  defaultPageSize = 10,
  toolbar,
  onRowSelectionChange,
  rowSelectionState,
  additionalToolbarContent,
  serverPagination,
  serverSideSearch = false,
  onSearchChange,
  searchValue = '',
  searchLoading = false,
  onRefresh,
  refreshLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [internalRowSelectionState, setInternalRowSelectionState] = React.useState({});

  // Handle row selection changes
  const handleRowSelectionChange = React.useCallback(
    (value: any) => {
      if (onRowSelectionChange) {
        onRowSelectionChange(value);
      } else {
        setInternalRowSelectionState(value);
      }
    },
    [onRowSelectionChange]
  );

  const effectiveRowSelectionState = rowSelectionState || internalRowSelectionState;

  // Initialize pagination state based on server pagination or default values
  const [pagination, setPagination] = React.useState({
    pageIndex: serverPagination ? serverPagination.currentPage - 1 : 0,
    pageSize: serverPagination ? serverPagination.pageSize : defaultPageSize,
  });

  // Update pagination state when server pagination changes
  React.useEffect(() => {
    if (serverPagination) {
      setPagination({
        pageIndex: serverPagination.currentPage - 1,
        pageSize: serverPagination.pageSize,
      });
    }
  }, [serverPagination]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: serverPagination ? undefined : getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: handleRowSelectionChange,
    manualPagination: !!serverPagination,
    pageCount: serverPagination?.totalPages || 0,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: effectiveRowSelectionState,
      pagination,
    },
    enableRowSelection: rowSelection,
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row w-full md:w-auto flex-1 items-start sm:items-center gap-4">
          {searchKey && (
            <div className="relative w-full sm:max-w-md">
              <Input
                placeholder={toolbar?.searchPlaceholder || `Search ${searchKey}...`}
                value={serverSideSearch ? searchValue : (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
                onChange={(event) => {
                  if (serverSideSearch) {
                    if (onSearchChange) {
                      onSearchChange(event.target.value);
                    }
                  } else {
                    table.getColumn(searchKey)?.setFilterValue(event.target.value);
                  }
                }}
                className="w-full"
                // disabled={searchLoading}
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {toolbar?.additionalButtons}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
          {additionalToolbarContent}
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={refreshLoading || isLoading}
              className="ml-0"
            >
              <RefreshCw className={`h-4 w-4 ${refreshLoading ? 'animate-spin' : ''}`} />
            </Button>
          )}
          {toolbar?.createLink && (
            <Button asChild size="sm">
              <Link href={toolbar.createLink}>
                <Plus className="mr-1 h-4 w-4" />
                {toolbar.createButtonLabel || 'Create New'}
              </Link>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-0">
                <span className="hidden sm:inline-block">Columns</span> <ChevronDown className="ml-0 sm:ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-scroll">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {rowSelection && (
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={table.getIsAllPageRowsSelected()}
                      onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                      }
                    />
                  </TableHead>
                )}
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center space-x-2 ${
                          header.column.getCanSort() ? 'cursor-pointer' : ''
                        }`}
                        onClick={
                          header.column.getCanSort()
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <EstateLoading />
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (rowSelection ? 1 : 0)}
                  className="h-24 text-center"
                >
                  Error: {error.message}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => onRowClick?.(row.original)}
                  className={onRowClick ? 'cursor-pointer hover:bg-muted' : ''}
                >
                  {rowSelection && (
                    <TableCell className="w-[40px]">
                      <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                      />
                    </TableCell>
                  )}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (rowSelection ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {rowSelection && table.getFilteredSelectedRowModel().rows.length > 0 &&
            `${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} row(s) selected`}
        </div>
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
          <div className="text-sm text-muted-foreground">
            {serverPagination ? (
              <>Page {serverPagination.currentPage} of {serverPagination.totalPages}</>
            ) : (
              <>Page {pagination.pageIndex + 1} of {table.getPageCount() || 1}</>
            )}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (serverPagination) {
                  serverPagination.onPageChange(serverPagination.currentPage - 1);
                } else {
                  table.previousPage();
                }
              }}
              disabled={serverPagination ? !serverPagination.hasPreviousPage : !table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (serverPagination) {
                  serverPagination.onPageChange(serverPagination.currentPage + 1);
                } else {
                  table.nextPage();
                }
              }}
              disabled={serverPagination ? !serverPagination.hasNextPage : !table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}