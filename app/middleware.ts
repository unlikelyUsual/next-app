import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Logger from "./config/Logger";
import { UserRole } from "./util/enum";

const logger = new Logger("Middleware");

// 1. Describing routes
const publicRoutes = ["/login", "/signup"];
const privateRoutes = ["/profile"];
const adminRoutes = ["/admin"];

export default async function middleware(req: NextRequest) {
  logger.log(
    `Middleware invoked ::  ${req.method} ${req.nextUrl.pathname}`,
    req.headers,
    req.body
  );

  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = privateRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const isAdminRoute = adminRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const token = cookies().get("token")?.value as string;
  const session: any = jwt.verify(token, process.env.JWT_KEY!);

  // 5. Redirect to /login if the user is not authenticated
  if ((isProtectedRoute || isAdminRoute) && !session?.id) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 6. Redirect to /dashboard if the user is not admin
  if (isAdminRoute && session.role !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 6. Redirect to /dashboard if the user is authenticated
  if (isPublicRoute && session?.id && !path.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/profile", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.png$).*)"],
};
