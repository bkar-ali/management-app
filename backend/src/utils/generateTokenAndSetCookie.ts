import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { Response } from "express";

export const cookieOptions = {
  httpOnly: true,
  secure: false, //Production --> true
  sameSite: "lax" as const,
};

export const generateTokenAndSetCookie = (res: Response, userId: number) => {
  const token = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "7d" });

  console.log("SETTING COOKIE FOR USER:", userId);
  console.log("TOKEN:", token);

  res.cookie("token", token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
};

export default generateTokenAndSetCookie;
