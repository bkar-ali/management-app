import type { Request, Response } from "express";
import { SignupUser } from "../../application/use-cases/auth/SignupUser.js";
import { signupSchema } from "../../validators/auth/signupSchema.js";
import {
  userRepository,
  emailService,
  passwordOperations,
} from "../../container/index.js";

const signupUser = new SignupUser(
  userRepository,
  passwordOperations,
  emailService,
);
export const signup = async (req: Request, res: Response) => {
  // const { username, email, password } = req.body; // HTTP

  const validationResult = signupSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      errors: validationResult.error.issues,
    });
  }

  const { username, email, password } = validationResult.data;

  const result = await signupUser.execute({
    username,
    email,
    password,
  });
  // Business Rules Error Handler
  switch (result.type) {
    case "CREATED":
      return res.status(201).json(result);

    case "VERIFICATION_RESENT":
      return res.status(200).json(result);

    case "EMAIL_EXISTS":
      return res.status(409).json(result);
  }
};
