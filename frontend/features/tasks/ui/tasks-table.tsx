"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTasks } from "@/features/tasks/model/use-tasks";
import { useState } from "react";
import TasksRow from "./tasks-row";
import { Pagination } from "@/shared/components";
import { PAGINATION_PAGE_SIZE_DEFAULT } from "@/config/global";

export default function TasksTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGINATION_PAGE_SIZE_DEFAULT);
  const { data: tasksData, isLoading } = useTasks({ page, limit });

  return (
    <div className="mb-10">
      <div className="rounded-sm border bg-card w-[98%] mx-auto mt-10">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="h-12 px-4 font-medium">Title</TableHead>
              <TableHead className="h-12 px-4 font-medium">Assignee</TableHead>
              <TableHead className="h-12 px-4 font-medium w-[120px]">
                Status
              </TableHead>

              <TableHead className="h-12 px-4 font-medium">
                Date created
              </TableHead>
              <TableHead className="h-12 px-4 font-medium w-[180px]">
                Creator
              </TableHead>
              <TableHead className="h-12 px-4 font-medium w-[180px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading &&
              (tasksData?.content ?? []).map((task) => (
                <TasksRow key={task.id} task={task} />
              ))}
            {isLoading &&
              [...Array(7)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6} className="h-16 px-4 text-center">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        page={page}
        limit={limit}
        totalPages={tasksData?.totalPages ?? 0}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    </div>
  );
}
