import type { Request, Response } from "express";
import { ResetPassword } from "../../application/use-cases/auth/ResetPassword.js";
import {
  userRepository,
  passwordOperations,
  emailService,
} from "../../container/index.js";

const resetPasswordUseCase = new ResetPassword(
  userRepository,
  passwordOperations,
  emailService,
);

export const resetPassword = async (req: Request, res: Response) => {
  const { code, newPassword } = req.body;
  const result = await resetPasswordUseCase.execute({
    code,
    newPassword,
  });

  switch (result.type) {
    case "SUCCESS":
      return res.status(200).json(result);
    case "INVALID_OR_EXPIRED_CODE":
      return res.status(400).json(result);
  }
};
