import { gt } from "zod";
import { prisma } from "../../../prisma/prisma.js";
import type { UserRepository } from "../../application/repositories/userRepository.js";
import type {
  CreateUserInput,
  CurrentAuthUser,
  LoginUser,
  User,
} from "../../application/types/types.js";

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return {
      userId: user.userId,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
    };
  }

  async findUserForLogin(email: string): Promise<LoginUser | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return {
      userId: user.userId,
      username: user.username,
      email: user.email,
      password: user.password,
      emailVerified: user.emailVerified,
    };
  }

  async findCurrentUser(userId: number): Promise<CurrentAuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        username: true,
        email: true,
        role: true,
        emailVerified: true,
        profilePictureUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return null;

    return {
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      profilePictureUrl: user.profilePictureUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findUserByValidVerificationCode(code: string) {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: code,
        emailVerificationExpires: { gt: new Date() },
      },
    });

    if (!user) return null;

    return {
      userId: user.userId,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
    };
  }

  async findUserByValidResetPasswordToken(code: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: code,
        resetPasswordExpiresAt: { gt: new Date() },
      },
    });
    if (!user) return null;

    return {
      userId: user.userId,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
    };
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await prisma.user.update({
      where: { userId },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiresAt: null,
      },
    });
  }

  async updateResetPasswordToken(
    userId: number,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await prisma.user.update({
      where: { userId },
      data: { resetPasswordToken: token, resetPasswordExpiresAt: expiresAt },
    });
  }

  async updateVerificationCode(
    userId: number,
    code: string,
    expiresAt: Date,
  ): Promise<void> {
    await prisma.user.update({
      where: { userId },
      data: {
        emailVerificationToken: code,
        emailVerificationExpires: expiresAt,
      },
    });
  }

  async updateEmailVerification(userId: number): Promise<void> {
    await prisma.user.update({
      where: { userId },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });
  }

  async create(input: CreateUserInput): Promise<void> {
    await prisma.user.create({
      data: {
        username: input.username,
        email: input.email,
        password: input.password,
        emailVerificationToken: input.emailVerificationToken,
        emailVerificationExpires: input.emailVerificationExpires,
      },
    });
  }
}
