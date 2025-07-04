export interface PaginationMeta {
    total: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
  }
  
  export function createPaginationMeta(
    total: number,
    pageSize: number,
    currentPage: number
  ): PaginationMeta {
    const totalPages = Math.ceil(total / pageSize);
    
    return {
      total,
      pageSize,
      currentPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    };
  }
  
  export function createPaginatedResponse<T>(
    data: T[],
    total: number,
    pageSize: number,
    currentPage: number
  ): PaginatedResponse<T> {
    return {
      data,
      meta: createPaginationMeta(total, pageSize, currentPage)
    };
  }