import { Document, Schema, model, models } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Enter Name"],
  },
  email: {
    type: String,
    required: [true, "Enter enter"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Enter password"],
  },
  role: {
    type: String,
    required: [true, "Select role"],
  },
});

const UserModel = models.users || model<IUser>("users", userSchema);

export default UserModel;
