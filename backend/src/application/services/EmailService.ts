export interface EmailService {
  sendVerificationEmail(
    email: string,
    verificationTokenCode: string,
  ): Promise<void>;
  sendWelcomeEmail(email: string, name: string): Promise<void>;

  sendResetSuccessEmail(email: string): Promise<void>;

  sendResetPasswordEmail(
    email: string,
    url: string,
    resetPasswordToken: string,
  ): Promise<void>;
}
