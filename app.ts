import { Request, Response, json, NextFunction, Application } from "express";
import cors from "cors";
import auth from "./router/authRouter";
import cookieSession from "cookie-session";
import { environment } from "./config/environmentConfig";
import passport from "passport";
import "./service/passportService";
import socials from "./router/socialRouter";

export const appConfig = (app: Application) => {
  app
    .use(json())
    .use(cors({ origin: "*", methods: ["GET", "POST", "PATCH", "DELETE"] }));

  app.set("view engine", "ejs");
  app.use("/api", auth);

  app
    .use(
      cookieSession({
        maxAge: 24 * 60 * 60 * 1000,
        keys: [environment.KEY],
      })
    )
    .use((req: Request, res: Response, next: NextFunction) => {
      if (req.session && !req.session.regenerate) {
        req.session.regenerate = (cb: any) => {
          cb();
        };
      }

      if (req.session && !req.session.save) {
        req.session.save = (cb: any) => {
          cb();
        };
      }
      next();
    });

  app.use(passport.initialize());
  app.use(passport.session());
  app.use("/auth", socials);

  app.get("/", (req: Request, res: Response) => {
    try {
      return res.status(200).json({
        message: "Let's do this...!",
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  });
};
