import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth, auth } from "./auth";

export async function middleware(req: NextRequest) {
  // Define protected routes
  const protectedRoutes = ["/auth/verification", "/dashboard"];
  const adminProtectedRoutes = ["/admin/dashboard"];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));
  const isAdminProtectedRoute = adminProtectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  // If it's a protected route, check for the session
  if (isProtectedRoute) {
    const session = await auth();
    if (!session) {
      // If no token, redirect to sign-in page
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  if (isAdminProtectedRoute) {
    const session = await adminAuth();
    if (!session) {
      // If no token, redirect to sign-in page
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Allow access to non-protected routes
  return NextResponse.next();
}