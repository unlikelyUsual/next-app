import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { UserRole } from "./util/enum";

const publicRoute = ["/login", "/signup"];
const privateRoutes = ["/profile"];
const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get("token")?.value ?? "";

  const decoded: any = jwt.verify(cookie, process.env.JWT_KEY!);

  const role = decoded.role as UserRole;

  request.headers.append("uid", decoded.id);

  return NextResponse.redirect(new URL("/home", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/*"],
};
