import type { EmailService } from "../../application/services/EmailService.js";
import { Resend } from "resend";
import { env } from "../../config/env.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "../../mail/emailTemplates.js";

const resend = new Resend(env.RESEND_API_KEY);

export class ResendEmailService implements EmailService {
  async sendVerificationEmail(email: string, verificationTokenCode: string) {
    await resend.emails.send({
      from: env.RESNED_EMAIL_FROM,
      to: email,
      subject: "Verify Your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationTokenCode,
      ),
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await resend.emails.send({
      from: env.RESNED_EMAIL_FROM,
      to: email,
      subject: "Welcome Email",
      html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
    });
  }

  async sendResetPasswordEmail(
    email: string,
    url: string,
    resetPasswordToken: string,
  ): Promise<void> {
    await resend.emails.send({
      from: env.RESNED_EMAIL_FROM,
      to: email,
      subject: "Password Reset Request",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", url).replace(
        "{verificationCode}",
        resetPasswordToken,
      ),
    });
  }

  async sendResetSuccessEmail(email: string): Promise<void> {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
  }
}
