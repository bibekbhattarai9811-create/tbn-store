import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname, origin } = req.nextUrl;

  if (
    !isLoggedIn &&
    (pathname.startsWith("/account") || pathname.startsWith("/orders"))
  ) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/account/:path*", "/orders/:path*"],
};
