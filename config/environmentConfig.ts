import { config } from "dotenv";
config();

export const environment = {
  PORT: process.env.PORT!,
  MONGODB: process.env.ATLAS!,
  SECRET: process.env.SECRET!,
  googleID: process.env.G_ID!,
  googleSECRET: process.env.G_SECRET!,
  googleURL: process.env.G_URL!,
  googleREFRESH: process.env.G_REFRESH!,
  KEY: process.env.KEY!,
};
