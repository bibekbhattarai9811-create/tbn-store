import "server-only";
import { Resend } from "resend";

const BOOKING_NOTIFICATION_EMAIL = "neupanetejprasad59@gmail.com";

type NewBookingEmailInput = {
  bookingNumber: number;
  productName: string;
  size: string | null;
  quantity: number;
  fullName: string;
  phone: string;
  email: string | null;
  address: string;
  shopName: string | null;
};

export async function sendNewBookingEmail(booking: NewBookingEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);

  const lines = [
    `Product: ${booking.productName}`,
    booking.size ? `Size: ${booking.size}` : null,
    `Quantity: ${booking.quantity}`,
    `Name: ${booking.fullName}`,
    `Phone: ${booking.phone}`,
    booking.email ? `Email: ${booking.email}` : null,
    `Address: ${booking.address}`,
    booking.shopName ? `Shop name: ${booking.shopName}` : null,
  ].filter((line): line is string => line !== null);

  try {
    await resend.emails.send({
      from: "TBN Store <onboarding@resend.dev>",
      to: BOOKING_NOTIFICATION_EMAIL,
      subject: `New booking #${booking.bookingNumber} — ${booking.productName}`,
      text: lines.join("\n"),
    });
  } catch (error) {
    console.error("Failed to send booking notification email", error);
  }
}
