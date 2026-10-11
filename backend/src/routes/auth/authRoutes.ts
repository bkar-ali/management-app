import express from "express";
import {
  // checkAuth,
  // forgetPassword,
  resetPassword,
  // verifyResetPasswordCode,
} from "../../controllers/auth/SignupController.js";

import { verifyToken } from "../../middleware/verifyToken.js";

import { signup } from "../../controllers/auth/Signup.js";
import { verifyEmail } from "../../controllers/auth/VerifyEmail.js";
import { login } from "../../controllers/auth/Login.js";
import { logout } from "../../controllers/auth/logout.js";
import { getCurrentUserController } from "../../controllers/auth/GetCurrentUser.js";
import { forgetPassword } from "../../controllers/auth/ForgetPassword.js";
import { verifyResetPasswordCode } from "../../controllers/auth/VerifyResetPassword.js";
const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/logout", logout);
authRouter.get("/checkAuth", verifyToken, getCurrentUserController);
authRouter.post("/forgetPassword", forgetPassword);
authRouter.post("/verify-reset-password", verifyResetPasswordCode);
authRouter.post("/resetPassword", resetPassword);

export default authRouter;
