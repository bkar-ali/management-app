import bcrypt from "bcrypt";
import type { PasswordOperations } from "../../application/services/PasswordOperations.js";

export class BcryptPasswordOperations implements PasswordOperations {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
