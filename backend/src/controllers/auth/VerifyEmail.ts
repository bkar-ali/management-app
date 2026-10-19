import type { Request, Response } from "express";

import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository.js";
import { ResendEmailService } from "../../infrastructure/services/ResendEmailService.js";

import { VerifyEmail } from "../../application/use-cases/auth/VerifyEmail.js";
import { JwtAuthTokenService } from "../../infrastructure/services/JwtAuthTokenService.js";
import { cookieOptions } from "../../utils/generateTokenAndSetCookie.js";

const userRepository = new PrismaUserRepository();
const emailService = new ResendEmailService();
const authTokenService = new JwtAuthTokenService();

const verifyEmail2 = new VerifyEmail(
  userRepository,
  authTokenService,
  emailService,
);
export const verifyEmail = async (req: Request, res: Response) => {
  const { code } = req.body;

  const result = await verifyEmail2.execute({ code });

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.cookie("token", result.token, cookieOptions);
  // res.cookie("token", result.token, {
  //   httpOnly: true,
  //   secure: false,
  //   sameSite: "lax",
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  // });

  return res.status(200).json({
    success: true,
    message: result.message,
  });
};
