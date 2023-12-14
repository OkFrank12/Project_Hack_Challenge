import { Document } from "mongoose";

interface iAuth {
  userName: string;
  email: string;
  password: string;
  token: string;
  verified: boolean;
  googleID: string;
}

export interface iAuthData extends iAuth, Document {}
