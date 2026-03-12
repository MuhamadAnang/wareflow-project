import { TPaginationMeta, TPaginationResponse } from "@/types/meta";

interface IPaginationParams {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

const convertPaginationMeta = ({
  currentPage,
  pageSize,
  totalItems,
}: IPaginationParams): TPaginationMeta => ({
  page: currentPage,
  pageSize,
  total: totalItems,
  totalPage: Math.ceil(totalItems / pageSize),
});

export const paginationResponseMapper = <T>(
  data: T[],
  meta: IPaginationParams,
): TPaginationResponse<T> => ({
  data,
  meta: Object.freeze(convertPaginationMeta(meta)),
});

export const calculateOffset = (page: number, pageSize: number): number => {
  return (page - 1) * pageSize;
};
