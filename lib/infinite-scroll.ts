import { AxiosResponse } from "axios";

export const getNextPage = <T extends AxiosResponse>(lastPage: T) => {
  const data = lastPage.data;

  const { meta } = data;

  if (!meta) return undefined;

  if (meta.page < meta.totalPage) {
    return { page: meta.page + 1, pageSize: meta.pageSize };
  }

  return undefined;
};
