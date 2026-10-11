import type { UserRepository } from "../../repositories/userRepository.js";
import crypto from "crypto";
import type { EmailService } from "../../services/EmailService.js";

type ForgetPasswordResult =
  | {
      success: true;
      type: "SUCCESS";
      message: string;
      code: string;
    }
  | {
      success: false;
      type: "USER_NOT_FOUND";
      message: string;
    };
export class ForgetPassword {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService,
  ) {}
  async execute(email: string, url: string): Promise<ForgetPasswordResult> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return {
        success: false,
        type: "USER_NOT_FOUND",
        message: "User Not Found",
      };
    }

    const resetPasswordToken = crypto.randomInt(100000, 1000000).toString();
    const resetPasswordExpiresAt = new Date(Date.now() + 3600000);

    await this.userRepository.updateResetPasswordToken(
      user.userId,
      resetPasswordToken,
      resetPasswordExpiresAt,
    );
    await this.emailService.sendResetPasswordEmail(
      email,
      url,
      resetPasswordToken,
    );

    return {
      success: true,
      type: "SUCCESS",
      message: "Password reset email sent successfully",
      code: resetPasswordToken,
    };
  }
}
