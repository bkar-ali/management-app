import type { UserRepository } from "../../repositories/userRepository.js";
import type { AuthTokenService } from "../../services/AuthTokenService.js";
import type { PasswordOperations } from "../../services/PasswordOperations.js";

type LoginInput = {
  email: string;
  password: string;
};

type LoginResult =
  | {
      success: true;
      type: "SUCCESS";
      message: string;
      token: string;
    }
  | {
      success: false;
      type: "USER_NOT_FOUND";
      message: string;
    }
  | {
      success: false;
      type: "INVALID_PASSWORD";
      message: string;
    }
  | {
      success: false;
      type: "VERIFY_YOUR_EMAIL";
      message: string;
    };

export class LoginUser {
  constructor(
    private userRepository: UserRepository,
    private passwordOperations: PasswordOperations,
    private authTokenService: AuthTokenService,
  ) {}
  async execute(input: LoginInput): Promise<LoginResult> {
    const user = await this.userRepository.findUserForLogin(input.email);

    if (!user) {
      return {
        success: false,
        type: "USER_NOT_FOUND",
        message: "user not found",
      };
    }

    const isPasswordValid = await this.passwordOperations.compare(
      input.password,
      user.password,
    );
    if (!isPasswordValid) {
      return {
        success: false,
        type: "INVALID_PASSWORD",
        message: "Invalid password",
      };
    }

    if (!user.emailVerified) {
      return {
        success: false,
        type: "VERIFY_YOUR_EMAIL",
        message: "Please verify your email first",
      };
    }
    const token = this.authTokenService.generateToken(user.userId);

    return {
      success: true,
      type: "SUCCESS",
      message: "Logged in Successfully",
      token,
    };
  }
}
