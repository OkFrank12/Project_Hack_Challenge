import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { environment } from "../config/environmentConfig";
import authModel from "../model/authModel";
import { sign } from "jsonwebtoken";

passport.serializeUser((user, done) => {
  return done(null, user);
});

passport.deserializeUser((user, done) => {
  return done(null, user!);
});

passport.use(
  new Strategy(
    {
      clientID: environment.googleID,
      clientSecret: environment.googleSECRET,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        authModel.findOne({ googleID: profile.id }).then((currentUser) => {
          if (currentUser) {
            done(null, currentUser);
            console.log("current: ", currentUser);
          } else {
            new authModel({
              userName: profile.displayName,
              email: profile?.emails![0].value,
              verified: profile?.emails![0].verified,
              token: "",
              googleID: profile.id,
            })
              .save()
              .then((newUser) => {
                console.log("new: ", newUser);
                sign({ id: newUser._id }, environment.SECRET);
                done(null, newUser);
              });

            // console.log(auth);??
          }
        });
      } catch (error: any) {
        console.log(error.message);
      }
    }
  )
);
