-- CreateEnum
CREATE TYPE "Facing" AS ENUM ('NORTH', 'NORTH_EAST', 'EAST', 'SOUTH_EAST', 'SOUTH', 'SOUTH_WEST', 'WEST', 'NORTH_WEST', 'CORNER_PLOT');

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "facing" "Facing",
ADD COLUMN     "floorNumber" INTEGER,
ADD COLUMN     "totalFloors" INTEGER;

-- CreateIndex
CREATE INDEX "Property_amenities_idx" ON "Property" USING GIN ("amenities");
