import type { Request, Response } from "express";
import { userRepository } from "../../container/index.js";
import { VerifyResetPassword } from "../../application/use-cases/auth/VerifyResetPassword.js";

const verifyResetPassword = new VerifyResetPassword(userRepository);

export const verifyResetPasswordCode = async (req: Request, res: Response) => {
  const { code } = req.body;
  const result = await verifyResetPassword.execute(code);
  switch (result.type) {
    case "SUCCESS":
      return res.status(200).json(result);
    case "INVALID_OR_EXPIRED_CODE":
      return res.status(400).json(result);
  }
};
