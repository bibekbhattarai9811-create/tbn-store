-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "size" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "sizes" TEXT[] DEFAULT ARRAY[]::TEXT[];
