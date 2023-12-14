import { connect } from "mongoose";
import { environment } from "./environmentConfig";

const atlasURL: string = environment.MONGODB;

export const dbConfig = () => {
  connect(atlasURL).then(() => {
    console.log("db connected");
  });
};
