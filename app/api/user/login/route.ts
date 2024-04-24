import Logger from "@/app/config/Logger";
import connectDatabase from "@/app/config/database";
import UserModel from "@/app/models/User.model";
import { HTTPStatus, errorHandler } from "@/app/util/apiUtil";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const logger = new Logger("User controller");

//Connect to database
connectDatabase();

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { email, password } = await request.json();

    const user = await UserModel.findOne({ email });

    if (!user) return errorHandler("Invalid User Email!", HTTPStatus.BAD);

    const passwordVerify = await bcrypt.compare(password, user.password);

    if (!passwordVerify)
      return errorHandler("Invalid Password!", HTTPStatus.BAD);

    const response = NextResponse.json({ message: "Success", data: {} });

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_KEY!, {
      expiresIn: "3h",
    });

    response.cookies.set("token", jwtToken, {
      httpOnly: true,
    });

    return response;
  } catch (err: any) {
    return errorHandler(err, HTTPStatus.SERVER);
  }
};
