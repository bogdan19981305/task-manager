import { Field, FieldLabel } from "@/components/ui/field";
import {
  Pagination as UiPagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PAGINATION_PAGE_SIZE_DEFAULT,
  PAGINATION_PAGE_SIZE_OPTIONS,
} from "@/config/global";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

const Pagination = ({
  page,
  limit,
  totalPages,
  onPageChange,
  onLimitChange,
}: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return (
    <div className="flex items-center justify-end gap-4 w-[98%] mx-auto mt-10 flex-wrap mr-5">
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
        <Select
          defaultValue={
            limit.toString() ?? PAGINATION_PAGE_SIZE_DEFAULT.toString()
          }
          onValueChange={(value) => onLimitChange(Number(value))}
          value={limit.toString() ?? PAGINATION_PAGE_SIZE_DEFAULT.toString()}
        >
          <SelectTrigger className="w-20" id="select-rows-per-page">
            <SelectValue>
              {limit.toString() ?? PAGINATION_PAGE_SIZE_DEFAULT.toString()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              {PAGINATION_PAGE_SIZE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <UiPagination className="mx-0 w-auto">
        {!isFirstPage && (
          <PaginationPrevious onClick={() => onPageChange(page - 1)}>
            <PaginationLink className="cursor-pointer" isActive={!isFirstPage}>
              Previous
            </PaginationLink>
          </PaginationPrevious>
        )}
        <PaginationEllipsis />
        <PaginationContent className="flex items-center justify-center gap-2">
          {pages.map((pageItem) => (
            <PaginationItem key={pageItem}>
              <PaginationLink
                isActive={pageItem === page}
                onClick={() => onPageChange(pageItem)}
              >
                {pageItem}
              </PaginationLink>
            </PaginationItem>
          ))}
          {!isLastPage && (
            <PaginationNext onClick={() => onPageChange(page + 1)}>
              <PaginationLink className="cursor-pointer" isActive={!isLastPage}>
                Next
              </PaginationLink>
            </PaginationNext>
          )}
        </PaginationContent>
      </UiPagination>
    </div>
  );
};

export default Pagination;
