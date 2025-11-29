import { TableParams } from '@shared/components/table/table.component';

export const formatTableParamsToQueryParams = (params: TableParams): string => {
  const { searchParam, sortBy, sortDirection, pagination } = params;
  let result = ``;

  if (searchParam) result += `searchParam=${searchParam}&`;
  if (sortBy) result += `sortBy=${sortBy}&`;
  if (sortDirection) result += `order=${sortDirection}&`;
  if (pagination) result += `limit=${pagination.limit}&page${pagination.page}`;

  return result;
};
