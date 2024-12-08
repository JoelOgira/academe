"use client";

import { useRouter } from "next/navigation";
import { ITEM_PER_PAGE } from "@/lib/utils";
import { CardFooter } from "./ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

export default function TablePagination({
  page,
  count,
}: {
  page: number;
  count: number;
}) {
  const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
  const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count;

  const router = useRouter();

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(newPage));
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const totalPages = Math.ceil(count / ITEM_PER_PAGE);

  const renderPaginationLinks = (maxLinks: number) => {
    const halfMax = Math.floor(maxLinks / 2);
    let start = Math.max(1, page - halfMax);
    let end = Math.min(totalPages, start + maxLinks - 1);

    if (end - start + 1 < maxLinks) {
      start = Math.max(1, end - maxLinks + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, index) => {
      const pageIndex = start + index;
      return (
        <PaginationLink
          onClick={() => changePage(pageIndex)}
          isActive={page === pageIndex}
          key={pageIndex}
          className="cursor-pointer"
        >
          {pageIndex}
        </PaginationLink>
      );
    });
  };

  return (
    <CardFooter className="pb-4">
      <Pagination>
        <PaginationContent className="justify-between flex-wrap">
          <PaginationItem>
            <PaginationPrevious
              disabled={!hasPrev}
              onClick={() => changePage(page - 1)}
            />
          </PaginationItem>

          <PaginationItem className="hidden lg:flex">
            {renderPaginationLinks(20)}
          </PaginationItem>

          <PaginationItem className="hidden md:flex lg:hidden">
            {renderPaginationLinks(10)}
          </PaginationItem>

          <PaginationItem className="flex md:hidden">
            {renderPaginationLinks(5)}
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              disabled={!hasNext}
              onClick={() => changePage(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </CardFooter>
  );
}
