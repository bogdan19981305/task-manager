import { Field, FieldLabel } from "@/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TasksPaginationProps = {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

const TasksPagination = ({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: TasksPaginationProps) => {
  return (
    <div className="flex items-center justify-end gap-4 w-[98%] mx-auto mt-10 flex-wrap">
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
        <Select
          defaultValue={limit.toString()}
          onValueChange={(value) => onLimitChange(Number(value))}
          value={limit.toString()}
        >
          <SelectTrigger className="w-20" id="select-rows-per-page">
            <SelectValue>{limit.toString()}</SelectValue>
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              className="cursor-pointer"
              isActive={page === 1}
              onClick={() => onPageChange(1)}
            >
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              className="cursor-pointer"
              isActive={page === 2}
              onClick={() => onPageChange(2)}
            >
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              className="cursor-pointer"
              isActive={page === 3}
              onClick={() => onPageChange(3)}
            >
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              className="cursor-pointer"
              isActive={page === 4}
              onClick={() => onPageChange(4)}
            >
              4
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              className="cursor-pointer"
              isActive={page === 5}
              onClick={() => onPageChange(5)}
            >
              5
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TasksPagination;
