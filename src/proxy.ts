import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "ADMIN";
  const { pathname, origin } = req.nextUrl;

  const requiresAuth =
    pathname.startsWith("/account") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/wishlist");

  if (!isLoggedIn && requiresAuth) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }

  if (isLoggedIn && pathname.startsWith("/admin") && !isAdmin) {
    return Response.redirect(new URL("/", origin));
  }
});

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/wishlist/:path*"],
};
