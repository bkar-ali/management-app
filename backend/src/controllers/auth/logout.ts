import type { Response, Request } from "express";
import { cookieOptions } from "../../utils/generateTokenAndSetCookie.js";

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
