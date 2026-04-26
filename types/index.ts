export type Option<T = string> = {
  label: string;
  value: T;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};
