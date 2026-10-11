import type { UserRepository } from "../../repositories/userRepository.js";
import type { EmailService } from "../../services/EmailService.js";
import type { PasswordOperations } from "../../services/PasswordOperations.js";
import crypto from "crypto";

export type SignupUserInput = {
  username: string;
  email: string;
  password: string;
};

type SignupResult =
  | {
      success: true;
      type: "CREATED";
      message: string;
    }
  | {
      success: true;
      type: "VERIFICATION_RESENT";
      message: string;
    }
  | {
      success: false;
      type: "EMAIL_EXISTS";
      message: string;
    };

export class SignupUser {
  constructor(
    private userRepository: UserRepository,
    private PasswordOperations: PasswordOperations,
    private emailService: EmailService,
  ) {}

  //  private userRepository: UserRepository;
  // private passwordHasher: PasswordHasher;
  // private emailService: EmailService;

  // constructor(
  //   userRepository: UserRepository,
  //   passwordHasher: PasswordHasher,
  //   emailService: EmailService,
  // ) {
  //   this.userRepository = userRepository;
  //   this.passwordHasher = passwordHasher;
  //   this.emailService = emailService;
  // }

  async execute(input: SignupUserInput): Promise<SignupResult> {
    // throw new Error("Test global error");
    const existingUser = await this.userRepository.findByEmail(input.email);
    const email = existingUser ? existingUser.email : input.email;

    if (existingUser?.emailVerified) {
      // verified existing
      return {
        success: false,
        type: "EMAIL_EXISTS" as const,
        message: "Email already exists",
      };
    }
    const verificationTokenCode = crypto.randomInt(100000, 1000000).toString(); //! Generate a random 6-digit verification token
    const verificationExpires = new Date(Date.now() + 60 * 60 * 1000);

    if (existingUser) {
      await this.userRepository.updateVerificationCode(
        existingUser.userId,
        verificationTokenCode,
        verificationExpires,
      );
      await this.emailService.sendVerificationEmail(
        email,
        verificationTokenCode,
      );

      // unverified existing
      return {
        success: true,
        type: "VERIFICATION_RESENT" as const,
        message: "A new verification code has been generated.",
      };
    } else {
      const hashedPassword = await this.PasswordOperations.hash(input.password);

      await this.userRepository.create({
        username: input.username,
        email: input.email,
        password: hashedPassword,
        emailVerificationToken: verificationTokenCode,
        emailVerificationExpires: verificationExpires,
      });

      await this.emailService.sendVerificationEmail(
        email,
        verificationTokenCode,
      );

      // new user
      return {
        success: true,
        type: "CREATED" as const,
        message: "Verification email sent.",
      };
    }
  }
}
