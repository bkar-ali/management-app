import type { Response, Request } from "express";
import { GetCurrentUser } from "../../application/use-cases/auth/GetCurrentUser.js";
import { userRepository } from "../../container/index.js";

const getCurrentUser = new GetCurrentUser(userRepository);
export const getCurrentUserController = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const result = await getCurrentUser.execute(userId);

  switch (result.type) {
    case "USER_NOT_FOUND":
      return res.status(404).json(result);
    case "SUCCESS":
      return res.status(200).json(result);
  }
};
