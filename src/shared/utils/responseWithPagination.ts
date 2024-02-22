interface Pagination {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  limit: number;
}

export const responseWithPagination = (
  { totalCount, pageCount, limit, currentPage }: Pagination,
  data: any,
) => ({
  totalCount,
  perPage: +limit,
  pageCount,
  totalPages: Math.ceil(totalCount / limit),
  currentPage: +currentPage,
  data,
});
