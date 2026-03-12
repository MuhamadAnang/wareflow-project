export type TPaginationMeta = {
  page: number | 1;
  pageSize: number | 10;
  total: number;
  totalPage: number;
};

export type TPaginationResponse<T, M = TPaginationMeta> = {
  data: T[];
  meta: M;
};
