-- CreateTable
CREATE TABLE "routes" (
    "route_id" TEXT NOT NULL,
    "vessel_type" TEXT NOT NULL,
    "fuel_type" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "ghg_intensity" DOUBLE PRECISION NOT NULL,
    "fuel_consumption" DOUBLE PRECISION NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "total_emissions" DOUBLE PRECISION NOT NULL,
    "is_baseline" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("route_id")
);

-- CreateTable
CREATE TABLE "ship_compliance" (
    "compliance_id" TEXT NOT NULL,
    "ship_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "compliance_balance" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ship_compliance_pkey" PRIMARY KEY ("compliance_id")
);

-- CreateTable
CREATE TABLE "banking_records" (
    "banking_id" TEXT NOT NULL,
    "ship_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "banked_amount" DOUBLE PRECISION NOT NULL,
    "expiry_year" INTEGER NOT NULL,
    "is_expired" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banking_records_pkey" PRIMARY KEY ("banking_id")
);

-- CreateTable
CREATE TABLE "pools" (
    "pool_id" TEXT NOT NULL,
    "pool_name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "member_ships" TEXT[],
    "total_balance" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pools_pkey" PRIMARY KEY ("pool_id")
);

-- CreateTable
CREATE TABLE "pool_members" (
    "member_id" TEXT NOT NULL,
    "pool_id" TEXT NOT NULL,
    "ship_id" TEXT NOT NULL,
    "contribution_balance" DOUBLE PRECISION NOT NULL,
    "allocated_deficit" DOUBLE PRECISION NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pool_members_pkey" PRIMARY KEY ("member_id")
);

-- CreateIndex
CREATE INDEX "routes_year_idx" ON "routes"("year");

-- CreateIndex
CREATE INDEX "routes_is_baseline_idx" ON "routes"("is_baseline");

-- CreateIndex
CREATE INDEX "ship_compliance_ship_id_idx" ON "ship_compliance"("ship_id");

-- CreateIndex
CREATE INDEX "ship_compliance_year_idx" ON "ship_compliance"("year");

-- CreateIndex
CREATE INDEX "ship_compliance_status_idx" ON "ship_compliance"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ship_compliance_ship_id_year_key" ON "ship_compliance"("ship_id", "year");

-- CreateIndex
CREATE INDEX "banking_records_ship_id_idx" ON "banking_records"("ship_id");

-- CreateIndex
CREATE INDEX "banking_records_expiry_year_idx" ON "banking_records"("expiry_year");

-- CreateIndex
CREATE INDEX "banking_records_is_expired_idx" ON "banking_records"("is_expired");

-- CreateIndex
CREATE UNIQUE INDEX "banking_records_ship_id_year_key" ON "banking_records"("ship_id", "year");

-- CreateIndex
CREATE INDEX "pools_year_idx" ON "pools"("year");

-- CreateIndex
CREATE INDEX "pools_pool_name_idx" ON "pools"("pool_name");

-- CreateIndex
CREATE INDEX "pool_members_pool_id_idx" ON "pool_members"("pool_id");

-- CreateIndex
CREATE INDEX "pool_members_ship_id_idx" ON "pool_members"("ship_id");

-- AddForeignKey
ALTER TABLE "pool_members" ADD CONSTRAINT "pool_members_pool_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "pools"("pool_id") ON DELETE CASCADE ON UPDATE CASCADE;
