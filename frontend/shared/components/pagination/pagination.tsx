import { Field, FieldLabel } from "@/components/ui/field";
import {
  Pagination as UiPagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
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
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;
  const isSinglePage = totalPages === 1;

  if (!totalPages) {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-4 w-[98%] mx-auto mt-10 flex-wrap mr-5">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
        <Select
          onValueChange={(value) => onLimitChange(Number(value))}
          value={limit.toString() ?? PAGINATION_PAGE_SIZE_DEFAULT}
        >
          <SelectTrigger className="w-20" id="select-rows-per-page">
            <SelectValue>
              {limit.toString() ?? PAGINATION_PAGE_SIZE_DEFAULT}
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
      {!isSinglePage && (
        <UiPagination className="mx-0 w-auto">
          <PaginationContent className="flex items-center justify-center gap-2">
            <PaginationPrevious
              className={cn(
                "cursor-pointer",
                isFirstPage && "opacity-50 pointer-events-none",
              )}
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </PaginationPrevious>
            {!isFirstPage && (
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
            )}
            {!isLastPage && (
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationNext
              className={cn(
                "cursor-pointer",
                isLastPage && "opacity-50 pointer-events-none",
              )}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </PaginationNext>
          </PaginationContent>
        </UiPagination>
      )}
    </div>
  );
};

export default Pagination;
