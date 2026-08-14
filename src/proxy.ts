import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const isAdmin = role === "ADMIN";
  const isHelperOrAdmin = role === "HELPER" || role === "ADMIN";
  const { pathname, origin } = req.nextUrl;

  const requiresAuth =
    pathname.startsWith("/account") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/helper") ||
    pathname.startsWith("/wishlist") ||
    pathname.startsWith("/bookings");

  if (!isLoggedIn && requiresAuth) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }

  if (isLoggedIn && pathname.startsWith("/admin") && !isAdmin) {
    return Response.redirect(new URL("/", origin));
  }

  if (isLoggedIn && pathname.startsWith("/helper") && !isHelperOrAdmin) {
    return Response.redirect(new URL("/", origin));
  }
});

export const config = {
  matcher: [
    "/account/:path*",
    "/admin/:path*",
    "/helper/:path*",
    "/wishlist/:path*",
    "/bookings/:path*",
  ],
};
