import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { Response } from "express";

// export const cookieOptions = {
//   httpOnly: true,
//   secure: false, //Production --> true
//   sameSite: "lax" as const,
// };

const isProduction = process.env.NODE_ENV === "production";

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const generateTokenAndSetCookie = (res: Response, userId: number) => {
  const token = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "7d" });

  // console.log("SETTING COOKIE FOR USER:", userId);
  // console.log("TOKEN:", token);

  res.cookie("token", token, cookieOptions);
  return token;
};

export default generateTokenAndSetCookie;
