import mongoose, { Document, Schema, model, models } from "mongoose";
import { GENDER, MARTIAL_STATUS } from "../util/enum";

export interface IUserInfo extends Document {
  userId: mongoose.Types.ObjectId;
  personal: TUserPersonal;
  education: TUserEducation;
  professions: [TUserProfession];
}

export interface TUserPersonal extends Document {
  fullName: string;
  dob: Date;
  gender: GENDER;
  address: string;
  age: number;
  maritalStatus: MARTIAL_STATUS;
}

export interface TUserEducation extends Document {
  highest: string;
  name: string;
  gpa: string;
  degree: string;
  field: string;
  completion: Date;
}

export interface TUserProfession extends Document {
  designation: string;
  company: string;
  sector: string;
  description: string;
  startDate: Date;
  endDate: Date;
  stillWorking: boolean;
}

const personaSchema = new Schema<TUserPersonal>({
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: Object.values(GENDER) },
  address: { type: String },
  age: { type: Number, required: true },
  maritalStatus: Object.values(MARTIAL_STATUS),
});

const educationSchema = new Schema<TUserEducation>({
  highest: { type: String, required: true },
  name: { type: String, required: true },
  gpa: String,
  degree: { type: String, required: true },
  field: { type: String, required: true },
  completion: Date,
});

const professionSchema = new Schema<TUserProfession>({
  designation: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  sector: { type: String },
  startDate: Date,
  endDate: Date,
  stillWorking: { type: Boolean, default: false },
});

const userSchema = new Schema<IUserInfo>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: true,
  },
  personal: personaSchema,
  education: educationSchema,
  professions: [professionSchema],
});

const UserInfoModel =
  models.user_infos || model<IUserInfo>("user_infos", userSchema);

export default UserInfoModel;
