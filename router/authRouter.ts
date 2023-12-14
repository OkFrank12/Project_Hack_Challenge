import { Router } from "express";
import {
  createAuth,
  deleteOneAuths,
  signInAuth,
  verifyAuth,
  viewAllAuths,
  viewOneAuths,
} from "../controller/authController";

const auth: Router = Router();

auth.post("/create-auth", createAuth);
auth.post("/sign-in-auth", signInAuth);
auth.get("/:token/verify-auth", verifyAuth);
auth.delete("/:authID", deleteOneAuths);
auth.get("/:authID/view-one-auth", viewOneAuths);
auth.get("/view-all-auths", viewAllAuths);

export default auth;
