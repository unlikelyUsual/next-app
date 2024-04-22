import Logger from "@/app/config/Logger";
import connectDatabase from "@/app/config/database";
import UserInfoModel from "@/app/models/UserInfo.model";
import { HTTPStatus, errorHandler } from "@/app/util/apiUtil";
import { NextRequest, NextResponse } from "next/server";

const logger = new Logger("User controller");

//Connect to database
connectDatabase();

export const POST = async (request: NextRequest) => {
  logger.log(`Post Request : ${request.method} ${request.url}`, request.body);
  try {
    const uid = request.headers.get("uid");

    const profile = await UserInfoModel.find({ userId: uid }).populate(
      "userId"
    );

    if (!profile) return errorHandler("Profile Not Found!", HTTPStatus.BAD);

    return NextResponse.json({ message: "Success", data: { profile } });
  } catch (err: any) {
    return errorHandler(err, HTTPStatus.SERVER);
  }
};
