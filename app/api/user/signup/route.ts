import Logger from "@/app/config/Logger";
import connectDatabase from "@/app/config/database";
import UserModel from "@/app/models/User.model";
import UserInfoModel from "@/app/models/UserInfo.model";
import { HTTPStatus, errorHandler } from "@/app/util/apiUtil";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const logger = new Logger("User controller");

//Connect to database
connectDatabase();

export const POST = async (request: NextRequest) => {
  try {
    const { name, email, role, password, contact } = await request.json();

    const user = await UserModel.findOne({ email });

    if (user)
      return errorHandler("Email is already registered!", HTTPStatus.BAD);

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const saveUser = await new UserModel({
      name,
      email,
      password: hashPassword,
      contact,
      role,
    }).save();

    await new UserInfoModel({
      userId: saveUser._id,
      personal: null,
      education: null,
      professions: null,
    }).save();

    //remove password from response
    delete saveUser.password;

    return NextResponse.json({ message: "Success", data: { user: saveUser } });
  } catch (err: any) {
    return errorHandler(err, HTTPStatus.SERVER);
  }
};
