import Logger from "@/app/config/Logger";
import connectDatabase from "@/app/config/database";
import { HTTPStatus, errorHandler } from "@/app/util/apiUtil";
import { NextRequest, NextResponse } from "next/server";

const logger = new Logger("User controller");

//Connect to database
connectDatabase();

export const POST = (request: NextRequest) => {
  logger.log(`Post Request : ${request.method} ${request.url}`, request.body);
  try {
    const body = request.body;

    //Check for email address

    //Create

    //return
    return NextResponse.json({ message: "Success", data: {} });
  } catch (err: any) {
    return errorHandler(err, HTTPStatus.SERVER);
  }
};
