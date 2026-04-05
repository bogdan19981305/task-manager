/*
  Warnings:

  - The `provider` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `expires_at` on the `user_plans` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripe_invoice_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key,interval]` on the table `plans` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_subscription_id]` on the table `user_plans` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_customer_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "BillingInterval" AS ENUM ('MONTH', 'YEAR');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('STRIPE');

-- AlterEnum
ALTER TYPE "UserPlanStatus" ADD VALUE 'PAST_DUE';

-- DropIndex
DROP INDEX "plans_key_key";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "stripe_customer_id" TEXT,
ADD COLUMN     "stripe_invoice_id" TEXT,
ADD COLUMN     "stripe_subscription_id" TEXT,
DROP COLUMN "provider",
ADD COLUMN     "provider" "Provider" NOT NULL DEFAULT 'STRIPE';

-- AlterTable
ALTER TABLE "plans" ADD COLUMN     "interval" "BillingInterval" NOT NULL DEFAULT 'MONTH',
ADD COLUMN     "trial_days" INTEGER;

-- AlterTable
ALTER TABLE "user_plans" DROP COLUMN "expires_at",
ADD COLUMN     "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canceled_at" TIMESTAMP(3),
ADD COLUMN     "current_period_end" TIMESTAMP(3),
ADD COLUMN     "current_period_start" TIMESTAMP(3),
ADD COLUMN     "stripe_customer_id" TEXT,
ADD COLUMN     "stripe_subscription_id" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "stripe_customer_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripe_invoice_id_key" ON "payments"("stripe_invoice_id");

-- CreateIndex
CREATE INDEX "payments_stripe_subscription_id_idx" ON "payments"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "plans_is_active_idx" ON "plans"("is_active");

-- CreateIndex
CREATE INDEX "plans_sort_order_idx" ON "plans"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "plans_key_interval_key" ON "plans"("key", "interval");

-- CreateIndex
CREATE UNIQUE INDEX "user_plans_stripe_subscription_id_key" ON "user_plans"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "user_plans_current_period_end_idx" ON "user_plans"("current_period_end");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");
