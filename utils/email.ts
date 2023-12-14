import nodemailer from "nodemailer";
import { google } from "googleapis";
import { join } from "path";
import { sign } from "jsonwebtoken";
import { renderFile } from "ejs";
import { environment } from "../config/environmentConfig";

const googleID: string = environment.googleID;
const googleSECRET: string = environment.googleSECRET;
const googleREFRESH: string = environment.googleREFRESH;
const googleURL: string = environment.googleURL;

const oAuth = new google.auth.OAuth2(googleID, googleSECRET, googleURL);
oAuth.setCredentials({ access_token: googleREFRESH });

export const sendTokenMail = async (user: any) => {
  try {
    // const accessToken: any = (await oAuth.getAccessToken()).token;
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        // type: "OAuth2",
        user: "cfoonyemmemme@gmail.com",
        pass: "cdxv resq qsxp zfev",
        // clientId: googleID,
        // clientSecret: googleSECRET,
        // refreshToken: googleREFRESH,
        // accessToken,
      },
    });

    const token = sign({ id: user?._id }, environment.SECRET);

    const passedData = {
      userName: user.userName,
      email: user.email,
      url: `http://localhost:5173/${token}/verify-auth`,
    };

    const findEjsFile = join(__dirname, "../views/verify.ejs");
    const renderData = await renderFile(findEjsFile, passedData);

    const mailer = {
      from: "Let's do this! <cfoonyemmemme@gmail.com>",
      to: user.email,
      subject: "Verification Status",
      html: renderData,
    };

    transport.sendMail(mailer);
  } catch (error: any) {
    console.log(error.message);
  }
};
