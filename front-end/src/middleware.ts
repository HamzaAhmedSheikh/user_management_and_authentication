import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

export async function middleware(req: NextRequest) {
  // Define protected routes
  const protectedRoutes = ["/admin/dashboard"];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  // If it's a protected route, check for the session
  if (isProtectedRoute) {
    const token = await auth();
    if (!token) {
      // If no token, redirect to sign-in page
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Allow access to non-protected routes
  return NextResponse.next();
}