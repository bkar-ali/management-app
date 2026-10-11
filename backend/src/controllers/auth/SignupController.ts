import { prisma } from "../../../prisma/prisma.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import type { NextFunction, Request, Response } from "express";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetSuccessEmail,
} from "../../mail/resendEmail.js";
import generateTokenAndSetCookie, {
  cookieOptions,
} from "../../utils/generateTokenAndSetCookie.js";
import { env } from "../../config/env.js";

import { SignupUser } from "../../application/use-cases/auth/SignupUser.js";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository.js";
import { BcryptPasswordOperations } from "../../infrastructure/services/BcryptPasswordOperations.js";
import { ResendEmailService } from "../../infrastructure/services/ResendEmailService.js";

import { signupSchema } from "../../validators/auth/signupSchema.js";
import { VerifyEmail } from "../../application/use-cases/auth/VerifyEmail.js";
import { JwtAuthTokenService } from "../../infrastructure/services/JwtAuthTokenService.js";

const userRepository = new PrismaUserRepository();
const passwordHasher = new BcryptPasswordOperations();
const emailService = new ResendEmailService();
const authTokenService = new JwtAuthTokenService();

// const signupUser = new SignupUser(userRepository, passwordHasher, emailService);
// export const signup = async (req: Request, res: Response) => {
//   // const { username, email, password } = req.body; // HTTP

//   const validationResult = signupSchema.safeParse(req.body);

//   if (!validationResult.success) {
//     return res.status(400).json({
//       success: false,
//       errors: validationResult.error.issues,
//     });
//   }

//   const { username, email, password } = validationResult.data;

//   const result = await signupUser.execute({
//     username,
//     email,
//     password,
//   });
//   // Business Rules Error Handler
//   switch (result.type) {
//     case "CREATED":
//       return res.status(201).json(result);

//     case "VERIFICATION_RESENT":
//       return res.status(200).json(result);

//     case "EMAIL_EXISTS":
//       return res.status(409).json(result);
//   }
// };

// ! Signup --> V1  --> usecase, repositry, services, infstructure
// try {
//   // Database
//   const existingEmail = await prisma.user.findUnique({
//     where: {
//       email,
//     },
//   });

//   // Business Logic
//   if (existingEmail) {
//     if (existingEmail.emailVerified) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already exists",
//       });
//     }

//     // email exists but not verified
//     const verificationTokenCode = crypto
//       .randomInt(100000, 1000000)
//       .toString();

//     const verificationExpires = new Date(Date.now() + 60 * 60 * 1000);

//     await prisma.user.update({
//       where: {
//         userId: existingEmail.userId,
//       },
//       data: {
//         emailVerificationToken: verificationTokenCode,
//         emailVerificationExpires: verificationExpires,
//       },
//     });

//     await sendVerificationEmail(existingEmail.email, verificationTokenCode);

//     return res.status(200).json({
//       success: true,
//       message:
//         "Account already exists but is not verified. A new verification code has been sent.",
//     });
//   }

//   // Business Logic / Database
//   const existingUsername = await prisma.user.findUnique({
//     where: {
//       username,
//     },
//   });

//   // Business Logic
//   if (existingUsername) {
//     return res.status(400).json({
//       success: false,
//       message: "Username already exists",
//     });
//   }
//   // Password Security
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // Business Logic
//   const verificationTokenCode = crypto.randomInt(100000, 1000000).toString(); //! Generate a random 6-digit verification token

//   // Database
//   const newUser = await prisma.user.create({
//     data: {
//       username,
//       email,
//       password: hashedPassword,
//       emailVerificationToken: verificationTokenCode,
//       emailVerificationExpires: new Date(Date.now() + 60 * 60 * 1000), //! Set token expiration time (e.g., 1 hour)
//     },
//   });

//   const { password: _, ...user } = newUser; // Exclude the password from the response

//   // External service Email
//   try {
//     await sendVerificationEmail(email, verificationTokenCode);
//   } catch (error) {
//     console.error("Error sending verification email:", error);
//   }

//   return res.status(201).json({
//     success: true,
//     message: "Account created. Please verify your email.",
//     user,
//   });
// } catch (error) {
//   console.error(error);

//   return res.status(500).json({
//     success: false,
//     message: "Internal server error",
//   });
// }

// ! Signup --> V2 --> Remove try & catch
//   export const signup = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   // const { username, email, password } = req.body; // HTTP

//   const validationResult = signupSchema.safeParse(req.body);

//   if (!validationResult.success) {
//     return res.status(400).json({
//       success: false,
//       errors: validationResult.error.issues,
//     });
//   }

//   const { username, email, password } = validationResult.data; // HTTP
//   try {
//     const result = await signupUser.execute({
//       username,
//       email,
//       password,
//     });
//     // Business Rules Error Handler
//     switch (result.type) {
//       case "CREATED":
//         return res.status(201).json(result);

//       case "VERIFICATION_RESENT":
//         return res.status(200).json(result);

