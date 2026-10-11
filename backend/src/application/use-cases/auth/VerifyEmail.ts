import type { UserRepository } from "../../repositories/userRepository.js";
import type { AuthTokenService } from "../../services/AuthTokenService.js";
import type { EmailService } from "../../services/EmailService.js";

export type VerifyEmailInput = {
  code: string;
};

type VerifyEmailResult =
  | {
      success: true;
      message: string;
      token: string;
    }
  | {
      success: false;
      type: "INVALID_OR_EXPIRED_CODE";
      message: string;
    };

export class VerifyEmail {
  constructor(
    private userRepository: UserRepository,
    private authTokenService: AuthTokenService,
    private emailService: EmailService,
  ) {}
  async execute(input: VerifyEmailInput): Promise<VerifyEmailResult> {
    const user = await this.userRepository.findUserByValidVerificationCode(
      input.code,
    );

    if (!user) {
      return {
        success: false,
        type: "INVALID_OR_EXPIRED_CODE",
        message: "Invalid or expired verification code",
      };
    }

    await this.userRepository.updateEmailVerification(user.userId);

    const token = this.authTokenService.generateToken(user.userId);

    try {
      await this.emailService.sendWelcomeEmail(user.email, user.username);
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }

    return {
      success: true,
      message: "Email verified successfully",
      token,
    };
  }
}
