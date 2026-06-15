export interface ApiResponseMessage {
  message: string;
}
export interface TableResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
}
