<<<<<<< HEAD
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./src/auth";

export async function middleware(req: NextRequest) {
  // Define protected routes
  const protectedRoutes = ["/dashboard"];

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
=======
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
    matcher: ["/dashboard"], // Define protected routes
};
// // middleware.ts
// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export async function middleware(req: NextRequest) {
//   // Define protected routes
//   const protectedRoutes = ["/dashboard"];

//   // Check if the current route is protected
//   const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

//   // If it's a protected route, check for the session
//   if (isProtectedRoute) {
//     const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//     if (!token) {
//       // If no token, redirect to sign-in page
//       return NextResponse.redirect(new URL("/signin", req.url));
//     }
//   }

//   // Allow access to non-protected routes
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard"], // Define protected routes
// };
>>>>>>> 9224fd5b86eff6e9a8302b71b0e048c161ac0888
