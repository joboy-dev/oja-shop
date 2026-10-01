export interface PaginationData {
  current_page: number;
  size: number;
  total: number;
  pages: number;
  previous_page?: string;
  next_page?: string;
}

export interface ApiResponse<T> {
  status_code: number;
  success: boolean;
  message: string;
  data?: T;
  pagination_data?: PaginationData;
}