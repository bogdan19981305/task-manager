"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { PlanDto } from "../dto/plan.dto";
import {
  linesToList,
  listToLines,
  planAdminFormSchema,
  PlanAdminFormValues,
} from "../model/plan-admin.schema";
import { useCreatePlan } from "../model/use-create-plan";
import { useUpdatePlan } from "../model/use-update-plan";

type PlanDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  plan: PlanDto | null;
};

const emptyDefaults: PlanAdminFormValues = {
  key: "STARTER",
  name: "",
  description: "",
  price: 0,
  currency: "usd",
  featuresText: "",
  permissionsText: "",
  stripePriceId: "",
  stripeProductId: "",
  isActive: true,
  sortOrder: 0,
};

export function PlanDrawer({
  open,
  onOpenChange,
  mode,
  plan,
}: PlanDrawerProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PlanAdminFormValues>({
    resolver: zodResolver(planAdminFormSchema),
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && plan) {
      reset({
        key: plan.key,
        name: plan.name,
        description: plan.description ?? "",
        price: plan.price,
        currency: plan.currency,
        featuresText: listToLines(plan.features),
        permissionsText: listToLines(plan.permissions),
        stripePriceId: plan.stripePriceId ?? "",
        stripeProductId: plan.stripeProductId ?? "",
        isActive: plan.isActive,
        sortOrder: plan.sortOrder,
      });
    } else if (mode === "create") {
      reset(emptyDefaults);
    }
  }, [open, mode, plan, reset]);

  const { mutate: createPlan, isPending: isCreating } = useCreatePlan({
    onSuccess: () => {
      toast.success("Plan created");
      onOpenChange(false);
      reset(emptyDefaults);
    },
    onError: () => toast.error("Failed to create plan"),
  });

  const { mutate: updatePlan, isPending: isUpdating } = useUpdatePlan({
    onSuccess: () => {
      toast.success("Plan updated");
      onOpenChange(false);
    },
    onError: () => toast.error("Failed to update plan"),
  });

  const onSubmit = (values: PlanAdminFormValues) => {
    const features = linesToList(values.featuresText);
    const permissions = linesToList(values.permissionsText);
    const description = values.description?.trim() || undefined;
    const currency = values.currency?.trim() || undefined;
    const stripePriceId = values.stripePriceId?.trim() || undefined;
    const stripeProductId = values.stripeProductId?.trim() || undefined;

    if (mode === "create") {
      createPlan({
        key: values.key,
        name: values.name.trim(),
        description,
        price: values.price,
        currency,
        features,
        permissions,
        stripePriceId,
        stripeProductId,
        isActive: values.isActive,
        sortOrder: values.sortOrder,
      });
      return;
    }

    if (!plan) return;
    updatePlan({
      id: plan.id,
      data: {
        key: values.key,
        name: values.name.trim(),
        description,
        price: values.price,
        currency,
        features,
        permissions,
        stripePriceId,
        stripeProductId,
        isActive: values.isActive,
        sortOrder: values.sortOrder,
      },
    });
  };

  const pending = isCreating || isUpdating;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="max-h-[92vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            {mode === "create" ? (
              <IconPlus className="size-5" />
            ) : (
              <IconEdit className="size-5" />
            )}
            {mode === "create" ? "Create plan" : "Edit plan"}
          </DrawerTitle>
          <DrawerDescription>
            Manage subscription plan metadata shown to customers and used for
            billing.
          </DrawerDescription>
        </DrawerHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 overflow-y-auto px-4 pb-8"
        >
          <Field>
            <Label htmlFor="plan-key">Plan key</Label>
            <Controller
              name="key"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={pending}
                >
                  <SelectTrigger id="plan-key" className="w-full">
                    <SelectValue placeholder="Select key" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STARTER">STARTER</SelectItem>
                    <SelectItem value="PRO">PRO</SelectItem>
                    <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.key ? <FieldError>{errors.key.message}</FieldError> : null}
          </Field>

          <Field>
            <Label htmlFor="plan-name">Name</Label>
            <Input id="plan-name" {...register("name")} disabled={pending} />
            {errors.name ? (
              <FieldError>{errors.name.message}</FieldError>
            ) : null}
          </Field>

          <Field>
            <Label htmlFor="plan-desc">Description</Label>
            <Textarea
              id="plan-desc"
              {...register("description")}
              disabled={pending}
              rows={3}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <Label htmlFor="plan-price">Price (minor units)</Label>
              <Input
                id="plan-price"
                type="number"
                {...register("price")}
                disabled={pending}
              />
              {errors.price ? (
                <FieldError>{errors.price.message}</FieldError>
              ) : null}
            </Field>
            <Field>
              <Label htmlFor="plan-currency">Currency</Label>
              <Input
                id="plan-currency"
                {...register("currency")}
                disabled={pending}
                placeholder="usd"
              />
            </Field>
          </div>

          <Field>
            <Label htmlFor="plan-features">Features (one per line)</Label>
            <Textarea
              id="plan-features"
              {...register("featuresText")}
              disabled={pending}
              rows={5}
            />
          </Field>

          <Field>
            <Label htmlFor="plan-perms">Permissions (one per line)</Label>
            <Textarea
              id="plan-perms"
              {...register("permissionsText")}
              disabled={pending}
              rows={4}
            />
          </Field>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field>
              <Label htmlFor="stripe-price">Stripe price ID</Label>
              <Input
                id="stripe-price"
                {...register("stripePriceId")}
                disabled={pending}
                placeholder="price_..."
              />
            </Field>
            <Field>
              <Label htmlFor="stripe-product">Stripe product ID</Label>
              <Input
                id="stripe-product"
                {...register("stripeProductId")}
                disabled={pending}
                placeholder="prod_..."
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <Label htmlFor="plan-sort">Sort order</Label>
              <Input
                id="plan-sort"
                type="number"
                {...register("sortOrder")}
                disabled={pending}
              />
              {errors.sortOrder ? (
                <FieldError>{errors.sortOrder.message}</FieldError>
              ) : null}
            </Field>
            <Field className="flex flex-col justify-end gap-2">
              <div className="flex items-center gap-2">
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="plan-active"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={pending}
                    />
                  )}
                />
                <Label htmlFor="plan-active" className="cursor-pointer">
                  Active
                </Label>
              </div>
            </Field>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : mode === "create" ? (
                "Create"
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
