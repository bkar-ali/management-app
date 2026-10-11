import express from "express";
import {
  getUsers,
  getUser,
} from "../../controllers/dashboard/userController.js";
import { verifyToken } from "../../middleware/verifyToken.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/profile", verifyToken, getUser);

export default userRouter;
