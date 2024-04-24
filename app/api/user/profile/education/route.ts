import Logger from "@/app/config/Logger";
import connectDatabase from "@/app/config/database";
import UserInfoModel from "@/app/models/UserInfo.model";
import { HTTPStatus, errorHandler } from "@/app/util/apiUtil";
import { NextRequest, NextResponse } from "next/server";

connectDatabase();

const logger = new Logger("Education Route");

export const POST = async (request: NextRequest) => {
  try {
    const uid = request.headers.get("uid");

    const { highestEducation, name, gpa, degree, field, completionDate } =
      await request.json();

    const infoDocument = await UserInfoModel.findOne({ userId: uid });

    if (infoDocument.education)
      return errorHandler("Education already exist!", HTTPStatus.BAD);

    const fields = {
      education: {
        highest: highestEducation,
        name,
        gpa,
        degree,
        field,
        completion: completionDate,
      },
    };

    const updatedEdu = await UserInfoModel.updateOne(
      { userId: uid },
      { $set: fields }
    );

    logger.log("Update count : ", updatedEdu.modifiedCount);

    return NextResponse.json({
      message: "Success",
      data: { education: updatedEdu },
    });
  } catch (err) {
    return errorHandler(err, HTTPStatus.SERVER);
  }
};

export const GET = async (request: NextRequest) => {
  try {
    const uid = request.headers.get("uid");

    const education = await UserInfoModel.findOne({ userId: uid });

    return NextResponse.json({
      message: "Success",
      data: { education },
    });
  } catch (err) {
    return errorHandler(err, HTTPStatus.SERVER);
  }
};

export const PUT = async (request: NextRequest) => {
  try {
    const { highestEducation, name, gpa, degree, field, completionDate, id } =
      await request.json();

    const updatedEdu = await UserInfoModel.updateOne(
      { _id: id },
      {
        $set: {
          education: {
            ...(highestEducation && { highest: highestEducation }),
            ...(name && { name }),
            ...(gpa && { gpa }),
            ...(degree && { degree }),
            ...(field && { field }),
            ...(completionDate && { completion: completionDate }),
          },
        },
      }
    );

    logger.log("Updated count", updatedEdu.modifiedCount);

    return NextResponse.json({
      message: "Success",
      data: {},
    });
  } catch (err) {
    return errorHandler(err, HTTPStatus.SERVER);
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const { id } = await request.json();

    const updateRes = await UserInfoModel.updateOne(
      { _id: id },
      {
        $set: {
          education: null,
        },
      }
    );

    logger.log("Updated count", updateRes.modifiedCount);

    return NextResponse.json({
      message: "Success",
      data: {},
    });
  } catch (err) {
    return errorHandler(err, HTTPStatus.SERVER);
  }
};
