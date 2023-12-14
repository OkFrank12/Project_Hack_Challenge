import { Request, Response, Router } from "express";
import passport from "passport";

const socials: Router = Router();

socials.get("/login", (req: Request, res: Response) => {
  return res.render("login", { user: req.user });
});

socials.get("/logout", (req: Request, res: Response) => {
  req.logout;
  res.redirect("/auth");
});

socials.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

socials.get(
  "/google/redirect",
  passport.authenticate("google"),
  (req: Request, res: Response) => {
    return res.render("home", { user: req.user });
  }
);

export default socials