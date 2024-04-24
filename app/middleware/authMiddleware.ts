import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Logger from "../config/Logger";
import { HTTPStatus, roleMapper } from "../util/apiUtil";
import { UserRole } from "../util/enum";

const logger = new Logger("Auth Middleware");

export const authMiddleware = (role: UserRole) => {
  return async (req: NextRequest, next: () => Promise<void>) => {
    try {
      logger.log(`${req.method} ${req.nextUrl.pathname}`, req.body);

      const token = cookies().get("token")?.value as string;
      const session: any = jwt.verify(token, process.env.JWT_KEY!);

      if (roleMapper(session.role) < roleMapper(role))
        return NextResponse.json(
          { message: "Unauthorized" },
          { status: HTTPStatus.UNAUTHORIZED }
        );

      req.headers.set("x-uid", session.id);

      await next();
    } catch (err: any) {
      logger.error(err.message);
      return NextResponse.json(
        { message: err.message },
        { status: HTTPStatus.SERVER }
      );
    }
  };
};
