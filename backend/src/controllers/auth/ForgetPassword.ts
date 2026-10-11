import type { Response, Request } from "express";
import { userRepository, emailService } from "../../container/index.js";
import { ForgetPassword } from "../../application/use-cases/auth/ForgetPassword.js";
import { forgetPasswordSchema } from "../../validators/auth/forgetPasswordSchema.js";
import { env } from "../../config/env.js";

const forgetPasswordUseCase = new ForgetPassword(userRepository, emailService);

export const forgetPassword = async (req: Request, res: Response) => {
  const validationResult = forgetPasswordSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      errors: validationResult.error.issues,
    });
  }
  const { email } = validationResult.data;
  const url = `${env.CLIENT_URL}/resetPassword`;

  const result = await forgetPasswordUseCase.execute(email, url);

  switch (result.type) {
    case "SUCCESS":
      return res.status(200).json(result);
    case "USER_NOT_FOUND":
      return res.status(404).json(result);
  }
};
