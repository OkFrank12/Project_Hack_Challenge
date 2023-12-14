import { Request, Response } from "express";
import { compare, genSalt, hash } from "bcrypt";
import crypto from "crypto";
import authModel from "../model/authModel";
import { sendTokenMail } from "../utils/email";
import { sign, verify } from "jsonwebtoken";
import { environment } from "../config/environmentConfig";

export const createAuth = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userName, email, password } = req.body;
    const salted = await genSalt(10);
    const hashed = await hash(password, salted);
    const generate = crypto.randomBytes(16).toString("hex");
    const auth = await new authModel({
      userName,
      email,
      password: hashed,
      token: generate,
      verified: false,
    }).save();

    sendTokenMail(auth).then(() => {
      console.log("user created: ", auth);
    });

    return res.status(201).json({
      message: `A Mail has been sent to ${auth.userName}`,
      data: auth,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyAuth = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { token } = req.params;

    const getUserID: any = verify(
      token,
      environment.SECRET,
      (err: any, payload: any) => {
        if (err) {
          return err;
        } else {
          return payload;
        }
      }
    );

    const user = await authModel.findByIdAndUpdate(
      getUserID.id,
      {
        token: "",
        verified: true,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "verified user",
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "error verifying auth",
      data: error.message,
    });
  }
};

export const signInAuth = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const auth = await authModel.findOne({ email });

    if (auth) {
      const validPass = await compare(password, auth.password);
      if (validPass) {
        if (auth.verified && auth?.token === "") {
          const token = sign({ id: auth._id }, environment.SECRET);

          return res.status(201).json({
            message: `Welcome Back... ${auth.userName}`,
            data: token,
          });
        } else {
          return res.status(401).json({
            message: "Please Verify Your Account...!",
          });
        }
      } else {
        return res.status(401).json({
          message: "Enter a valid password...!!!",
        });
      }
    } else {
      return res.status(404).json({
        message: "User is not here...!!!",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const viewAllAuths = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const all = await authModel.find();

    return res.status(200).json({
      message: "all authenticated users",
      data: all,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const viewOneAuths = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { authID } = req.params;
    const auth = await authModel.findById(authID);

    return res.status(200).json({
      message: `This is ${auth?.userName}`,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteOneAuths = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { authID } = req.params;
    await authModel.findByIdAndDelete(authID);

    return res.status(202).json({
      message: "Deleted One Auth",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
