import type { UserRepository } from "../../repositories/userRepository.js";
import type { CurrentAuthUser } from "../../types/types.js";
type GetCurrentUserResult =
  | {
      success: false;
      type: "USER_NOT_FOUND";
      message: string;
    }
  | {
      success: true;
      type: "SUCCESS";
      user: CurrentAuthUser;
    };

export class GetCurrentUser {
  constructor(private userRepository: UserRepository) {}
  async execute(userId: number): Promise<GetCurrentUserResult> {
    const user = await this.userRepository.findCurrentUser(userId);

    if (!user) {
      return {
        success: false,
        type: "USER_NOT_FOUND",
        message: "user not found",
      };
    }
    return {
      success: true,
      type: "SUCCESS",
      user,
    };
  }
}
