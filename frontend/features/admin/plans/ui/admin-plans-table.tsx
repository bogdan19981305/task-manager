"use client";

import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { PlanDto } from "../dto/plan.dto";
import { useDeletePlan } from "../model/use-delete-plan";
import { useAdminPlans } from "../model/use-plans";
import { PlanDrawer } from "./plan-drawer";

export function AdminPlansTable() {
  const { data: plans, isLoading } = useAdminPlans();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<PlanDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PlanDto | null>(null);

  const { mutate: deletePlan, isPending: isDeleting } = useDeletePlan({
    onSuccess: () => {
      toast.success("Plan deleted");
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to delete plan"),
  });

  const openCreate = () => {
    setDrawerMode("create");
    setSelected(null);
    setDrawerOpen(true);
  };

  const openEdit = (plan: PlanDto) => {
    setDrawerMode("edit");
    setSelected(plan);
    setDrawerOpen(true);
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between p-4">
        <div>
          <h1 className="text-2xl font-bold">Plans</h1>
          <p className="text-muted-foreground text-sm">
            Subscription plans (admin only). Price is stored in minor currency
            units (e.g. cents).
          </p>
        </div>
        <Button
          className={cn(
            "cursor-pointer",
            "bg-primary",
            "text-primary-foreground",
            "hover:bg-transparent",
            "hover:text-primary",
            "hover:border-primary",
          )}
          variant="default"
          onClick={openCreate}
        >
          <PlusIcon className="size-4" />
          Create plan
        </Button>
      </div>

      <div className="border-input bg-card mx-auto mt-6 w-[98%] rounded-sm border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="h-12 px-4 font-medium">Key</TableHead>
              <TableHead className="h-12 px-4 font-medium">Name</TableHead>
              <TableHead className="h-12 px-4 font-medium">Price</TableHead>
              <TableHead className="h-12 px-4 font-medium">Currency</TableHead>
              <TableHead className="h-12 px-4 font-medium">Active</TableHead>
              <TableHead className="h-12 px-4 font-medium">Sort</TableHead>
              <TableHead className="h-12 w-[140px] px-4 font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading &&
              (plans ?? []).map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="px-4 font-mono text-sm">
                    {plan.key}
                  </TableCell>
                  <TableCell className="px-4">{plan.name}</TableCell>
                  <TableCell className="px-4">{plan.price}</TableCell>
                  <TableCell className="px-4 uppercase">
                    {plan.currency}
                  </TableCell>
                  <TableCell className="px-4">
                    {plan.isActive ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="px-4">{plan.sortOrder}</TableCell>
                  <TableCell className="px-4">
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="size-9 cursor-pointer"
                        onClick={() => openEdit(plan)}
                        aria-label={`Edit ${plan.name}`}
                      >
                        <PencilIcon className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive size-9 cursor-pointer"
                        onClick={() => setDeleteTarget(plan)}
                        aria-label={`Delete ${plan.name}`}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            {isLoading &&
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7} className="h-16 px-4">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            {!isLoading && plans?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-muted-foreground px-4 py-10 text-center"
                >
                  No plans yet. Create one to get started.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <PlanDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
        plan={drawerMode === "edit" ? selected : null}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete plan?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `This will permanently remove “${deleteTarget.name}” (${deleteTarget.key}). You cannot delete a plan that has payments or user subscriptions linked to it.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={() => {
                if (deleteTarget) deletePlan(deleteTarget.id);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
