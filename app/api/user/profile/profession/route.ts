import Logger from "@/app/config/Logger";
import connectDatabase from "@/app/config/database";
import UserInfoModel, {
  IUserInfo,
  TUserProfession,
} from "@/app/models/UserInfo.model";
import { HTTPStatus, errorHandler } from "@/app/util/apiUtil";
import { NextRequest, NextResponse } from "next/server";

connectDatabase();

const logger = new Logger("Profession Route");

export const POST = async (request: NextRequest) => {
  try {
    const uid = request.headers.get("x-uid");

    const { professions } = await request.json();

    const fields = professions.map((item: TUserProfession) => {
      return {
        designation: item.designation,
        company: item.company,
        sector: item.sector,
        description: item.description,
        startDate: item.startDate,
        endDate: item.endDate,
        stillWorking: item.stillWorking,
      };
    });

    const updateRes = await UserInfoModel.updateOne(
      { userId: uid },
      { $push: { professions: fields } }
    );

    logger.log("Update res : ", updateRes.matchedCount);

    return NextResponse.json({
      message: "Success",
      data: {},
    });
  } catch (err) {
    return errorHandler(err, HTTPStatus.SERVER);
  }
};

export const GET = async (request: NextRequest) => {
  try {
    const uid = request.headers.get("uid");

    const infoDocument = (await UserInfoModel.find({
      userId: uid,
    })) as unknown as IUserInfo;

    return NextResponse.json({
      message: "Success",
      data: { professions: infoDocument.professions },
    });
  } catch (err) {
    return errorHandler(err, HTTPStatus.SERVER);
  }
};

export const PUT = async (request: NextRequest) => {
  try {
    const {
      id,
      index,
      designation,
      company,
      description,
      sector,
      startDate,
      endDate,
      stillWorking,
    } = await request.json();

    const field = {
      designation: designation,
      company: company,
      sector: sector,
      description: description,
      startDate: startDate,
      endDate: endDate,
      stillWorking: stillWorking,
    };

    const updateRes = await UserInfoModel.findOneAndUpdate(
      { _id: id, professions: { $exists: true, $ne: [] } },
      { $set: { [`professions.${index}`]: field } },
      { new: true }
    );

    logger.log("Update res : ", updateRes.matchedCount);

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
    const { id, index } = await request.json();

    const updateRes = await UserInfoModel.updateOne(
      { _id: id },
      { $unset: { [`professions.${index}`]: 1 } }
    );

    logger.log(`Update res`, updateRes.modifiedCount);

    return NextResponse.json({
      message: "Success",
      data: {},
    });
  } catch (err) {
    return errorHandler(err, HTTPStatus.SERVER);
  }
};