//       case "EMAIL_EXISTS":
//         return res.status(409).json(result);
//     }
//   } catch (error) {
//     // System & Unexpectied Error Handler
//     next(error);
//     // console.error(error);

//     // return res.status(500).json({
//     //   success: false,
//     //   message: "Internal server error",
//     // });
//   }
// };

// const verifyEmail2 = new VerifyEmail(
//   userRepository,
//   authTokenService,
//   emailService,
// );
// export const verifyEmail = async (req: Request, res: Response) => {
//   const { code } = req.body;

//   const result = await verifyEmail2.execute({ code });

//   if (!result.success) {
//     return res.status(400).json(result);
//   }

//   res.cookie("token", result.token, {
//     httpOnly: true,
//     secure: false,
//     sameSite: "lax",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });

//   return res.status(200).json({
//     success: true,
//     message: result.message,
//   });
// };

// ! V1
// export const verifyEmail = async (req: Request, res: Response) => {
//   const { code } = req.body;
//   try {
//     const user = await prisma.user.findFirst({
//       where: {
//         emailVerificationToken: code,
//         emailVerificationExpires: { gt: new Date() },
//       },
//     });

//     if (!user) {
//       return res
//         .status(400)
//         .json({ error: "Invalid or expired verification code" });
//     }

//     await prisma.user.update({
//       where: { userId: user.userId },
//       data: {
//         emailVerified: true,
//         emailVerificationExpires: null,
//         emailVerificationToken: null,
//       },
//     });

//     generateTokenAndSetCookie(res, user.userId);

//     try {
//       await sendWelcomeEmail(user.email, user.username);
//     } catch (error) {
//       console.error("Error sending Welcome email:", error);
//     }

//     res.status(201).json({
//       success: true,
//       message: "Email verified successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// export const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   try {
//     const logedInuser = await prisma.user.findFirst({
//       where: { email },
//     });

//     if (!logedInuser) {
//       return res.status(400).json({ success: false, error: "User Not Found" });
//     }
//     const isPasswordValid = await bcrypt.compare(
//       password,
//       logedInuser.password,
//     );

//     if (!isPasswordValid) {
//       return res
//         .status(400)
//         .json({ success: false, error: "Invalid password" });
//     }

//     if (!logedInuser.emailVerified) {
//       return res.status(403).json({
//         success: false,
//         error: "Please verify your email first",
//       });
//     }

//     generateTokenAndSetCookie(res, logedInuser.userId);

//     const { password: _, ...user } = logedInuser;

//     return res
//       .status(201)
//       .json({ success: true, message: "Loged in  Successfully", user });
//   } catch (error) {
//     return res.status(400).json({ success: false, message: "Login Failed" });
//   }
// };

// export const forgetPassword = async (req: Request, res: Response) => {
//   const { email } = req.body;

//   try {
//     const user = await prisma.user.findFirst({
//       where: { email },
//     });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "User Not Found",
//       });
//     }

//     const resetPasswordToken = crypto.randomInt(100000, 1000000).toString(); //! Generate a random 6-digit reset token
//     const resetPasswordExpiresAt = new Date(Date.now() + 3600000);

//     await prisma.user.update({
//       where: { userId: user?.userId },
//       data: { resetPasswordToken, resetPasswordExpiresAt },
//     });

//     try {
//       await sendResetPasswordEmail(
//         user.email,
//         `${env.CLIENT_URL}/resetPassword`,
//       );
//     } catch (error) {
//       console.error("Error sending Welcome email:", error);
//     }

//     // const { password: _, ...user } = addedTokenUser;

//     return res.status(200).json({
//       success: true,
//       message: "Password reset email sent successfully",
//       code: resetPasswordToken,
//     });
//   } catch (error) {
//     return res.status(400).json({ success: false, message: "Email Not Found" });
//   }
// };

// export const verifyResetPasswordCode = async (req: Request, res: Response) => {
//   const { code } = req.body;

//   try {
//     const user = await prisma.user.findFirst({
//       where: {
//         resetPasswordToken: code,
//         resetPasswordExpiresAt: { gt: new Date() },
//       },
//     });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or expired reset token",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: "correct reset password Token",
//     });
//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       error,
//     });
//   }
// };

export const resetPassword = async (req: Request, res: Response) => {
  const { code, newPassword } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: code,
        resetPasswordExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { userId: user.userId },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiresAt: null,
      },
    });

    sendResetSuccessEmail(user.email);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

// export const checkAuth = async (req: Request, res: Response) => {
//   try {
//     console.log("COOKIES:", req.cookies);
//     const userId = req.userId;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const user = await prisma.user.findUnique({
//       where: {
//         userId,
//       },
//       select: {
//         userId: true,
//         username: true,
//         email: true,
//         role: true,
//         emailVerified: true,
//         profilePictureUrl: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({
//       success: false,
//       message: error,
//     });
//   }
// };
