import { NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/resume",
  "/interview",
  "/ai-cover-letter",
  "/onboarding",
  "/calendar",
];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Check if the route is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    const token = req.cookies.get("token");

    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
