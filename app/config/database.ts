import mongoose from "mongoose";
import Logger from "./Logger";

const connectDatabase = () => {
  const log = new Logger("Database");
  try {
    mongoose.connect(process.env.MONGO_URI!);
    const connect = mongoose.connection;
    connect.on("connection", () => {
      log.log("Database connected");
    });

    connect.on("error", () => {
      log.error("Database connection failed!");
    });
  } catch (err) {
    log.error(err);
  }
};

export default connectDatabase;
