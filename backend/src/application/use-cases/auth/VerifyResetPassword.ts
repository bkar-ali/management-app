import type { UserRepository } from "../../repositories/userRepository.js";
type VerifyResetPasswordCodeResult =
  | {
      success: true;
      type: "SUCCESS";
      message: string;
    }
  | {
      success: false;
      type: "INVALID_OR_EXPIRED_CODE";
      message: string;
    };

export class VerifyResetPassword {
  constructor(private userRepository: UserRepository) {}
  async execute(code: string): Promise<VerifyResetPasswordCodeResult> {
    const user =
      await this.userRepository.findUserByValidResetPasswordToken(code);
    if (!user) {
      return {
        success: false,
        type: "INVALID_OR_EXPIRED_CODE",
        message: "Invalid or expired reset token",
      };
    }
    return {
      success: true,
      type: "SUCCESS",
      message: "Correct reset password token",
    };
  }
}
