import { NextResponse } from "next/server";
import Logger from "../config/Logger";

export const errorHandler = (error: any, status: number = 500) => {
  new Logger("Error Handler").error(error);
  return NextResponse.json({ message: error }, { status });
};

export const HTTPStatus: Record<string, number> = {
  OK: 200,
  SERVER: 500,
  BAD: 400,
};
