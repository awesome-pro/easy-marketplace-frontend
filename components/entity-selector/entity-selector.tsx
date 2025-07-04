'use client';

import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Check, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface EntitySelectorColumn<T> {
  header: string;
  accessorKey: keyof T | ((item: T) => string);
  className?: string;
  renderCell?: (item: T) => React.ReactNode;
}

export interface EntitySelectorProps<T> {
  title: string;
  columns: EntitySelectorColumn<T>[];
  fetchEntities: (page: number, limit: number, search: string) => Promise<{
    data: T[];
    meta: {
      total: number;
      pageSize: number;
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    }
  }>;
  getEntityId: (entity: T) => string;
  getEntityName: (entity: T) => string;
  value?: string;
  onChange: (value: string, entity: T | null) => void;
  placeholder?: string;
  triggerClassName?: string;
  disabled?: boolean;
  selectedEntity?: T | null;
}

export function EntitySelector<T>({
  title,
  columns,
  fetchEntities,
  getEntityId,
  getEntityName,
  value,
  onChange,
  placeholder = 'Select an entity...',
  triggerClassName,
  disabled = false,
  selectedEntity = null
}: EntitySelectorProps<T>) {
  const [open, setOpen] = useState(false);
  const [entities, setEntities] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [selected, setSelected] = useState<T | null>(selectedEntity);

  // Memoized fetch function to prevent infinite loops
  const fetchData = React.useCallback(async () => {
    if (!open) return; // Only fetch when dialog is open
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetchEntities(page, 10, debouncedSearch);
      setEntities(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError('Failed to load entities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [fetchEntities, page, debouncedSearch, open]);
  
  // Fetch entities when search, page, or dialog open state changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle entity selection
  const handleSelect = (entity: T) => {
    setSelected(entity);
    onChange(getEntityId(entity), entity);
    setOpen(false);
  };

  // Handle dialog close
  const handleClose = () => {
    setOpen(false);
    setSearch('');
    setPage(1);
  };

  // Get display value for the trigger
  const displayValue = selected ? getEntityName(selected) : placeholder;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`w-full justify-between ${triggerClassName}`}
          disabled={disabled}
        >
          <span className="truncate">{displayValue}</span>
          {selected && (
            <X 
              className="ml-2 h-4 w-4 shrink-0 opacity-50 hover:opacity-100" 
              onClick={(e) => {
                e.stopPropagation();
                setSelected(null);
                onChange('', null);
              }}
            />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] lg:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Entities table */}
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  {columns.map((column, index) => (
                    <TableHead key={index} className={column.className}>
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading state
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                      {columns.map((_, colIndex) => (
                        <TableCell key={`skeleton-cell-${colIndex}`}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : error ? (
                  // Error state
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="text-center py-4 text-muted-foreground">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : entities.length === 0 ? (
                  // Empty state
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="text-center py-4 text-muted-foreground">
                      No entities found
                    </TableCell>
                  </TableRow>
                ) : (
                  // Data rows
                  entities.map((entity) => {
                    const isSelected = selected && getEntityId(selected) === getEntityId(entity);
                    return (
                      <TableRow 
                        key={getEntityId(entity)}
                        className={`cursor-pointer hover:bg-muted ${isSelected ? 'bg-muted' : ''}`}
                        onClick={() => handleSelect(entity)}
                      >
                        <TableCell>
                          {isSelected && <Check className="h-4 w-4 text-primary" />}
                        </TableCell>
                        {columns.map((column, colIndex) => {
                          let cellContent: React.ReactNode;
                          
                          if (column.renderCell) {
                            cellContent = column.renderCell(entity);
                          } else {
                            const value = typeof column.accessorKey === 'function' 
                              ? column.accessorKey(entity) 
                              : entity[column.accessorKey as keyof T];
                            cellContent = value as React.ReactNode;
                          }
                          
                          return (
                            <TableCell key={`cell-${colIndex}`}>
                              {cellContent}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {entities.length} of {meta.total} results
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={!meta.hasPreviousPage || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={!meta.hasNextPage || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
