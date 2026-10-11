import type { UserRepository } from "../../repositories/userRepository.js";
import type { EmailService } from "../../services/EmailService.js";
import type { PasswordOperations } from "../../services/PasswordOperations.js";

type ResetPasswordInput = {
  code: string;
  newPassword: string;
};

type ResetPasswordResult =
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

export class ResetPassword {
  constructor(
    private userRepository: UserRepository,
    private passwordOperations: PasswordOperations,
    private emailService: EmailService,
  ) {}
  async execute(input: ResetPasswordInput): Promise<ResetPasswordResult> {
    const user = await this.userRepository.findUserByValidResetPasswordToken(
      input.code,
    );

    if (!user) {
      return {
        success: false,
        type: "INVALID_OR_EXPIRED_CODE",
        message: "Invalid or expired reset token",
      };
    }

    const hashedPassword = await this.passwordOperations.hash(
      input.newPassword,
    );

    await this.userRepository.updatePassword(user.userId, hashedPassword);

    try {
      await this.emailService.sendResetSuccessEmail(user.email);
    } catch (error) {
      console.error("Failed to send reset success email:", error);
    }

    return {
      success: true,
      type: "SUCCESS",
      message: "Password reset successfully",
    };
  }
}
