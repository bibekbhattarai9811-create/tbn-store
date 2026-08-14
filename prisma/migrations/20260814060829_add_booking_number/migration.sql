-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "bookingNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingNumber_key" ON "Booking"("bookingNumber");

-- Start booking numbers at 100
ALTER SEQUENCE "Booking_bookingNumber_seq" RESTART WITH 100;
