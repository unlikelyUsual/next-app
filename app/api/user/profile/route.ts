import Logger from "@/app/config/Logger";
import connectDatabase from "@/app/config/database";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { handler } from "@/app/middleware/handler";
import UserInfoModel from "@/app/models/UserInfo.model";
import { HTTPStatus, errorHandler } from "@/app/util/apiUtil";
import { UserRole } from "@/app/util/enum";
import { NextRequest, NextResponse } from "next/server";

const logger = new Logger("User controller");

//Connect to database
connectDatabase();

const getProfile = async (request: NextRequest) => {
  try {
    const uid = request.headers.get("x-uid");

    const profiles = await UserInfoModel.find({ userId: uid }).populate(
      "userId"
    );

    if (profiles.length <= 0)
      return errorHandler("Profile Not Found!", HTTPStatus.BAD);

    return NextResponse.json({
      message: "Success",
      data: { profile: profiles[0] },
    });
  } catch (err: any) {
    return errorHandler(err, HTTPStatus.SERVER);
  }
};

export const GET = handler(authMiddleware(UserRole.USER), getProfile);
