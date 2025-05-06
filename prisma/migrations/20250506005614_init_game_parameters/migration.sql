-- CreateTable
CREATE TABLE `GameParameters` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `shipMintLovelaceFee` INTEGER NOT NULL,
    `maxAsteriaMining` INTEGER NOT NULL,
    `maxSpeed` JSON NOT NULL,
    `maxShipFuel` INTEGER NOT NULL,
    `fuelPerStep` INTEGER NOT NULL,
    `initialFuel` INTEGER NOT NULL,
    `minAsteriaDistance` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
