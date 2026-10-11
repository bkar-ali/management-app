// ✅ Repository abstraction
// ✅ Prisma Repository
// ✅ PasswordHasher abstraction
// ✅ bcrypt implementation
// ✅ EmailService abstraction
// ✅ Resend implementation
// ✅ Dependency Injection
// ✅ Application result
// ✅ HTTP status mapping

// ⬇️ التالي

// 1️⃣ Input Validation
// 2️⃣ Error Handling
// 3️⃣ Refactor/Review Signup بالكامل
// 4️⃣ نبدأ Use Case جديد

import type {
  User,
  CreateUserInput,
  LoginUser,
  CurrentAuthUser,
} from "../types/types.js";
export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;

  findUserForLogin(email: string): Promise<LoginUser | null>;

  findUserByValidVerificationCode(code: string): Promise<User | null>;

  findUserByValidResetPasswordToken(code: string): Promise<User | null>;

  findCurrentUser(userId: number): Promise<CurrentAuthUser | null>;

  updatePassword(userId: number, hashedPassword: string): Promise<void>;

  updateResetPasswordToken(
    userId: number,
    token: string,
    expiresAt: Date,
  ): Promise<void>;

  updateVerificationCode(
    userId: number,
    code: string,
    expiresAt: Date,
  ): Promise<void>;

  updateEmailVerification(userId: number): Promise<void>;

  create(input: CreateUserInput): Promise<void>;
}

// SignupUser
//    ↓
// UserRepository
//    ↓
// PrismaUserRepository
//    ↓
// Prisma
//    ↓
// PostgreSQL

// Interface = ماذا أحتاج؟
// Implementation = كيف أنفذه؟

// extends
//    ↓
// "هاتلي اللي عندك وورثه"

// implements
//    ↓
// "أنا هلتزم بالمواصفات دي"

//? What is Dependency Injection?
//* Dependency Injection is a technique
//* where a class receives its dependencies from outside
//* instead of creating them itself.
