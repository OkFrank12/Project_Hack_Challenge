import { Schema, model } from "mongoose";
import { iAuthData } from "../utils/interface";

const authModel = new Schema<iAuthData>(
  {
    userName: {
      type: String,
    },
    googleID: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    token: String,
    verified: Boolean,
  },
  { timestamps: true }
);

export default model<iAuthData>("auth-services", authModel);
