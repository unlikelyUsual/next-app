import { NextResponse } from "next/server";
import Logger from "../config/Logger";
import { UserRole } from "./enum";

export const errorHandler = (error: any, status: number = 500) => {
  new Logger("Error Handler").error(error);
  return NextResponse.json(
    {
      message:
        status === 500 ? error?.message ?? "Something went wrong!" : error,
    },
    { status }
  );
};

export const HTTPStatus: Record<string, number> = {
  OK: 200,
  SERVER: 500,
  BAD: 400,
  UNAUTHORIZED: 401,
};

export const roleMapper = (role: UserRole): number => {
  switch (role) {
    case UserRole.ADMIN:
      return 2;
    case UserRole.USER:
      return 1;
    default:
      return 0;
  }
};
