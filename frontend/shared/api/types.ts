export interface PaginatedResponse<T> {
  content: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
