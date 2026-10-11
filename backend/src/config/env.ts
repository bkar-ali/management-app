import dotenv from "dotenv";

dotenv.config();

const RESNED_EMAIL_FROM = process.env.RESNED_EMAIL_FROM;
// const JWT_SECRET = process.env.JWT_SECRET;

// if (!JWT_SECRET) {
//   throw new Error("JWT_SECRET is not defined");
// }
if (!RESNED_EMAIL_FROM) {
  throw new Error("RESNED_EMAIL_FROM is not defined");
}

export const env = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET!,
  CLIENT_URL: process.env.CLIENT_URL,
  RESNED_EMAIL_FROM,
};
