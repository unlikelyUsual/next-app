import Logger from "@/app/config/Logger";
import connectDatabase from "@/app/config/database";
import UserModel from "@/app/models/User.model";
import { HTTPStatus, errorHandler } from "@/app/util/apiUtil";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const logger = new Logger("User controller");

//Connect to database
connectDatabase();

export const POST = async (request: NextRequest) => {
  logger.log(`Post Request : ${request.method} ${request.url}`, request.body);
  try {
    const { name, email, role, password } = await request.json();

    const user = await UserModel.findOne({ email });

    if (user)
      return errorHandler("Email is already registered!", HTTPStatus.BAD);

    const salt = await bcrypt.genSalt(10);

    const hashPassword = bcrypt.hash(password, salt);

    const saveUser = await new UserModel({
      name,
      email,
      password: hashPassword,
      role,
    })
      .save()
      .select("-password");

    return NextResponse.json({ message: "Success", data: { user: saveUser } });
  } catch (err: any) {
    return errorHandler(err, HTTPStatus.SERVER);
  }
};
