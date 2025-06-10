-- CreateTable
CREATE TABLE "GameParameters" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "admin_policy_id" TEXT NOT NULL,
    "admin_asset_name" TEXT NOT NULL,
    "shipMintLovelaceFee" INTEGER NOT NULL,
    "maxAsteriaMining" INTEGER NOT NULL,
    "maxSpeed" JSONB NOT NULL,
    "maxShipFuel" INTEGER NOT NULL,
    "fuelPerStep" INTEGER NOT NULL,
    "initialFuel" INTEGER NOT NULL,
    "minAsteriaDistance" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameParameters_pkey" PRIMARY KEY ("id")
);
