import type { Request, Response } from "express";
import { LoginUser } from "../../application/use-cases/auth/LoginUser.js";
import {
  userRepository,
  authTokenService,
  passwordOperations,
} from "../../container/index.js";
import { loginSchema } from "../../validators/auth/loginSchema.js";

const loginUseCase = new LoginUser(
  userRepository,
  passwordOperations,
  authTokenService,
);
export const login = async (req: Request, res: Response) => {
  const validationResult = loginSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      errors: validationResult.error.issues,
    });
  }

  const { email, password } = validationResult.data;

  const result = await loginUseCase.execute({ email, password });

  switch (result.type) {
    case "SUCCESS":
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({
        success: true,
        type: result.type,
        message: result.message,
      });

    case "VERIFY_YOUR_EMAIL":
      return res.status(403).json(result);

    case "INVALID_PASSWORD":
      return res.status(400).json(result);
    case "USER_NOT_FOUND":
      return res.status(400).json(result);
  }
};
